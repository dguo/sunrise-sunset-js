# Sunrise-Sunset JS

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
