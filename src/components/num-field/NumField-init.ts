import NumField from './NumField';

const numFields = document.querySelectorAll('.js-num-field') as NodeListOf<HTMLElement>;

numFields.forEach((_, index): void => new NumField(numFields[index]).addListeners());
