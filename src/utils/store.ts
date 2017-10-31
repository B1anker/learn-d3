export default class Store {
  private state: object;
  private handlers: object = {};

  constructor (state: object) {
    this.state = state;
  }

  public $get (key: string): any {
    return this.state[key];
  }

  public $on (event: string, callback) {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event].push(callback);
  }

  public $emit (event: string, params: any = null) {
    if (this.handlers[event] instanceof Array) {
      this.handlers[event].forEach((handler, index) => {
        handler(this.state, params);
      });
    }
  }

  public $remove (event: string, callback: any) {
    if (this.handlers[event] instanceof Array) {
      this.handlers[event] = this.handlers[event].filter((handler, index) => {
        return handler === callback;
      });
    }
  }

  private bind () {
    // Object.defineProperties();
  }
}
