import { useMemo, useState } from 'react';

type UseSearchButtonProps = {
  onSelect: (value: string) => void;
};

export function useSearchButton({ onSelect }: UseSearchButtonProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const searchButtonProps = useMemo(
    () => ({
      onSelect,
      onOpen: () => setIsSearchOpen(true),
      onClose: () => setIsSearchOpen(false)
    }),
    [onSelect]
  );

  return {
    isSearchOpen,
    searchButtonProps
  };
}
