import * as Sentry from '@sentry/react-native';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { userLocation, userSession } from '../../redux/selectors/auth';
import { ReplenishmentList, ReplenishmentTask } from '../../types/replenishment';
import { useReplenishmentContext } from './ReplenishmentContext';

export type ScanType = 'LOCATION' | 'PRODUCT' | 'CONTAINER';

export type ScanResult = 'PASS' | 'FAIL';

/** One scan made by the picker during replenishment, logged whether it matched or not */
export type ScanAttempt = {
  scanType: ScanType;
  result: ScanResult;
  scannedValue: string;
  expectedValue?: string;
  taskId?: string;
  orderNumber?: string;
  productCode?: string;
  locationNumber?: string;
  /** For a container scan, the quantity put in the container */
  quantity?: number;
  /** Why the scan failed, e.g. the error returned when associating the container */
  message?: string;
  userId?: string;
  facilityId?: string;
  /** ISO 8601 */
  timestamp: string;
};

type BuildScanAttemptParams = {
  scanType: ScanType;
  result: ScanResult;
  scannedValue: string;
  expectedValue?: string;
  task?: ReplenishmentTask;
  list?: ReplenishmentList;
  quantity?: number;
  message?: string;
  userId?: string;
  facilityId?: string;
  date?: Date;
};

export function buildScanAttempt({
  scanType,
  result,
  scannedValue,
  expectedValue,
  task,
  list,
  quantity,
  message,
  userId,
  facilityId,
  date = new Date()
}: BuildScanAttemptParams): ScanAttempt {
  return {
    scanType,
    result,
    scannedValue,
    expectedValue,
    taskId: task?.id,
    orderNumber: list?.orderNumber ?? task?.orderNumber,
    productCode: task?.product?.productCode,
    locationNumber: task?.location?.locationNumber,
    quantity,
    message,
    userId,
    facilityId,
    timestamp: date.toISOString()
  };
}

export const SCAN_LOG_TAG = '[ReplenishmentScan]';

/**
 * Logs a scan attempt on the device: one tagged line (logcat ReactNativeJS on Android, also in release builds) and a
 * Sentry breadcrumb, so the attempts come with any error reported later in the session.
 *
 * TODO(scan log): device log only for now, until the customer confirms where scan attempts should be kept. This is
 *  the single place to send them to an API instead.
 */
export function logScanAttempt(attempt: ScanAttempt): void {
  console.info(SCAN_LOG_TAG, JSON.stringify(attempt));
  Sentry.addBreadcrumb({
    category: 'replenishment.scan',
    level: attempt.result === 'FAIL' ? 'warning' : 'info',
    message: `${attempt.scanType} scan ${attempt.result}`,
    data: attempt
  });
}

/** Returns a function logging a scan attempt for the current replenishment task, user and facility */
export function useReplenishmentScanLog() {
  const { currentTask, currentList } = useReplenishmentContext();
  const session = useSelector(userSession);
  const location = useSelector(userLocation);
  const userId = session?.user?.id;
  const facilityId = location?.id;

  return useCallback(
    (
      scanType: ScanType,
      result: ScanResult,
      scannedValue: string,
      expectedValue?: string,
      details?: { quantity?: number; message?: string }
    ) =>
      logScanAttempt(
        buildScanAttempt({
          scanType,
          result,
          scannedValue,
          expectedValue,
          task: currentTask,
          list: currentList,
          quantity: details?.quantity,
          message: details?.message,
          userId,
          facilityId
        })
      ),
    [currentTask, currentList, userId, facilityId]
  );
}
