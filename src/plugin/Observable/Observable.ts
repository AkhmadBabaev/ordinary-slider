class Observable {
  private observers: Function[] = [];

  constructor() {
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.notify = this.notify.bind(this);
  }

  public subscribe(cb: Function): void {
    this.observers.push(cb);
  }

  public unsubscribe(cb: Function): void {
    this.observers = this.observers.filter((observer) => observer !== cb);
  }

  public notify(data: { [k: string]: unknown }): void {
    this.observers.forEach((observer) => observer(data));
  }
}

export default Observable;
