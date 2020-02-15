module.exports = {
  '*.ts': () => 'tsc --noEmit',
  '*.{ts,js}': 'eslint',
};
