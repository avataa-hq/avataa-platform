import { useEffect, useMemo, useRef } from 'react';

interface IProps {
  deps: unknown[];
}

export function useAbortControllerSignalByArgsChange({ deps }: IProps) {
  const controllerRef = useRef<AbortController>();

  const serializedDeps = JSON.stringify(deps);

  const controller = useMemo(() => {
    controllerRef.current?.abort();
    const newController = new AbortController();
    controllerRef.current = newController;
    return newController;
  }, [serializedDeps]);

  useEffect(() => {
    return () => {
      controllerRef.current?.abort();
    };
  }, []);

  return { signal: controller.signal };
}
