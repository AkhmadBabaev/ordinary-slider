function getType(param) {
  const type = Object.prototype.toString.call(param);
  const readableType = type.slice(type.indexOf(' ') + 1, type.length - 1);

  return readableType;
}

function compareType(value, type) {
  return getType(value).toLowerCase() === type.toLowerCase();
}

export function isNumber(value) {
  const result = value.length
    ? Number(value)
    : value;

  if (Number.isNaN(result)) return false;
  return typeof result === 'number';
}

export function isObject(value) {
  return compareType(value, 'object');
}

export function isBoolean(value) {
  return typeof value === 'boolean';
}

export function isDefined(value) {
  return (value !== undefined) && (value !== null);
}

export function isElement(value) {
  return value instanceof Element;
}

export function softRounding(num) {
  return Number(num.toFixed(1));
}
