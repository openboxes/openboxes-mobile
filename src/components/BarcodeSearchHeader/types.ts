export interface OwnProps {
  subtitle?: string | null;
  placeholder?: string;
  searchBox: boolean;
  onSearchTermSubmit: (query: string) => void;
  resetSearch: () => void;
  autoSearch: boolean | false;
  autoFocus?: boolean | false;
}

export type Props = OwnProps;
