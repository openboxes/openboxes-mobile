import React from 'react';
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer';

import EditBarcodeModal from '../src/screens/ProductDetails/EditBarcodeModal';

// Capture the props the modal hands to its scanner field and buttons, so a test can do what a
// hardware scan (onChange + onSubmit in one tick) or a tap does.
jest.mock('../src/components/ScannerInput', () => ({
  ScannerInput: function MockScannerInput(props: any) {
    const { View } = require('react-native');
    return <View testID="scanner" {...props} />;
  }
}));
jest.mock('../src/components/Button', () => {
  const { View } = require('react-native');
  return function MockButton(props: any) {
    return <View testID={`button-${props.title}`} {...props} />;
  };
});
const mockScan: { emit: () => void; enabled: boolean } = { emit: () => undefined, enabled: false };
jest.mock('../src/hooks/useScanListener', () => ({
  useScanListener: (onScan: () => void, enabled: boolean) => {
    mockScan.emit = onScan;
    mockScan.enabled = enabled;
  }
}));
jest.mock('react-native-paper', () => {
  const { Text } = require('react-native');
  return { Headline: Text, Paragraph: Text, Subheading: Text };
});
jest.mock('../src/utils/Theme', () => ({
  spacing: { small: 4, medium: 8, large: 16 },
  colors: new Proxy({}, { get: () => '#000' }),
  roundness: 4
}));

type Rendered = { renderer: ReactTestRenderer; onSave: jest.Mock; onRemoveBarcode: jest.Mock; onClose: jest.Mock };

function render(currentBarcode?: string): Rendered {
  const onSave = jest.fn();
  const onRemoveBarcode = jest.fn();
  const onClose = jest.fn();
  let renderer: ReactTestRenderer;
  act(() => {
    renderer = TestRenderer.create(
      <EditBarcodeModal
        visible
        currentBarcode={currentBarcode}
        onSave={onSave}
        onRemoveBarcode={onRemoveBarcode}
        onClose={onClose}
      />
    );
  });
  return { renderer: renderer!, onSave, onRemoveBarcode, onClose };
}

const scanner = (r: ReactTestRenderer) => r.root.findByProps({ testID: 'scanner' }).props;
const button = (r: ReactTestRenderer, title: string) => r.root.findByProps({ testID: `button-${title}` }).props;
const hasButton = (r: ReactTestRenderer, title: string) =>
  r.root.findAllByProps({ testID: `button-${title}` }).length > 0;

describe('EditBarcodeModal', () => {
  it('saves the scanned value even though the field state has not re-rendered yet', () => {
    const { renderer, onSave } = render();
    const { onChange, onSubmit } = scanner(renderer);

    // what ScannerInput does for a DataWedge scan: both calls in the same tick, same closure
    act(() => {
      onChange('096619756803');
      onSubmit('096619756803');
    });

    expect(onSave).toHaveBeenCalledTimes(1);
    expect(onSave).toHaveBeenCalledWith('096619756803', expect.any(Function));
  });

  it('trims the value and never saves a blank one', () => {
    const { renderer, onSave } = render();

    act(() => scanner(renderer).onSubmit('   '));
    expect(onSave).not.toHaveBeenCalled();

    act(() => scanner(renderer).onSubmit(' 0123 '));
    expect(onSave).toHaveBeenCalledWith('0123', expect.any(Function));
  });

  it('disables Save while the field is blank and saves the typed value on Save', () => {
    const { renderer, onSave } = render();
    expect(button(renderer, 'Save').disabled).toBe(true);

    act(() => scanner(renderer).onChange('  ABC-1 '));
    expect(button(renderer, 'Save').disabled).toBe(false);

    act(() => button(renderer, 'Save').onPress());
    expect(onSave).toHaveBeenCalledWith('ABC-1', expect.any(Function));
  });

  it('shows Remove only when the product has a barcode', () => {
    expect(hasButton(render().renderer, 'Remove')).toBe(false);
    expect(hasButton(render('096619756803').renderer, 'Remove')).toBe(true);
  });

  it('asks before removing, and Cancel goes back without removing', () => {
    const { renderer, onRemoveBarcode } = render('096619756803');

    act(() => button(renderer, 'Remove').onPress());
    expect(hasButton(renderer, 'Remove barcode')).toBe(true);
    expect(renderer.root.findAllByProps({ testID: 'scanner' })).toHaveLength(0);

    act(() => button(renderer, 'Cancel').onPress());
    expect(hasButton(renderer, 'Remove barcode')).toBe(false);
    expect(onRemoveBarcode).not.toHaveBeenCalled();

    act(() => button(renderer, 'Remove').onPress());
    act(() => button(renderer, 'Remove barcode').onPress());
    expect(onRemoveBarcode).toHaveBeenCalledTimes(1);
  });

  it('keeps listening during the confirm step and drops a scan there', () => {
    const { renderer, onSave, onRemoveBarcode } = render('096619756803');
    expect(mockScan.enabled).toBe(false);

    act(() => button(renderer, 'Remove').onPress());
    expect(mockScan.enabled).toBe(true);
    act(() => mockScan.emit());

    expect(onSave).not.toHaveBeenCalled();
    expect(onRemoveBarcode).not.toHaveBeenCalled();
    expect(hasButton(renderer, 'Remove barcode')).toBe(true);
  });
});
