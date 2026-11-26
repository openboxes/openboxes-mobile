import React from 'react';
import { Modal } from 'react-native';
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
jest.mock('@react-navigation/native', () => ({ useIsFocused: () => true }));
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

  it('keeps one scan listener for the whole modal, so scans never reach a field behind the confirm step', () => {
    const { renderer } = render('096619756803');
    expect(mockScan.enabled).toBe(true);

    act(() => button(renderer, 'Remove').onPress());
    expect(mockScan.enabled).toBe(true);
    expect(renderer.root.findAllByProps({ testID: 'scanner' })).toHaveLength(0);
  });

  it('empties the field when the screen reports a failed save, so the same code can be scanned again', () => {
    const { renderer, onSave } = render();
    act(() => {
      scanner(renderer).onChange('096619756803');
      scanner(renderer).onSubmit('096619756803');
    });
    expect(scanner(renderer).value).toBe('096619756803');

    const resetInput = onSave.mock.calls[0][1];
    act(() => resetInput());
    expect(scanner(renderer).value).toBe('');
  });

  it('sends one save at a time: a tap in the same frame as the scan does nothing', () => {
    const { renderer, onSave } = render();
    act(() => scanner(renderer).onChange('ABC-1'));
    // handlers from the render before the save, as a tap landing before the disabled state renders sees them
    const { onSubmit } = scanner(renderer);
    const { onPress } = button(renderer, 'Save');
    act(() => {
      onSubmit('ABC-1');
      onPress();
    });
    expect(onSave).toHaveBeenCalledTimes(1);
    expect(button(renderer, 'Save').disabled).toBe(true);

    // the save failed: the field is emptied and the next save goes through
    act(() => onSave.mock.calls[0][1]());
    act(() => scanner(renderer).onChange('ABC-2'));
    expect(button(renderer, 'Save').disabled).toBe(false);
    act(() => button(renderer, 'Save').onPress());
    expect(onSave).toHaveBeenCalledTimes(2);
  });

  it('does not take scans or close while a save is pending', () => {
    const { renderer, onSave, onClose } = render();
    act(() => scanner(renderer).onSubmit('096619756803'));
    expect(scanner(renderer).acceptsScans).toBe(false);
    expect(button(renderer, 'Cancel').disabled).toBe(true);
    act(() => button(renderer, 'Cancel').onPress());
    act(() => renderer.root.findByType(Modal).props.onRequestClose());
    expect(onClose).not.toHaveBeenCalled();

    act(() => onSave.mock.calls[0][1]());
    expect(scanner(renderer).acceptsScans).toBe(true);
    act(() => button(renderer, 'Cancel').onPress());
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('sends one removal for a double tap on Remove barcode, and allows another after a failure', () => {
    const { renderer, onRemoveBarcode } = render('096619756803');
    act(() => button(renderer, 'Remove').onPress());
    act(() => {
      button(renderer, 'Remove barcode').onPress();
      button(renderer, 'Remove barcode').onPress();
    });
    expect(onRemoveBarcode).toHaveBeenCalledTimes(1);
    expect(button(renderer, 'Remove barcode').disabled).toBe(true);

    act(() => onRemoveBarcode.mock.calls[0][0]());
    expect(button(renderer, 'Remove barcode').disabled).toBe(false);
    act(() => button(renderer, 'Remove barcode').onPress());
    expect(onRemoveBarcode).toHaveBeenCalledTimes(2);
  });

  it('re-enables saving when the modal is opened again', () => {
    const onSave = jest.fn();
    const modal = (visible: boolean) => (
      <EditBarcodeModal visible={visible} onSave={onSave} onRemoveBarcode={jest.fn()} onClose={jest.fn()} />
    );
    let renderer: ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(modal(true));
    });
    act(() => scanner(renderer!).onSubmit('096619756803'));
    // the save succeeded: the screen closes the modal without calling back
    act(() => renderer!.update(modal(false)));
    act(() => renderer!.update(modal(true)));
    act(() => scanner(renderer!).onSubmit('ABC-1'));
    expect(onSave).toHaveBeenCalledTimes(2);
  });

  it('Android Back closes the edit step and returns from the confirm step', () => {
    const { renderer, onClose } = render('096619756803');
    act(() => renderer.root.findByType(Modal).props.onRequestClose());
    expect(onClose).toHaveBeenCalledTimes(1);

    act(() => button(renderer, 'Remove').onPress());
    act(() => renderer.root.findByType(Modal).props.onRequestClose());
    expect(hasButton(renderer, 'Remove barcode')).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('opens on the edit step again after a removal closed it from the confirm step', () => {
    const onSave = jest.fn();
    const onRemoveBarcode = jest.fn();
    const onClose = jest.fn();
    const modal = (visible: boolean, currentBarcode?: string) => (
      <EditBarcodeModal
        visible={visible}
        currentBarcode={currentBarcode}
        onSave={onSave}
        onRemoveBarcode={onRemoveBarcode}
        onClose={onClose}
      />
    );
    let renderer: ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(modal(true, '096619756803'));
    });
    act(() => button(renderer, 'Remove').onPress());
    act(() => button(renderer, 'Remove barcode').onPress());

    // the screen closes the modal and reloads the product without a barcode
    act(() => renderer!.update(modal(false)));
    expect(hasButton(renderer!, 'Remove barcode')).toBe(false);
    act(() => renderer!.update(modal(true)));
    expect(hasButton(renderer!, 'Remove barcode')).toBe(false);
    expect(renderer!.root.findAllByProps({ testID: 'scanner' }).length).toBeGreaterThan(0);
  });
});
