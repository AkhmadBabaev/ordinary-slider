import Observable from '../Observable/Observable';

class Model extends Observable {
  constructor(state) {
    super();

    this.state = {
      position: 0,
    };

    this.setState = this.setState.bind(this);
    this.setState(state);
  }

  setState({ position }) {
    this.notify(position);
    this.state = { position };
  }

  getState() {
    return this.state || {};
  }
}

export default Model;
