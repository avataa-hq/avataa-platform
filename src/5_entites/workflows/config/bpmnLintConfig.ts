import type { FlowElement, FlowNode, Node } from 'bpmn-moddle';

interface IBpmnNode extends FlowNode, Node {
  [key: string]: any;
}
interface IBpmnFlow extends FlowElement {
  conditionExpression?: { body: string };
  [key: string]: any;
}
interface IBpmnReporter {
  report: (arg0: any, arg1: string, arg2?: string[]) => void;
  [key: string]: any;
}

function getAugmentedNamespace(n: any) {
  if (n.__esModule) return n;
  const a = Object.defineProperty({}, '__esModule', { value: true });
  Object.keys(n).forEach((k) => {
    const d = Object.getOwnPropertyDescriptor(n, k);
    Object.defineProperty(
      a,
      k,
      d?.get
        ? d
        : {
            enumerable: true,
            get() {
              return n[k];
            },
          },
    );
  });
  return a;
}

function isDefaultFlow_2(node: IBpmnNode, flow: IBpmnFlow) {
  return node.default === flow;
}

function hasCondition_3(flow: IBpmnFlow) {
  return !!flow.conditionExpression;
}

function isConditionalForking(node: IBpmnNode) {
  const defaultFlow = node.default;
  const outgoing = node.outgoing || [];

  return defaultFlow || outgoing.find(hasCondition_3);
}

const conditionalFlows = () => {
  function check(node: IBpmnNode, reporter: IBpmnReporter) {
    if (!isConditionalForking(node)) {
      return;
    }

    const outgoing = node.outgoing || [];

    outgoing.forEach((flow) => {
      const missingCondition = !hasCondition_3(flow) && !isDefaultFlow_2(node, flow);

      if (missingCondition) {
        reporter.report(flow.id, 'Sequence flow is missing condition', ['conditionExpression']);
      }
    });
  }

  return {
    check,
  };
};

function is_g(node: IBpmnNode, type: string) {
  let localType = type;
  if (localType.indexOf(':') === -1) {
    localType = `bpmn:${type}`;
  }

  return typeof node?.$instanceOf === 'function'
    ? node?.$instanceOf(localType)
    : node?.$type === localType;
}

function isAny_6(node: IBpmnNode, types: string[]) {
  return types.some((type) => {
    return is_g(node, type);
  });
}

const index_esm_1 = Object.freeze({
  __proto__: null,
  is: is_g,
  isAny: isAny_6,
});

const require_0 = getAugmentedNamespace(index_esm_1);

const { is: is_f, isAny: isAny_5 } = require_0;

const endEventRequired = () => {
  function hasEndEvent(node: IBpmnNode) {
    const flowElements: IBpmnFlow[] = node.flowElements || [];

    return flowElements.some((n) => is_f(n, 'bpmn:EndEvent'));
  }

  function check(node: IBpmnNode, reporter: IBpmnReporter) {
    if (!isAny_5(node, ['bpmn:Process', 'bpmn:SubProcess'])) {
      return;
    }

    if (!hasEndEvent(node)) {
      const type = is_f(node, 'bpmn:SubProcess') ? 'Sub process' : 'Process';

      reporter.report(node.id, `${type} is missing end event`);
    }
  }

  return { check };
};

const { is: is_e } = require_0;

const eventSubProcessTypedStartEvent = () => {
  function check(node: IBpmnNode, reporter: IBpmnReporter) {
    if (!is_e(node, 'bpmn:SubProcess') || !node.triggeredByEvent) {
      return;
    }

    const flowElements = node.flowElements || [];

    flowElements.forEach((flowElement: IBpmnFlow) => {
      if (!is_e(flowElement, 'bpmn:StartEvent')) {
        return false;
      }

      const eventDefinitions = flowElement.eventDefinitions || [];

      if (eventDefinitions.length === 0) {
        reporter.report(flowElement.id, 'Start event is missing event definition', [
          'eventDefinitions',
        ]);
      }
      return true;
    });
  }

  return {
    check,
  };
};

const { isAny: isAny_4 } = require_0;

const fakeJoin = () => {
  function check(node: IBpmnNode, reporter: IBpmnReporter) {
    if (!isAny_4(node, ['bpmn:Task', 'bpmn:Event'])) {
      return;
    }

    const incoming = node.incoming || [];

    if (incoming.length > 1) {
      reporter.report(node.id, 'Incoming flows do not join');
    }
  }

  return {
    check,
  };
};

