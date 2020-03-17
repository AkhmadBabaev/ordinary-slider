import Panel from './components/panel/panel';

window.addEventListener('load', () => {
  const panels = document.querySelectorAll('.js-panel');
  Object.keys(panels).forEach((item, index): {} => new Panel(panels[index] as HTMLElement));
});
