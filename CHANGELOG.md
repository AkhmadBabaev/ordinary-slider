# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [3.0.1] - 2020-03-27

### Fixed

- Issue [#17](https://github.com/AkhmadBabaev/ordinary-slider/issues/17).

## [3.0.0] - 2020-03-26

### Changed

- Adaption of the slider values 'from, to' to step size.
- A way to run methods. You should call the methods following the pattern  
`$sliderElement.oSlider('methodName', methodOption)` instead of `$sliderElement.methodName(methodOption)`.
- Transform methods getSettings and setSettings to method 'settings'.

### Removed 

- Method reset.

### Fixed

- Issue [#14](https://github.com/AkhmadBabaev/ordinary-slider/issues/14).

## [2.0.0] - 2020-03-17

### Changed

- Default parameters bar and range to false.

## [1.2.0] - 2020-03-16

### Added

- New parameter range.
- New parameter vertical.

### Security

- Vulnerable dependencies:
    - serialize-javascript 
    - minimist

## [1.0.1] - 2020-03-07

### Fixed

- Issue [#9](https://github.com/AkhmadBabaev/ordinary-slider/issues/9).

## [1.0.0] - 2020-03-06

First working release.

[3.0.1]: https://github.com/AkhmadBabaev/ordinary-slider/compare/3.0.0...3.0.1
[3.0.0]: https://github.com/AkhmadBabaev/ordinary-slider/compare/2.0.0...3.0.0
[2.0.0]: https://github.com/AkhmadBabaev/ordinary-slider/compare/1.2.0...2.0.0
[1.2.0]: https://github.com/AkhmadBabaev/ordinary-slider/compare/1.0.1...1.2.0
[1.0.1]: https://github.com/AkhmadBabaev/ordinary-slider/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/AkhmadBabaev/ordinary-slider/compare/0.1.0...1.0.0
