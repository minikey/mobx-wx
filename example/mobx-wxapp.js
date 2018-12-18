import {
  autorun,
  isObservableObject,
  isObservableArray,
  isBoxedObservable,
  isObservableMap,
  toJS
} from "mobx";
import diff from './diff';

function wxObserver(context, mapStateToProps, options = {}) {
  let microTask = []; // 微任务
  if (!isTypeFunction(mapStateToProps)) {
    throw new TypeError("mapStateToProps 必须是一个function");
  }

  const delay = options.delay || 20;
  const afterSetData = options.afterSetData || function() {};

  context.$nextTick = function(func) {
    if (!isTypeFunction(func)) {
      throw new Error('nextTick参数必须为function');
    }
    microTask.push(func);
  };

  let tempdata = {};
  let last = 0;
  const update = nextdata => {
    Object.assign(tempdata, nextdata);
    clearTimeout(last);
    last = setTimeout(() => {
      let diffProps = diff(tempdata, context.data);
      if (Object.keys(diffProps).length > 0) {
        const hash = {};
        let key = '';
        for (key in diffProps) {
          hash[key] = diffProps[key];
        }
        context.setData(hash, () => {
          try {
            afterSetData(hash);
          } catch(e) {
            console.log(e);
          }
          microTask.forEach((func) => {
            try {
              func.call(this);
            } catch(e) {
              console.log(e);
            }
          });
          microTask = [];
        });
      }
      tempdata = {};
    }, delay);
  };
  const func = mapStateToProps;
  mapStateToProps = function() {
    const data = func();
    for (let k in data) {
      const item = data[k];
      if (
        isObservableObject(item) ||
        isObservableArray(item) ||
        isObservableObject(item) ||
        isBoxedObservable(item) ||
        isObservableMap(item)
      ) {
        data[k] = toJS(item);
      }
    }
    update(data);
  };
  const disposer = autorun(mapStateToProps);
  const onUnload = context.onUnload;
  if (onUnload) {
    context.onUnload = function() {
      disposer();
      onUnload.apply(context, arguments);
    };
  }
  return disposer;
}

function isTypeFunction(fn) {
  return typeof fn === "function";
}

function mapData(observable) {
  if (!('$mobx' in observable)) {
    throw new Error('对象不是mobx对象');
  }
  return Object.keys(observable.$mobx.values).reduce((c, key) => {
    c[key] = observable[key];
    return c;
  }, {});
}

export { wxObserver, mapData };
