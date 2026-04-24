export const fmtPrice = (n: number): string =>
  '€' + n.toLocaleString('en-US').replace(/,/g, '\u202F');

export const fmtPerSqm = (n: number): string =>
  '€' + n.toLocaleString('en-US').replace(/,/g, '\u202F') + '/m²';

export const fmtSqm = (n: number): string =>
  n.toFixed(1).replace(/\.0$/, '') + ' m²';
