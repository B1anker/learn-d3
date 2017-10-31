export default class Observe {
  public watch: any = {};
  private data: any;
  private verbose: boolean = false;

  constructor (options) {
    this.data = options.data;
    this.verbose = options.verbose;
    this.convert(this.data, '');
  }

  public get () {
    return this.data;
  }

  public push (data) {
    Object.keys(data).forEach((key) => {
      if (!this.watch.hasOwnProperty(key)) {
        this.watch[key] = [];
        this.watch[key].push(data[key]);
      } else {
        this.watch[key].push(data[key]);
      }
    });
  }

  private convert (data, watchKey) {
    Object.keys(data).forEach((key) => {
      const resultKey = watchKey === '' ? key : `${watchKey}.${key}`;
      const val = data[key];
      if (Object.prototype.toString.call(val).slice(8, -1) === 'Object') {
        this.convert(val, resultKey);
      }
      this.defineObject(data, val, key, resultKey === key ? key : resultKey);
      if (Object.prototype.toString.call(val).slice(8, -1) === 'Array') {
        this.defineArray(val, key, resultKey === key ? key : resultKey);
      }
    });
  }

  private defineObject (data, val, key, watchKey) {
    const self = this;
    Object.defineProperty(data, key, {
      enumerable: true,
      configurable: false,
      get () {
        return val;
      },
      set (newVal) {
        if (newVal === val) {
          return;
        }
        self.fire.bind(self)(watchKey, newVal, val);
        val = newVal;
      }
    });
  }

  private defineArray (val, key, watchKey) {
    const arrayProto = Array.prototype;
    const arrayMethods = Object.create(arrayProto);
    ['pop', 'push', 'shift', 'unshift', 'splice', 'sort', 'reverse', 'slice'].forEach((method) => {
      const original = arrayProto[method];
      const self = this;
      Object.defineProperty(arrayMethods, method, {
        value () {
          const result = original.apply(this, arguments);
          const origin = [];
          val.forEach((d) => {
            origin.push(d);
          });
          self.fire.bind(self)(watchKey, this, origin);
          return result;
        },
        enumerable: false,
        writable: true,
        configurable: true
      });
    });
    val.__proto__ = arrayMethods;
  }

  private fire (watchKey, newVal, oldVal) {
    if (this.watch[watchKey] && this.watch[watchKey].length > 0) {
      if (this.verbose) {
        console.log(`"${watchKey}": ${newVal} --> ${oldVal}`);
      }
      this.watch[watchKey].forEach((fn) => {
        fn(newVal, oldVal, this.get());
      });
    }
  }
}