const { is: is_d, isAny: isAny_3 } = require_0;

function isForking(node: IBpmnNode) {
  const outgoing = node.outgoing || [];

  return outgoing.length > 1;
}

function hasCondition_2(node: IBpmnNode) {
  return node.conditionExpression;
}

const labelRequired = () => {
  function check(node: IBpmnNode, reporter: IBpmnReporter) {
    if (isAny_3(node, ['bpmn:ParallelGateway', 'bpmn:EventBasedGateway'])) {
      return;
    }

    if (is_d(node, 'bpmn:Gateway') && !isForking(node)) {
      return;
    }

    if (is_d(node, 'bpmn:BoundaryEvent')) {
      return;
    }

    if (is_d(node, 'bpmn:SubProcess')) {
      return;
    }

    if (is_d(node, 'bpmn:SequenceFlow') && !hasCondition_2(node)) {
      return;
    }

    if (isAny_3(node, ['bpmn:FlowNode', 'bpmn:SequenceFlow', 'bpmn:Participant', 'bpmn:Lane'])) {
      const name = (node.name || '').trim();

      if (name.length === 0) {
        reporter.report(node.id, 'Element is missing label/name', ['name']);
      }
    }
  }

  return { check };
};

function flatten_1(arr: any[]) {
  return Array.prototype.concat.apply([], arr);
}

const nativeToString = Object.prototype.toString;
const nativeHasOwnProperty = Object.prototype.hasOwnProperty;
function isUndefined(obj: any) {
  return obj === undefined;
}
function isDefined(obj: any) {
  return obj !== undefined;
}
function isNil(obj: any) {
  return obj == null;
}
function isArray(obj: any) {
  return nativeToString.call(obj) === '[object Array]';
}
function isObject(obj: any) {
  return nativeToString.call(obj) === '[object Object]';
}
function isNumber(obj: any) {
  return nativeToString.call(obj) === '[object Number]';
}
function isFunction(obj: any) {
  const tag = nativeToString.call(obj);
  return (
    tag === '[object Function]' ||
    tag === '[object AsyncFunction]' ||
    tag === '[object GeneratorFunction]' ||
    tag === '[object AsyncGeneratorFunction]' ||
    tag === '[object Proxy]'
  );
}
function isString(obj: Record<string, any>) {
  return nativeToString.call(obj) === '[object String]';
}

function ensureArray(obj: Record<string, any>) {
  if (isArray(obj)) {
    return;
  }

  throw new Error('must supply array');
}

function has(target: Record<string, any>, key: string) {
  return nativeHasOwnProperty.call(target, key);
}

function toMatcher(matcher: any) {
  return isFunction(matcher)
    ? matcher
    : (e: Record<string, any>) => {
        return e === matcher;
      };
}

function toNum(arg: any) {
  return Number(arg);
}

function identity(arg: any) {
  return arg;
}

function forEach(collection: any, iterator: any) {
  if (isUndefined(collection)) {
    return false;
  }

  const convertKey = isArray(collection) ? toNum : identity;

  return Object.keys(collection).some((key) => {
    if (has(collection, key)) {
      const val = collection[key];
      const result = iterator(val, convertKey(key));

      if (result === false) {
        return true;
      }
    }
    return false;
  });
}

function find(collection: Record<string, any>, matcher: any) {
  let localMatcher = matcher;
  localMatcher = toMatcher(localMatcher);
  let match;
  forEach(collection, (val: Record<string, any>, key: string) => {
    if (localMatcher(val, key)) {
      match = val;
      return false;
    }
    return true;
  });
  return match;
}

function findIndex(collection: Record<string, any>, matcher: any) {
  let localMatcher = matcher;
  localMatcher = toMatcher(localMatcher);
  let idx: any = isArray(collection) ? -1 : undefined;
  forEach(collection, (val: Record<string, any>, key: string) => {
    if (localMatcher(val, key)) {
      idx = key;
      return false;
    }
    return true;
  });
  return idx;
}

function filter(collection: Record<string, any>, matcher: any) {
  const result: any[] = [];
  forEach(collection, (val: Record<string, any>, key: string) => {
    if (matcher(val, key)) {
      result.push(val);
    }
  });
  return result;
}

