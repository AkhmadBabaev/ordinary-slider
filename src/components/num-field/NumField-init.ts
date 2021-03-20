import NumField from './NumField';

const numFields: NodeListOf<HTMLElement> = document.querySelectorAll('.js-num-field');
numFields.forEach((_, index): void => new NumField(numFields[index]).addListeners());
