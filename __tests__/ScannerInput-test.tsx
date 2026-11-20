import React from 'react';
import TestRenderer, { act, ReactTestRenderer } from 'react-test-renderer';

import { ScannerInput } from '../src/components/ScannerInput';

// The DataWedge listener is replaced by a handle the test calls like a hardware mockScan.
const mockScan: { emit: (data: string) => void; enabled: boolean } = { emit: () => undefined, enabled: false };
jest.mock('../src/hooks/useScanListener', () => ({
  useScanListener: (onScan: (r: { data: string }) => void, enabled: boolean) => {
    mockScan.emit = (data: string) => onScan({ data });
    mockScan.enabled = enabled;
  }
}));
const mockFlash = jest.fn();
jest.mock('../src/components/ScanFlash', () => ({
  useScanFlash: () => ({ flash: mockFlash, isFlashing: false })
}));
jest.mock('@react-navigation/native', () => ({ useIsFocused: () => true }));
jest.mock('react-redux', () => ({ useSelector: () => undefined }));
jest.mock('../src/utils/KeyboardUtils', () => ({ hideSoftKeyboard: jest.fn(), showSoftKeyboard: jest.fn() }));
jest.mock('../src/components/Icons', () => ({ KeyboardIcon: () => null, ScanIcon: () => null }));
jest.mock('../src/utils/Theme', () => ({ colors: new Proxy({}, { get: () => '#000' }) }));
jest.mock('react-native-paper', () => {
  const { View } = require('react-native');
  const mockReact = require('react');
  const TextInput: any = mockReact.forwardRef(function MockTextInput(props: any, ref: any) {
    mockReact.useImperativeHandle(ref, () => ({ isFocused: () => true, focus: () => undefined }));
    return <View testID="text-input" {...props} />;
  });
  TextInput.Icon = function MockIcon() {
    return null;
  };
  return { TextInput };
});

type Harness = { renderer: ReactTestRenderer; onChange: jest.Mock; onSubmit: jest.Mock; setValue: (v: string) => void };

type FieldProps = { acceptsScans?: boolean; autoSubmitTimeout?: number };

function render(options: FieldProps = {}): Harness {
  const onChange = jest.fn();
  const onSubmit = jest.fn();
  let setValue: (v: string) => void = () => undefined;
  function Field() {
    const [value, set] = React.useState('');
    setValue = set;
    return (
      <ScannerInput
        value={value}
        autoSubmitTimeout={options.autoSubmitTimeout ?? 0}
        acceptsScans={options.acceptsScans}
        onChange={(v) => {
          onChange(v);
          set(v);
        }}
        onSubmit={onSubmit}
      />
    );
  }
  let renderer: ReactTestRenderer;
  act(() => {
    renderer = TestRenderer.create(<Field />);
  });
  return { renderer: renderer!, onChange, onSubmit, setValue: (v) => act(() => setValue(v)) };
}

beforeEach(() => mockFlash.mockClear());

describe('ScannerInput', () => {
  it('passes a hardware scan to onChange and onSubmit', () => {
    const { onChange, onSubmit } = render();
    act(() => mockScan.emit('096619756803'));
    expect(onChange).toHaveBeenCalledWith('096619756803');
    expect(onSubmit).toHaveBeenCalledWith('096619756803');
  });

  it('drops a hardware scan with a fail flash when acceptsScans is false, and keeps listening', () => {
    const { onChange, onSubmit } = render({ acceptsScans: false });
    expect(mockScan.enabled).toBe(true);
    act(() => mockScan.emit('096619756803'));
    expect(onChange).not.toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(mockFlash).toHaveBeenCalledWith('fail');
  });

  it('accepts the same scan again once the field was emptied, with auto-submit off', () => {
    const { onSubmit, setValue } = render({ autoSubmitTimeout: 0 });
    act(() => mockScan.emit('ABC-1'));
    act(() => mockScan.emit('ABC-1'));
    expect(onSubmit).toHaveBeenCalledTimes(1);

    // e.g. the save failed and the screen cleared the field for a rescan
    setValue('');
    act(() => mockScan.emit('ABC-1'));
    expect(onSubmit).toHaveBeenCalledTimes(2);
  });
});