function without(arr: Record<string, any>, matcher: any) {
  const localMatcher = toMatcher(matcher);
  if (isUndefined(arr)) {
    return [];
  }

  ensureArray(arr);
  return arr.filter((el: Record<string, any>, idx: number) => {
    return !localMatcher(el, idx);
  });
}

function reduce(collection: Record<string, any>, iterator: any, result: any) {
  let localResult = result;

  forEach(collection, (value: Record<string, any>, idx: number) => {
    localResult = iterator(result, value, idx);
  });
  return localResult;
}

function every(collection: Record<string, any>, matcher: any) {
  return !!reduce(
    collection,
    (matches: Record<string, any>, val: Record<string, any>, key: string) => {
      return matches && matcher(val, key);
    },
    true,
  );
}

function some(collection: Record<string, any>, matcher: any) {
  return !!find(collection, matcher);
}

function map(collection: Record<string, any>, fn: any) {
  const result: any = [];
  forEach(collection, (val: Record<string, any>, key: string) => {
    result.push(fn(val, key));
  });
  return result;
}

function keys(collection: Record<string, any>) {
  return (collection && Object.keys(collection)) || [];
}

function size(collection: Record<string, any>) {
  return keys(collection).length;
}

function values(collection: Record<string, any>) {
  return map(collection, (val: Record<string, any>) => {
    return val;
  });
}

function toExtractor(extractor: any) {
  return isFunction(extractor)
    ? extractor
    : (e: Record<string, any>) => {
        return e[extractor];
      };
}

function groupBy(collection: Record<string, any>, extractor: any, ...rest: [Record<string, any>?]) {
  const grouped = rest[0] ?? {};
  const normalizedExtractor = toExtractor(extractor);

  forEach(collection, (val: Record<string, any>) => {
    const discriminator = normalizedExtractor(val) || '_';
    if (!grouped[discriminator]) {
      grouped[discriminator] = [];
    }
    grouped[discriminator].push(val);
  });

  return grouped;
}

function uniqueBy(extractor: any, ...collections: any[]) {
  const normalizedExtractor = toExtractor(extractor);
  const grouped: Record<string, any[]> = {};

  forEach(collections, (c: Record<string, any>) => {
    groupBy(c, normalizedExtractor, grouped);
  });

  const result = map(grouped, (val: Record<string, any>) => val[0]);
  return result;
}
const unionBy = uniqueBy;

function sortBy(collection: any[], extractor: any) {
  const normalizedExtractor = toExtractor(extractor);
  const sorted: { d: any; v: any }[] = [];

  forEach(collection, (value: Record<string, any>, key: string) => {
    const disc = normalizedExtractor(value, key);
    const entry = { d: disc, v: value };

    let inserted = false;
    for (let idx = 0; idx < sorted.length; idx++) {
      if (disc < sorted[idx].d) {
        sorted.splice(idx, 0, entry);
        inserted = true;
        break;
      }
    }

    if (!inserted) {
      sorted.push(entry);
    }
  });

  return map(sorted, (e: Record<string, any>) => e.v);
}

function matchPattern(pattern: Record<string, any>) {
  return (el: Record<string, any>) => {
    return every(pattern, (val: Record<string, any>, key: string) => {
      return el[key] === val;
    });
  };
}

function debounce(fn: any, timeout: number) {
  let timer: any;
  let lastArgs: any;
  let lastThis: any;
  let lastNow: any;

  function schedule(newTimeout: any) {
    timer = setTimeout(fire, newTimeout);
  }

  function clear() {
    if (timer) {
      clearTimeout(timer);
    }

    timer = undefined;
    lastNow = undefined;
    lastArgs = undefined;
    lastThis = undefined;
  }

  function fire(force: any) {
    const now = Date.now();
    const scheduledDiff = force ? 0 : lastNow + timeout - now;

    if (scheduledDiff > 0) {
      return schedule(scheduledDiff);
    }

    fn.apply(lastThis, lastArgs);
    clear();

    return null;
  }

  function flush() {
    if (timer) {
      fire(true);
    }

    clear();
  }

  function callback(this: any, ...args: any[]) {
    lastNow = Date.now();
    lastArgs = args;
    lastThis = this;

    if (!timer) {
      schedule(timeout);
    }
  }

  callback.flush = flush;
  callback.cancel = clear;
  return callback;
}

