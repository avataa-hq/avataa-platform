declare module 'bpmn-js-properties-panel';
declare module 'bpmn-js-color-picker';
declare module 'papaparse';
declare module '@dagrejs/dagre';

declare global {
  interface Array<T> {
    findLastIndex(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): number;
  }
}
