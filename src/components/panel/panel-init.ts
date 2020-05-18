import Panel from './panel';

window.addEventListener('load', () => {
  const panels = document.querySelectorAll('.js-panel') as NodeListOf<HTMLElement>;
  Object.keys(panels).forEach((item, index): {} => new Panel(panels[index]));
});