function throttle(fn: (...args: any[]) => void, interval: number) {
  let throttling = false;

  return (...args: any[]) => {
    if (throttling) return;

    fn(...args);
    throttling = true;

    setTimeout(() => {
      throttling = false;
    }, interval);
  };
}

function bind(fn: any, target: any) {
  return fn.bind(target);
}

function _typeof(obj: any) {
  '@babel/helpers - typeof';

  let localTypeOf;
  if (typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol') {
    localTypeOf = (o: any) => {
      return typeof o;
    };
  } else {
    localTypeOf = (o: any) => {
      return o && typeof Symbol === 'function' && o.constructor === Symbol && o !== Symbol.prototype
        ? 'symbol'
        : typeof o;
    };
  }

  return localTypeOf(obj);
}

function extendsFn(
  this: any,
  target: Record<string, any>,
  ...sources: Record<string, any>[]
): Record<string, any> {
  const localExtendsFn =
    Object.assign ||
    function polyfillAssign(
      pTarget: Record<string, any>,
      ...tSources: Record<string, any>[]
    ): Record<string, any> {
      tSources.forEach((source) => {
        Object.keys(source).forEach((key) => {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            pTarget[key] = source[key];
          }
        });
      });
      return pTarget;
    };

  return localExtendsFn(target, ...sources);
}

function assign(target: Record<string, any>, ...others: any[]): Record<string, any> {
  return extendsFn(target, ...others);
}

function set(target: Record<string, any>, path: string, value: any) {
  let currentTarget = target;
  forEach(path, (key: string, idx: number) => {
    if (typeof key !== 'number' && typeof key !== 'string') {
      throw new Error(`illegal key type: ${_typeof(key)}. Key should be of type number or string.`);
    }

    if (key === 'constructor') {
      throw new Error('illegal key: constructor');
    }

    if (key === '__proto__') {
      throw new Error('illegal key: __proto__');
    }

    const nextKey = path[idx + 1];
    let nextTarget = currentTarget[key];

    if (isDefined(nextKey) && isNil(nextTarget)) {
      nextTarget = Number.isNaN(+nextKey) ? {} : [];
      currentTarget[key] = Number.isNaN(+nextKey) ? {} : [];
    }

    if (isUndefined(nextKey)) {
      if (isUndefined(value)) {
        delete currentTarget[key];
      } else {
        currentTarget[key] = value;
      }
    } else {
      currentTarget = nextTarget;
    }
  });
  return target;
}

function get(target: Record<string, any>, path: string, defaultValue: any) {
  let currentTarget: any = target;
  forEach(path, (key: string) => {
    if (isNil(currentTarget)) {
      currentTarget = undefined;
      return false;
    }

    currentTarget = currentTarget[key];
    return true;
  });
  return isUndefined(currentTarget) ? defaultValue : currentTarget;
}

function pick(target: Record<string, any>, properties: string[]) {
  const result: Record<string, any> = {};
  const obj = Object(target);
  forEach(properties, (prop: string) => {
    if (prop in obj) {
      result[prop] = target[prop];
    }
  });
  return result;
}

function omit(target: Record<string, any>, properties: string[]) {
  const result: Record<string, any> = {};
  const obj = Object(target);
  forEach(obj, (prop: any, key: string) => {
    if (properties.indexOf(key) === -1) {
      result[key] = prop;
    }
  });
  return result;
}

function merge(target: Record<string, any>, ...sources: any[]): Record<string, any> {
  if (!sources.length) {
    return target;
  }

  sources.forEach((source: Record<string, any>) => {
    if (!source || !isObject(source)) {
      return;
    }

    forEach(source, (sourceVal: Record<string, any>, key: string) => {
      if (key === '__proto__') {
        return;
      }

      const targetVal = target[key];

      if (isObject(sourceVal)) {
        target[key] = isObject(targetVal)
          ? merge({ ...targetVal }, sourceVal)
          : merge({}, sourceVal);
      } else {
        target[key] = sourceVal;
      }
    });
  });

  return target;
}

