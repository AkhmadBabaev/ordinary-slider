function importAll(r: any): void {
  r.keys().forEach(r);
}

importAll((require as any).context('@components', true, /\.scss|(-init\.ts)$/));
