import Panel from './components/panel/panel';

window.addEventListener('load', () => {
  const panels = document.querySelectorAll('.panel');
  Object.keys(panels).forEach((i): void => {
    // eslint-disable-next-line no-new
    new Panel(panels[i as unknown as number] as HTMLElement);
  });
});