const index_esm = Object.freeze({
  __proto__: null,
  assign,
  bind,
  debounce,
  ensureArray,
  every,
  filter,
  find,
  findIndex,
  flatten: flatten_1,
  forEach,
  get,
  groupBy,
  has,
  isArray,
  isDefined,
  isFunction,
  isNil,
  isNumber,
  isObject,
  isString,
  isUndefined,
  keys,
  map,
  matchPattern,
  merge,
  omit,
  pick,
  reduce,
  set,
  size,
  some,
  sortBy,
  throttle,
  unionBy,
  uniqueBy,
  values,
  without,
});

const require_1 = getAugmentedNamespace(index_esm);

const { is: is_c } = require_0;

const { flatten } = require_1;

function hasFlowElements(element: IBpmnNode) {
  return !!element.flowElements;
}

function hasChildLaneSet(element: IBpmnNode) {
  return !!element.childLaneSet;
}

function getAllBpmnElements(rootElements: IBpmnNode) {
  return flatten(
    rootElements.map((rootElement: IBpmnNode) => {
      const laneSet = (rootElement.laneSets && rootElement.laneSets[0]) || rootElement.childLaneSet;

      const elements = flatten(
        [].concat(
          rootElement.flowElements || [],
          (rootElement.flowElements &&
            getAllBpmnElements(rootElement.flowElements.filter(hasFlowElements))) ||
            [],
          rootElement.participants || [],
          rootElement.artifacts || [],
          (laneSet && laneSet.lanes) || [],
          (laneSet && laneSet.lanes && getAllBpmnElements(laneSet.lanes.filter(hasChildLaneSet))) ||
            [],
        ),
      );

      if (elements.length > 0) {
        return elements.map((element: IBpmnNode) => {
          return {
            id: element.id,
            $type: element.$type,
          };
        });
      }
      return [];
    }),
  );
}

function getAllDiBpmnReferences(definitionsNode: IBpmnNode) {
  return flatten(
    definitionsNode.diagrams.map((diagram: IBpmnNode) => {
      const diElements = diagram.plane.planeElement || [];

      return diElements.map((element: IBpmnNode) => {
        return element.bpmnElement.id;
      });
    }),
  );
}

function hasVisualRepresentation(element: IBpmnNode) {
  const noVisRepresentation = ['bpmn:DataObject'];

  return !noVisRepresentation.includes(element.$type);
}

const noBpmndi = () => {
  function check(node: IBpmnNode, reporter: IBpmnReporter) {
    if (!is_c(node, 'bpmn:Definitions')) {
      return false;
    }

    const bpmnElements = getAllBpmnElements(node.rootElements);

    const visualBpmnElements = bpmnElements.filter(hasVisualRepresentation);

    const diBpmnReferences = getAllDiBpmnReferences(node);

    visualBpmnElements.forEach((element: IBpmnNode) => {
      if (diBpmnReferences.indexOf(element.id) === -1) {
        reporter.report(element.id, 'Element is missing bpmndi');
      }
    });

    return false;
  }

  return {
    check,
  };
};

const helper: Record<string, any> = {};

const { is: is_b } = require_0;

function disallowNodeType_2(type: string) {
  return () => {
    function check(node: IBpmnNode, reporter: IBpmnReporter) {
      if (is_b(node, type)) {
        reporter.report(node.id, `Element has disallowed type <${type}>`);
      }
    }

    return {
      check,
    };
  };
}

helper.disallowNodeType = disallowNodeType_2;

const disallowNodeType_1 = helper.disallowNodeType;

const noComplexGateway = disallowNodeType_1('bpmn:ComplexGateway');

const { isAny: isAny_2, is: is_a } = require_0;

function isCompensationBoundary(node: IBpmnNode) {
  const { eventDefinitions } = node;

  if (!is_a(node, 'bpmn:BoundaryEvent')) {
    return false;
  }

  if (!eventDefinitions || eventDefinitions.length !== 1) {
    return false;
  }

  return is_a(eventDefinitions[0], 'bpmn:CompensateEventDefinition');
}

function isCompensationActivity(node: IBpmnNode) {
  return node.isForCompensation;
}

function isCompensationLinked(node: IBpmnNode) {
  const source = isCompensationBoundary(node);
  const target = isCompensationActivity(node);

  return source || target;
}

