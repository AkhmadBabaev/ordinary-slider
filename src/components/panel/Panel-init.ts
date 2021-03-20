import Panel from './Panel';

window.addEventListener('load', () => {
  const panels: NodeListOf<HTMLElement> = document.querySelectorAll('.js-panel');
  panels.forEach((_, index): {} => new Panel(panels[index]));
});
