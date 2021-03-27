# Sunrise-Sunset JS

[![npm](https://img.shields.io/npm/v/sunrise-sunset-api.svg)](https://www.npmjs.com/package/sunrise-sunset-api)
[![license](https://img.shields.io/npm/l/sunrise-sunset-api.svg)](https://github.com/dguo/sunrise-sunset-api/blob/main/LICENSE.txt)
[![bundle size](https://img.shields.io/bundlephobia/minzip/sunrise-sunset-api)](https://bundlephobia.com/result?p=sunrise-sunset-api)
[![CI status](https://github.com/dguo/sunrise-sunset-js/workflows/CI/badge.svg)](https://github.com/dguo/sunrise-sunset-js/actions?query=branch%3Amain)
[![test coverage](https://codecov.io/gh/dguo/sunrise-sunset-js/branch/main/graph/badge.svg)](https://codecov.io/gh/dguo/sunrise-sunset-js)
[![known vulnerabilities](https://snyk.io/test/github/dguo/sunrise-sunset-js/badge.svg?targetFile=package.json)](https://snyk.io/test/github/dguo/sunrise-sunset-js?targetFile=package.json)

JavaScript client for the [Sunrise-Sunset
API](https://sunrise-sunset.org/api).

## Installation

```sh
npm install --save sunrise-sunset-api
```

or

```sh
yarn add sunrise-sunset-api
```

## Usage

```js
import {getSunriseSunsetInfo} from "sunrise-sunset-api";

(async function main() {
    const response = await getSunriseSunsetInfo({
        latitude: 36.72016,
        longitude: -44.42034,
    });
})();
```

## Getting the latitude and longitude

In the browser, you can use the [Geolocation
API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) to get
the user's latitude and longitude.

In a Node.js environment, you could look up the coordinates based on an IP
address. There are several APIs for this, like [IPinfo](https://ipinfo.io/),
[ipstack](https://ipstack.com/), and [ipapi](https://ipapi.co/).

## Attribution

Don't forget to properly attribute the Sunrise-Sunset API with a link to
their site.

## License

MIT