const noDisconnected = () => {
  function check(node: IBpmnNode, reporter: IBpmnReporter) {
    if (
      !isAny_2(node, ['bpmn:Task', 'bpmn:Gateway', 'bpmn:SubProcess', 'bpmn:Event']) ||
      node.triggeredByEvent
    ) {
      return;
    }

    if (isCompensationLinked(node)) {
      return;
    }

    const incoming = node.incoming || [];
    const outgoing = node.outgoing || [];

    if (!incoming.length && !outgoing.length) {
      reporter.report(node.id, 'Element is not connected');
    }
  }

  return {
    check,
  };
};

const { is: is_9 } = require_0;

function flowKey(flow: IBpmnFlow) {
  const { conditionExpression } = flow;

  const condition = conditionExpression ? conditionExpression.body : '';
  const source = flow.sourceRef ? flow.sourceRef.id : flow.id;
  const target = flow.targetRef ? flow.targetRef.id : flow.id;

  return `${source}#${target}#${condition}`;
}

const noDuplicateSequenceFlows = () => {
  const keyed: Record<string, any> = {};

  const outgoingReported: Record<string, boolean> = {};
  const incomingReported: Record<string, boolean> = {};

  function check(node: IBpmnNode, reporter: IBpmnReporter) {
    if (!is_9(node, 'bpmn:SequenceFlow')) {
      return;
    }

    const key = flowKey(node);

    if (key in keyed) {
      reporter.report(node.id, 'SequenceFlow is a duplicate');

      const sourceId = node.sourceRef.id;
      const targetId = node.targetRef.id;

      if (!outgoingReported[sourceId]) {
        reporter.report(sourceId, 'Duplicate outgoing sequence flows');

        outgoingReported[sourceId] = true;
      }

      if (!incomingReported[targetId]) {
        reporter.report(targetId, 'Duplicate incoming sequence flows');

        incomingReported[targetId] = true;
      }
    } else {
      keyed[key] = node;
    }
  }

  return {
    check,
  };
};

const { is: is_8 } = require_0;

const noGatewayJoinFork = () => {
  function check(node: IBpmnNode, reporter: IBpmnReporter) {
    if (!is_8(node, 'bpmn:Gateway')) {
      return;
    }

    const incoming = node.incoming || [];
    const outgoing = node.outgoing || [];

    if (incoming.length > 1 && outgoing.length > 1) {
      reporter.report(node.id, 'Gateway forks and joins');
    }
  }

  return {
    check,
  };
};

const { isAny: isAny$1 } = require_0;

function hasCondition_1(flow: IBpmnFlow) {
  return !!flow.conditionExpression;
}

function isDefaultFlow_1(node: IBpmnNode, flow: IBpmnFlow) {
  return node.default === flow;
}

const noImplicitSplit = () => {
  function check(node: IBpmnNode, reporter: IBpmnReporter) {
    if (!isAny$1(node, ['bpmn:Task', 'bpmn:Event'])) {
      return;
    }

    const outgoing = node.outgoing || [];

    const outgoingWithoutCondition = outgoing.filter((flow) => {
      return !hasCondition_1(flow) && !isDefaultFlow_1(node, flow);
    });

    if (outgoingWithoutCondition.length > 1) {
      reporter.report(node.id, 'Flow splits implicitly');
    }
  }

  return {
    check,
  };
};

const { disallowNodeType } = helper;

const noInclusiveGateway = disallowNodeType('bpmn:InclusiveGateway');

const { is: is_7 } = require_0;

const singleBlankStartEvent = () => {
  function check(node: IBpmnNode, reporter: IBpmnReporter) {
    if (!is_7(node, 'bpmn:FlowElementsContainer')) {
      return;
    }

    const flowElements = node.flowElements || [];

    const blankStartEvents = flowElements.filter((flowElement: IBpmnNode) => {
      if (!is_7(flowElement, 'bpmn:StartEvent')) {
        return false;
      }

      const eventDefinitions = flowElement.eventDefinitions || [];

      return eventDefinitions.length === 0;
    });

    if (blankStartEvents.length > 1) {
      const type = is_7(node, 'bpmn:SubProcess') ? 'Sub process' : 'Process';

      reporter.report(node.id, `${type} has multiple blank start events`);
    }
  }

  return {
    check,
  };
};

const { is: is_6 } = require_0;

