const path = require('path');

class Paths {
  constructor() {
    // input
    this.input = '../src';
    this.absInput = path.resolve(__dirname, this.input);

    // output
    this.output = '../dist';
    this.absOutput = path.resolve(__dirname, this.output);

    // auxiliary
    this.auxiliary = 'auxiliary';

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
