# Changelog

This project attempts to adhere to [Semantic Versioning](http://semver.org).

## [Unreleased]

## [0.2.1] - (2021-05-02)

### Fixed

- Fixed the homepage and repository links in `package.json`.

## [0.2.0] - (2021-05-01)

### Added

- Exported the `UnformattedSunriseSunsetResponse`,
  `FormattedSunriseSunsetResponse`, and `SunriseSunsetResponse` types.

### Changed

- Renamed the `SunriseSunsetRequest` type to `SunriseSunsetOptions`.

### Removed

- Removed the option to get keys in camel case format. This is the default
  format now, with no way to get keys in snake case format. This is to adhere
  to the convention for JavaScript. If you need snake case keys, you can convert
  them yourself.

### Fixed

- Fixed mock mode incorrectly returning an unformatted response when the
  formatting mode isn't specified.

## [0.1.0] - (2021-03-27)

### Added

- Initial implementation

[unreleased]: https://github.com/dguo/sunrise-sunset-js/compare/v0.2.1...HEAD
[0.2.1]: https://github.com/dguo/sunrise-sunset-js/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/dguo/sunrise-sunset-js/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/dguo/sunrise-sunset-js/releases/tag/v0.1.0
