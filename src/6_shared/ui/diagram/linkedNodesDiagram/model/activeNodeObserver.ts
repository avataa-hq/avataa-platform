import { D3NodeSelection, InputNode } from './types';

type SubscriberFnType<N extends InputNode = InputNode> = (n?: D3NodeSelection<N>) => void;

class ActiveNodeObserver {
  private subscribers: any[] = [];

  private activeNode?: unknown;

  subscribe<N extends InputNode = InputNode>(callback: SubscriberFnType<N>) {
    this.subscribers.push(callback as SubscriberFnType<N>);
  }

  unsubscribe<N extends InputNode = InputNode>(callback: SubscriberFnType<N>) {
    const index = this.subscribers.indexOf(callback);
    if (index !== -1) {
      this.subscribers.splice(index, 1);
    }
  }

  private trigger<N extends InputNode = InputNode>(n?: D3NodeSelection<N>) {
    this.subscribers.forEach((callback) => callback(n) as SubscriberFnType<N>);
  }

  setActiveNode<N extends InputNode = InputNode>(n?: D3NodeSelection<N>) {
    this.activeNode = n;
    this.trigger(n);
  }

  getActiveNode<N extends InputNode = InputNode>() {
    return this.activeNode === undefined
      ? undefined
      : ({ ...this.activeNode } as D3NodeSelection<N>);
  }
}

export const activeNodeObserver = new ActiveNodeObserver();
