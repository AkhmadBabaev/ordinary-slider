import { Model } from '../Model/Interfaces';
import { View } from '../View/Interfaces';

class Presenter {
  constructor(
    private model: Model,
    private view: View,
  ) {
    this.init();
  }

  private init(): void {
    this.model.subscribe(this.view.applyState);
    this.view.subscribe(this.model.setState);
  }
}

export default Presenter;
