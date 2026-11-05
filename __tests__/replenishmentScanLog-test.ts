import * as Sentry from '@sentry/react-native';

import Location from '../src/data/location/Location';
import Product from '../src/data/product/Product';
import { buildScanAttempt, logScanAttempt, SCAN_LOG_TAG } from '../src/screens/Replenishment/scanLog';
import { ReplenishmentList, ReplenishmentTask } from '../src/types/replenishment';

jest.mock('@sentry/react-native', () => ({ addBreadcrumb: jest.fn() }));

// scanLog.ts also exports a hook, whose imports must not pull the native modules of the app
jest.mock('../src/screens/Replenishment/ReplenishmentContext', () => ({ useReplenishmentContext: jest.fn() }));
jest.mock('react-redux', () => ({ useSelector: jest.fn() }));

const task = {
  id: 'task-002',
  orderNumber: 'R-TASK',
  product: { id: 'prod-002', productCode: '10002' } as Product,
  location: { id: 'bin-002', locationNumber: 'A-2-1' } as Location
} as ReplenishmentTask;

const list = { id: 'order-001', orderNumber: 'R-1001' } as ReplenishmentList;

describe('buildScanAttempt', () => {
  it('describes the scan with the task, list, user and facility', () => {
    const attempt = buildScanAttempt({
      scanType: 'PRODUCT',
      result: 'FAIL',
      scannedValue: '10001',
      expectedValue: '10002',
      task,
      list,
      userId: 'user-1',
      facilityId: 'facility-001',
      date: new Date('2026-11-05T08:30:00Z')
    });

    expect(attempt).toEqual({
      scanType: 'PRODUCT',
      result: 'FAIL',
      scannedValue: '10001',
      expectedValue: '10002',
      taskId: 'task-002',
      orderNumber: 'R-1001',
      productCode: '10002',
      locationNumber: 'A-2-1',
      userId: 'user-1',
      facilityId: 'facility-001',
      timestamp: '2026-11-05T08:30:00.000Z'
    });
  });

  it('falls back to the order number of the task, and leaves out what is not known', () => {
    const attempt = buildScanAttempt({ scanType: 'LOCATION', result: 'FAIL', scannedValue: 'X', task });

    expect(attempt.orderNumber).toBe('R-TASK');
    expect(attempt.expectedValue).toBeUndefined();
    expect(attempt.userId).toBeUndefined();
    expect(attempt.facilityId).toBeUndefined();
    expect(Date.parse(attempt.timestamp)).not.toBeNaN();
  });
});

describe('logScanAttempt', () => {
  let consoleInfo: jest.SpyInstance;

  beforeEach(() => {
    consoleInfo = jest.spyOn(console, 'info').mockImplementation(() => {});
    (Sentry.addBreadcrumb as jest.Mock).mockClear();
  });

  afterEach(() => {
    consoleInfo.mockRestore();
  });

  it.each([
    ['FAIL', 'warning'],
    ['PASS', 'info']
  ] as const)('logs a %s scan as one tagged line and a %s breadcrumb', (result, level) => {
    const attempt = buildScanAttempt({ scanType: 'LOCATION', result, scannedValue: 'A-2-1', task, list });

    logScanAttempt(attempt);

    expect(consoleInfo).toHaveBeenCalledTimes(1);
    expect(consoleInfo).toHaveBeenCalledWith(SCAN_LOG_TAG, JSON.stringify(attempt));
    expect(Sentry.addBreadcrumb).toHaveBeenCalledTimes(1);
    expect(Sentry.addBreadcrumb).toHaveBeenCalledWith(
      expect.objectContaining({ category: 'replenishment.scan', level, data: attempt })
    );
  });
});
