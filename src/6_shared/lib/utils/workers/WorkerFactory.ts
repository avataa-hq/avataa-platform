type FunctionType<T extends any[], R> = (...args: T) => R;

export default class WorkerFactory<T extends any[], R> {
  worker: Worker;

  constructor(workerFunction: FunctionType<T, R>) {
    const workerCode = workerFunction.toString();
    const workerBlob = new Blob([`(${workerCode})()`]);
    this.worker = new Worker(URL.createObjectURL(workerBlob));
  }
}
