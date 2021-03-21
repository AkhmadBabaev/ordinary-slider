import Checkbox from './Checkbox';

const checkboxes: NodeListOf<HTMLElement> = document.querySelectorAll('.js-checkbox');
checkboxes.forEach((_, index): void => new Checkbox(checkboxes[index]).addListeners());
