import * as React from 'react';

function useMemoizedDeps<T extends any[]>(
  deps: T,
  comparator: (prevDeps: T, currentDeps: T) => boolean
) {
  const memoizedDeps = React.useRef(deps);

  if (!comparator(deps, memoizedDeps.current)) {
    memoizedDeps.current = deps;
  }

  return memoizedDeps.current;
}

export function useEffectWithComparator<D extends any[]>(
  callback: React.EffectCallback,
  deps: D,
  comparator: (previousDeps: D, currentDeps: D) => boolean
) {
  const memoizedDeps = useMemoizedDeps(deps, comparator);

  return React.useEffect(callback, memoizedDeps);
}
