function getType(param: unknown): string {
  const type: string = Object.prototype.toString.call(param);
  const readableType: string = type.slice(type.indexOf(' ') + 1, type.length - 1);

  return readableType;
}

function compareType(type: string, value: unknown): boolean {
  return type.toLowerCase() === getType(value).toLowerCase();
}

export function isNumber(value: unknown): boolean {
  const result: unknown = (value as string).length
    ? Number(value)
    : value;

  if (Number.isNaN(result as number)) return false;
  return typeof result === 'number';
}

export function isObject(value: unknown): boolean {
  return compareType('object', value);
}

export function isBoolean(value: unknown): boolean {
  return typeof value === 'boolean';
}

export function isDefined(value: unknown): boolean {
  return (value !== undefined) && (value !== null);
}

export function isHTMLElement(value: unknown): boolean {
  return value instanceof HTMLElement;
}

export function softRounding(num: number): number {
  return Number(num.toFixed(1));
}

export function propertyFilter(obj: { [key: string]: unknown }, properties: string[]): object {
  const result: { [key: string]: unknown } = {};

  properties.forEach((prop: string) => {
    let value: unknown = obj[prop];
    let propName: string = prop;

    if (prop.includes(':')) {
      const firstPart: string = prop.split(':')[0];
      const secondPart: string = prop.split(':')[1];

      if (!firstPart.length) throw new SyntaxError('Invalid value');
      if (!secondPart.length) throw new SyntaxError('Invalid value');

      propName = secondPart;
      value = obj[firstPart];
    }

    isDefined(value) && (result[propName] = value);
  });

  return result;
}