const singleEventDefinition = () => {
  function check(node: IBpmnNode, reporter: IBpmnReporter) {
    if (!is_6(node, 'bpmn:Event')) {
      return;
    }

    const eventDefinitions = node.eventDefinitions || [];

    if (eventDefinitions.length > 1) {
      reporter.report(node.id, 'Event has multiple event definitions', ['eventDefinitions']);
    }
  }

  return {
    check,
  };
};

const { is: is_5, isAny } = require_0;

const startEventRequired = () => {
  function hasStartEvent(node: IBpmnNode) {
    const flowElements = node.flowElements || [];

    return flowElements.some((n: IBpmnNode) => is_5(n, 'bpmn:StartEvent'));
  }

  function check(node: IBpmnNode, reporter: IBpmnReporter) {
    if (!isAny(node, ['bpmn:Process', 'bpmn:SubProcess'])) {
      return;
    }

    if (!hasStartEvent(node)) {
      const type = is_5(node, 'bpmn:SubProcess') ? 'Sub process' : 'Process';

      reporter.report(node.id, `${type} is missing start event`);
    }
  }

  return { check };
};

const { is: is_4 } = require_0;

const subProcessBlankStartEvent = () => {
  function check(node: IBpmnNode, reporter: IBpmnReporter) {
    if (!is_4(node, 'bpmn:SubProcess') || node.triggeredByEvent) {
      return false;
    }

    const flowElements = node.flowElements || [];

    flowElements.forEach((flowElement: IBpmnNode) => {
      if (!is_4(flowElement, 'bpmn:StartEvent')) {
        return false;
      }

      const eventDefinitions = flowElement.eventDefinitions || [];

      if (eventDefinitions.length > 0) {
        reporter.report(flowElement.id, 'Start event must be blank', ['eventDefinitions']);
      }

      return true;
    });

    return true;
  }

  return {
    check,
  };
};

const { is: is_3 } = require_0;

const superfluousGateway = () => {
  function check(node: IBpmnNode, reporter: IBpmnReporter) {
    if (!is_3(node, 'bpmn:Gateway')) {
      return;
    }

    const incoming = node.incoming || [];
    const outgoing = node.outgoing || [];

    if (incoming.length === 1 && outgoing.length === 1) {
      reporter.report(node.id, 'Gateway is superfluous. It only has one source and target.');
    }
  }

  return {
    check,
  };
};

const { is: is_2 } = require_0;

const avoidLanes = () => {
  function check(node: IBpmnNode, reporter: IBpmnReporter) {
    if (is_2(node, 'bpmn:Lane')) {
      reporter.report(node.id, 'lanes should be avoided');
    }
  }

  return {
    check,
  };
};

const { is: is_1 } = require_0;

function hasCondition(flow: IBpmnFlow) {
  return !!flow.conditionExpression;
}

function isDefaultFlow(node: IBpmnNode, flow: IBpmnFlow) {
  return node.default === flow;
}

const forkingConditions = () => {
  function check(node: IBpmnNode, reporter: IBpmnReporter) {
    const outgoing = node.outgoing || [];

    if (!is_1(node, 'bpmn:ExclusiveGateway') || outgoing.length < 2) {
      return;
    }

    outgoing.forEach((flow) => {
      const missingCondition = !hasCondition(flow) && !isDefaultFlow(node, flow);

      if (missingCondition) {
        reporter.report(flow.id, 'Sequence flow is missing condition');
      }
    });
  }

  return {
    check,
  };
};

const { is } = require_0;

const implementationAttributes = [
  'camunda:expression',
  'camunda:delegateExpression',
  'camunda:class',
  'camunda:type',
];

function findNodeProcess(node: IBpmnNode) {
  let parent = node.$parent;

  while (parent && !is(parent, 'bpmn:Process')) {
    parent = parent.$parent;
  }

  return parent as IBpmnNode;
}

function hasConnector(bpmnElement: IBpmnNode) {
  const extensionElements = bpmnElement?.get?.('extensionElements');

  if (!extensionElements) {
    return false;
  }

  return extensionElements.some((extension: IBpmnNode) => {
    return is(extension, 'camunda:Connector');
  });
}

function hasAttribute(bpmnElement: IBpmnNode, attribute: string) {
  return bpmnElement?.get?.(attribute) !== undefined;
}

