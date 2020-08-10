# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [4.0.0] - 2020-10-08

### Changed

- The project name. The new name is o-slider.
- The way of the project is installed through merge output js and css files of plugin.
- Name of class 'o-slider__window-cover' to 'o-slider-window-cover'.
- Names of BEM modifiers.

### Security

- Vulnerable dependencies:
    - websocket-extensions
    - lodash
    - elliptic

## [3.2.0] - 2020-05-18

### Added

- Mobile support.
- Scale of values.

### Removed

- Request animation frame everywhere.

### Fixed

- Issue [#45](https://github.com/AkhmadBabaev/o-slider/issues/45).
- Issue [#43](https://github.com/AkhmadBabaev/o-slider/issues/43).
- Issue [#42](https://github.com/AkhmadBabaev/o-slider/issues/42).
- Issue [#41](https://github.com/AkhmadBabaev/o-slider/issues/41).
- Issue [#39](https://github.com/AkhmadBabaev/o-slider/issues/39).
- Issue [#38](https://github.com/AkhmadBabaev/o-slider/issues/38).
- Issue [#36](https://github.com/AkhmadBabaev/o-slider/issues/36).
- Issue [#33](https://github.com/AkhmadBabaev/o-slider/issues/33).
- Issue [#32](https://github.com/AkhmadBabaev/o-slider/issues/32).
- Issue [#31](https://github.com/AkhmadBabaev/o-slider/issues/31).
- Issue [#30](https://github.com/AkhmadBabaev/o-slider/issues/30).
- Issue [#28](https://github.com/AkhmadBabaev/o-slider/issues/28).
- Issue [#27](https://github.com/AkhmadBabaev/o-slider/issues/27).
- Issue [#26](https://github.com/AkhmadBabaev/o-slider/issues/26).
- Issue [#24](https://github.com/AkhmadBabaev/o-slider/issues/24).
- Issue [#23](https://github.com/AkhmadBabaev/o-slider/issues/23).
- Issue [#22](https://github.com/AkhmadBabaev/o-slider/issues/22).
- Issue [#21](https://github.com/AkhmadBabaev/o-slider/issues/21).
- Issue [#20](https://github.com/AkhmadBabaev/o-slider/issues/20).
- Issue [#19](https://github.com/AkhmadBabaev/o-slider/issues/19).
- Issue [#17](https://github.com/AkhmadBabaev/o-slider/issues/17).
- Issue [#16](https://github.com/AkhmadBabaev/o-slider/issues/16).
- Issue [#15](https://github.com/AkhmadBabaev/o-slider/issues/15).

### Security

- Vulnerable dependencies:
    - kind-of
    - acorn

## [3.1.0] - 2020-03-28

### Added

- Handling a click on the track to move the thumb.

### Changed

- The thumbs can no longer cross each other. 

### Fixed

- Issue [#15](https://github.com/AkhmadBabaev/o-slider/issues/15).

## [3.0.1] - 2020-03-27

### Fixed

- Issue [#17](https://github.com/AkhmadBabaev/o-slider/issues/17).

## [3.0.0] - 2020-03-26

### Changed

- Adaption of the slider values 'from, to' to step size.
- A way to run methods. You should call the methods following the pattern  
`$sliderElement.oSlider('methodName', methodOption)` instead of `$sliderElement.methodName(methodOption)`.
- Transform methods getSettings and setSettings to method 'settings'.

### Removed 

- Method reset.

### Fixed

- Issue [#14](https://github.com/AkhmadBabaev/o-slider/issues/14).

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

- Issue [#9](https://github.com/AkhmadBabaev/o-slider/issues/9).

## [1.0.0] - 2020-03-06

First working release.

[3.2.0]: https://github.com/AkhmadBabaev/o-slider/compare/3.2.0...4.0.0
[3.2.0]: https://github.com/AkhmadBabaev/o-slider/compare/3.1.0...3.2.0
[3.1.0]: https://github.com/AkhmadBabaev/o-slider/compare/3.0.1...3.1.0
[3.0.1]: https://github.com/AkhmadBabaev/o-slider/compare/3.0.0...3.0.1
[3.0.0]: https://github.com/AkhmadBabaev/o-slider/compare/2.0.0...3.0.0
[2.0.0]: https://github.com/AkhmadBabaev/o-slider/compare/1.2.0...2.0.0
[1.2.0]: https://github.com/AkhmadBabaev/o-slider/compare/1.0.1...1.2.0
[1.0.1]: https://github.com/AkhmadBabaev/o-slider/compare/1.0.0...1.0.1
[1.0.0]: https://github.com/AkhmadBabaev/od-slider/compare/0.1.0...1.0.0
