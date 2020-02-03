class Observable {
  constructor() {
    this.observers = [];
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.notify = this.notify.bind(this);
  }

  subscribe(cb) {
    this.observers.push(cb);
  }

  unsubscribe(cb) {
    this.observers = this.observers.filter((observer) => observer !== cb);
  }

  notify(data) {
    this.observers.forEach((observer) => observer(data));
  }
}

export default Observable;
