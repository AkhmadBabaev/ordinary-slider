import Checkbox from './Checkbox';

window.addEventListener('load', () => {
  const checkboxes = document.querySelectorAll('.js-checkbox') as NodeListOf<HTMLElement>;
  checkboxes.forEach((_, index): void => new Checkbox(checkboxes[index]).apply());
});