function hasAnyAttribute(bpmnElement: IBpmnNode, attributes: string[]) {
  return attributes.some((attribute: string) => {
    return hasAttribute(bpmnElement, attribute);
  });
}

const implementation = () => {
  function check(node: IBpmnNode, reporter: IBpmnReporter) {
    if (is(node, 'camunda:ServiceTaskLike')) {
      const process = findNodeProcess(node);

      if (!process || !process?.get?.('isExecutable')) {
        return;
      }

      if (hasConnector(node) || hasAnyAttribute(node, implementationAttributes)) {
        return;
      }

      if (is(node, 'bpmn:BusinessRuleTask') && hasAttribute(node, 'camunda:decisionRef')) {
        return;
      }

      reporter.report(node.id, 'Implementation is missing');
    }
  }

  return {
    check,
  };
};

const cache: Record<string, any> = {};

function createResolver() {
  return {
    resolveRule(pkg: string, ruleName: string) {
      const rule = cache[`${pkg}/${ruleName}`];

      if (!rule) {
        throw new Error(`cannot resolve rule <${pkg}/${ruleName}>`);
      }

      return rule;
    },
    resolveConfig(pkg: string, configName: string) {
      throw new Error(`cannot resolve config <${configName}> in <${pkg}>`);
    },
  };
}

const resolver = createResolver();

const rules = {
  'bpmnlint/conditional-flows': 'error',
  'bpmnlint/end-event-required': 'error',
  'bpmnlint/event-sub-process-typed-start-event': 'error',
  'bpmnlint/fake-join': 'warn',
  'bpmnlint/label-required': 'error',
  'bpmnlint/no-bpmndi': 'error',
  'bpmnlint/no-complex-gateway': 'error',
  'bpmnlint/no-disconnected': 'error',
  'bpmnlint/no-duplicate-sequence-flows': 'error',
  'bpmnlint/no-gateway-join-fork': 'error',
  'bpmnlint/no-implicit-split': 'error',
  'bpmnlint/no-inclusive-gateway': 'error',
  'bpmnlint/single-blank-start-event': 'error',
  'bpmnlint/single-event-definition': 'error',
  'bpmnlint/start-event-required': 'error',
  'bpmnlint/sub-process-blank-start-event': 'error',
  'bpmnlint/superfluous-gateway': 'warning',
  'bpmnlint-plugin-camunda/avoid-lanes': 'warn',
  'bpmnlint-plugin-camunda/forking-conditions': 'error',
  'bpmnlint-plugin-camunda/implementation': 'warning',
};

const config = {
  rules,
};

const bundle = {
  resolver,
  config,
};

cache['bpmnlint/conditional-flows'] = conditionalFlows;
cache['bpmnlint/end-event-required'] = endEventRequired;
cache['bpmnlint/event-sub-process-typed-start-event'] = eventSubProcessTypedStartEvent;
cache['bpmnlint/fake-join'] = fakeJoin;
cache['bpmnlint/label-required'] = labelRequired;
cache['bpmnlint/no-bpmndi'] = noBpmndi;
cache['bpmnlint/no-complex-gateway'] = noComplexGateway;
cache['bpmnlint/no-disconnected'] = noDisconnected;
cache['bpmnlint/no-duplicate-sequence-flows'] = noDuplicateSequenceFlows;
cache['bpmnlint/no-gateway-join-fork'] = noGatewayJoinFork;
cache['bpmnlint/no-implicit-split'] = noImplicitSplit;
cache['bpmnlint/no-inclusive-gateway'] = noInclusiveGateway;
cache['bpmnlint/single-blank-start-event'] = singleBlankStartEvent;
cache['bpmnlint/single-event-definition'] = singleEventDefinition;
cache['bpmnlint/start-event-required'] = startEventRequired;
cache['bpmnlint/sub-process-blank-start-event'] = subProcessBlankStartEvent;
cache['bpmnlint/superfluous-gateway'] = superfluousGateway;
cache['bpmnlint-plugin-camunda/avoid-lanes'] = avoidLanes;
cache['bpmnlint-plugin-camunda/forking-conditions'] = forkingConditions;
cache['bpmnlint-plugin-camunda/implementation'] = implementation;

export { config, resolver };
export default bundle;
