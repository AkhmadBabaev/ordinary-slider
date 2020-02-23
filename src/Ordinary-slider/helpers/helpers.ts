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

export function softRounding(num: number): number {
  return Number(num.toFixed(1));
}

export function propertyFilter(
  obj: { [key: string]: any },
  properties: string[],
): { [x: string]: any } {
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

export function throttle(fn: Function, wait: number): () => void {
  let isThrottled = false;
  let context: unknown;
  let args: unknown[] | null;

  function wrapper(this: unknown, ...params: unknown[]): void {
    if (isThrottled) {
      args = params;
      context = this;
      return;
    }

    fn.apply(this, params);

    isThrottled = true;

    const handler = (): void => {
      isThrottled = false;

      if (args) {
        wrapper.apply(context, args);
        context = null;
        args = null;
      }
    };

    setTimeout(handler, wait);
  }

  return wrapper;
}

export function debounce(fn: Function, wait: number): () => void {
  let timer: any;
  return function wrapper(...params: unknown[]): void {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...params), wait);
  };
}

export function testHasElement(parent: HTMLElement, element: HTMLElement): void {
  expect(parent.contains(element)).toBe(true);
}

export function testHasInstance(elem: unknown, instance: unknown): void {
  expect(elem).toBeInstanceOf(instance);
}
