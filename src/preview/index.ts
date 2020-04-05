import Panel from '@components/panel/panel';

function importAll(r: any): void {
  r.keys().forEach(r);
}

importAll((require as any).context('@components', true, /\.scss$/));

window.addEventListener('load', () => {
  const panels = document.querySelectorAll('.js-panel');
  Object.keys(panels).forEach((item, index): {} => new Panel(panels[index] as HTMLElement));
});
