class Observable {
  private observers: {(cb: any): void}[] = [];

  constructor() {
    this.subscribe = this.subscribe.bind(this);
    this.unsubscribe = this.unsubscribe.bind(this);
    this.notify = this.notify.bind(this);
  }

  public subscribe(cb: (date: any) => void): void {
    this.observers.push(cb);
  }

  public unsubscribe(cb: (date: any) => void): void {
    this.observers = this.observers.filter((observer) => observer !== cb);
  }

  public notify(data: { [key: string]: unknown }): void {
    this.observers.forEach((observer) => observer(data));
  }
}

export default Observable;
