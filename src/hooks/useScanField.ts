import { useCallback, useState } from 'react';

import { useScanFlash } from '../components/ScanFlash';
import { EMPTY_STRING } from '../constants';

// `fail` clears the field so the same barcode can be rescanned; the message stays until the next input.
export function useScanField() {
  const { flash } = useScanFlash();
  const [value, setValue] = useState<string>(EMPTY_STRING);
  const [error, setError] = useState<string | null>(null);

  const onChange = useCallback((next: string) => {
    setValue(next);
    setError(null);
  }, []);

  const pass = useCallback(
    (onDone?: () => void) => {
      setError(null);
      flash('pass', onDone);
    },
    [flash]
  );

  const fail = useCallback(
    (message: string, onDone?: () => void) => {
      setValue(EMPTY_STRING);
      // Callers pass saga error messages, which are untyped and can be empty or non-string.
      setError(typeof message === 'string' && message ? message : 'Something went wrong.');
      flash('fail', onDone);
    },
    [flash]
  );

  return { value, setValue, error, onChange, pass, fail };
}
