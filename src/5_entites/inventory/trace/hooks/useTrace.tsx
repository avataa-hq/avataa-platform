import { useState } from 'react';
import { INodeByMoIdKeys, IRoute } from '../model';

export const useTrace = () => {
  const [traceRouteValue, setTraceRouteValue] = useState<IRoute | null>(null);
  // const [traceGraphKey, setTraceGraphKey] = useState('');
  const [traceNodesByMoIdKeysValue, setTraceNodesByMoIdKeysValue] =
    useState<INodeByMoIdKeys | null>(null);

  return {
    traceRouteValue,
    setTraceRouteValue,
    // traceGraphKey,
    // setTraceGraphKey,
    traceNodesByMoIdKeysValue,
    setTraceNodesByMoIdKeysValue,
  };
};
