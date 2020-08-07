import { boundMethod } from 'autobind-decorator';

class CheckBox {
  private checkbox: HTMLElement;

  constructor(element: HTMLElement) {
    this.checkbox = element;
  }

  @boundMethod
  public getElement(): HTMLElement {
    return this.checkbox;
  }

  @boundMethod
  public toggle(on?: boolean): void {
    if (!arguments.length) this.checkbox.classList.toggle('checkbox_is_checked');
    else {
      on
        ? this.checkbox.classList.add('checkbox_is_checked')
        : this.checkbox.classList.remove('checkbox_is_checked');
    }
  }

  @boundMethod
  public addListeners(): void {
    this.checkbox.addEventListener('click', this.handleButtonClick);
  }

  @boundMethod
  private handleButtonClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const isButton = target.classList.contains('js-checkbox__button');
    const isTitle = target.classList.contains('js-checkbox__title');
    if (!isButton && !isTitle) return;

    this.toggle();
    this.checkbox.dispatchEvent(new CustomEvent('CHANGED', {
      detail: { isChecked: this.checkbox.classList.contains('checkbox_is_checked') },
      bubbles: true,
    }));
  }
}

export default CheckBox;
