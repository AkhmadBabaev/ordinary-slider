const path = require('path');

class Paths {
  constructor() {
    // input
    this.input = '../src';
    this.absInput = path.resolve(__dirname, this.input);

    // output
    this.output = '../docs';
    this.absOutput = path.resolve(__dirname, this.output);

    // auxiliary
    this.auxiliary = 'auxiliary';

    // components
    this.components = 'components';
    this.absComponents = path.resolve(__dirname, `${this.absInput}/${this.components}`);

    // markup
    this.markup = 'markup';
    this.absMarkup = path.resolve(__dirname, `${this.absInput}/${this.auxiliary}/${this.markup}`);

    // styles
    this.styles = 'styles';
    this.absStyles = path.resolve(__dirname, `${this.absInput}/${this.auxiliary}/${this.styles}`);

    // favicons
    this.favicons = 'favicons';
    this.absFavicons = path.resolve(__dirname, `${this.absInput}/${this.favicons}`);
  }
}

module.exports = new Paths();
