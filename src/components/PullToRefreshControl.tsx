import React, { useCallback, useEffect, useRef, useState } from 'react';
import { RefreshControl, RefreshControlProps } from 'react-native';

type Props = Omit<RefreshControlProps, 'refreshing' | 'onRefresh'> & {
  onRefresh: (done: () => void) => void;
};

export default function PullToRefreshControl({ onRefresh, ...props }: Props) {
  const [refreshing, setRefreshing] = useState(false);
  const isMounted = useRef(true);

  useEffect(
    () => () => {
      isMounted.current = false;
    },
    []
  );

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    onRefresh(() => {
      if (isMounted.current) {
        setRefreshing(false);
      }
    });
  }, [onRefresh]);

  return <RefreshControl {...props} refreshing={refreshing} onRefresh={handleRefresh} />;
}
