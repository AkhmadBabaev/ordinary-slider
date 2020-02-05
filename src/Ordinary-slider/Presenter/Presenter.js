class Presenter {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.init = this.init.bind(this);

    this.init();
  }

  init() {
    this.model.subscribe(this.view.applyState);
    this.view.subscribe(this.model.setState);
  }
}

export default Presenter;
