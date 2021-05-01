# Sunrise-Sunset JS

[![npm](https://img.shields.io/npm/v/sunrise-sunset-api.svg)](https://www.npmjs.com/package/sunrise-sunset-api)
[![license](https://img.shields.io/npm/l/sunrise-sunset-api.svg)](https://github.com/dguo/sunrise-sunset-api/blob/main/LICENSE.txt)
[![bundle size](https://img.shields.io/bundlephobia/minzip/sunrise-sunset-api)](https://bundlephobia.com/result?p=sunrise-sunset-api)
[![CI status](https://github.com/dguo/sunrise-sunset-js/workflows/CI/badge.svg)](https://github.com/dguo/sunrise-sunset-js/actions?query=branch%3Amain)
[![test coverage](https://codecov.io/gh/dguo/sunrise-sunset-js/branch/main/graph/badge.svg)](https://codecov.io/gh/dguo/sunrise-sunset-js)
[![known vulnerabilities](https://snyk.io/test/github/dguo/sunrise-sunset-js/badge.svg?targetFile=package.json)](https://snyk.io/test/github/dguo/sunrise-sunset-js?targetFile=package.json)

JavaScript client for the [Sunrise-Sunset API](https://sunrise-sunset.org/api).
This client works in browser and Node.js environments.

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

The response is in this format. Note that all times are in
[UTC](https://en.wikipedia.org/wiki/Coordinated_Universal_Time).

```js
{
    sunrise: "8:02:42 AM",
    sunset: "9:46:40 PM",
    solarNoon: "2:54:41 PM",
    dayLength: "13:43:58",
    civilTwilightBegin: "7:34:56 AM",
    civilTwilightEnd: "10:14:26 PM",
    nauticalTwilightBegin: "7:01:18 AM",
    nauticalTwilightEnd: "10:48:04 PM",
    astronomicalTwilightBegin: "6:25:35 AM",
    astronomicalTwilightEnd: "11:23:47 PM"
}
```

You can get the response for a specific date (in `YYYY-MM-DD` format) with the
`date` option. If you don't pass a date, you'll get the response for whatever
the API thinks is the current date.

```js
const response = await getSunriseSunsetInfo({
    latitude: 36.72016,
    longitude: -44.42034,
    date: "2021-10-31"
});
```

You can turn off formatting with the `formatted` option.

```js
const response = await getSunriseSunsetInfo({
    latitude: 36.72016,
    longitude: -44.42034,
    formatted: false
});
```

Which makes the info come back in this format: `dayLength` is an integer number
of seconds, and the times are in [ISO
8601](https://en.wikipedia.org/wiki/ISO_8601) format.

```js
{
    sunrise: "2021-05-01T08:02:42+00:00",
    sunset: "2021-05-01T21:46:40+00:00",
    solarNoon: "2021-05-01T14:54:41+00:00",
    dayLength: 49438,
    civilTwilightBegin: "2021-05-01T07:34:56+00:00",
    civilTwilightEnd: "2021-05-01T22:14:26+00:00",
    nauticalTwilightBegin: "2021-05-01T07:01:18+00:00",
    nauticalTwilightEnd: "2021-05-01T22:48:04+00:00",
    astronomicalTwilightBegin: "2021-05-01T06:25:35+00:00",
    astronomicalTwilightEnd: "2021-05-01T23:23:47+00:00"
}
```

## Attribution

Don't forget to properly attribute the Sunrise-Sunset API with a link to
their site.

## Ky

This client uses [Ky](https://github.com/sindresorhus/ky) to make the API
request. Be aware that Ky has a built-in
[retry](https://github.com/sindresorhus/ky#retry) mechanism for failed requests.

Ky is built on the [Fetch
API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API), and here's an
example of how you might handle a Fetch error.

```js
import ky from "ky-universal";

try {
    const response = await getSunriseSunsetInfo({
        latitude: 36.72016,
        longitude: -44.42034,
    });
} catch (error) {
    if (error instanceof ky.HTTPError && error.response.status === 400) {
        // Get the actual body that the API responded with
        console.error(await error.response.json());
    }
    console.error(error);
}
```

## API

### getSunriseSunsetInfo(options)

#### options

Type: `object`

##### latitude

Type: `number`

Should be a value between -90 and 90 (inclusive).

##### longitude

Type: `number`

Should be a value between -180 and 180 (inclusive).

##### date

Type: `string | null`\
Default: `current date (according to the API)`

Pass this to get the info for a particular date. The value should be in a
`YYYY-MM-DD` format.

##### formatted

Type: `boolean`\
Default: `true`

Formatted responses have times like `8:02:42 AM` and a `dayLength` like
`13:43:58` (`HH:MM:SS` format). Unformatted responses have times like
`2021-05-01T08:02:42+00:00` (ISO 8601 format) and a `dayLength` like `49438`
(integer number of seconds).

##### apiUrl

Type: `string`\
Default: `https://api.sunrise-sunset.org/json`

Pass this to override the API endpoint if it changes, and I am slow to update the
code.

##### kyOptions

Type: `object`\
Default: `{}`

Pass this to override any [Ky
options](https://github.com/sindresorhus/ky/blob/main/readme.md#options).

##### useMocks

Type: `boolean`\
Default: `false`

Turn on [mock mode](#Mocks).

## Getting the Latitude and Longitude

In the browser, you can use the [Geolocation
API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) to get
the user's latitude and longitude, assuming the user gives permission.

In a Node.js environment, you can look up the coordinates based on an IP
address. There are several APIs for this, like [IPinfo](https://ipinfo.io/),
[ipstack](https://ipstack.com/), and [ipapi](https://ipapi.co/).

## Types

This library is written in [TypeScript](https://www.typescriptlang.org/) and
exports some types that you might find useful.

```ts
import {
    SunriseSunsetOptions,
    UnformattedSunriseSunsetResponse,
    FormattedSunriseSunsetResponse,
    SunriseSunsetResponse
} from "sunrise-sunset-js";
```

`SunriseSunsetOptions` describes the object that is passed to
`getSunriseSunsetInfo`.

`SunriseSunsetResponse` is just a union of the unformatted and formatted
responses.

## Mocks

For automated tests or for any other situation where you don't want to make
actual network requests, you can turn on mock mode, which will make the function
return hardcoded responses.

```js
const response = await getSunriseSunsetInfo({
    latitude: 36.72016,
    longitude: -44.42034,
    useMocks: true
});
```

You can also import the mock responses.

```js
import {
    MOCK_FORMATTED_RESPONSE,
    MOCK_UNFORMATTED_RESPONSE
} from "sunrise-sunset-js";

mockFunction.mockResolvedValue(MOCK_FORMATTED_RESPONSE);
```

Of course, you can always come up with your own mocks or overwrite specific
fields as necessary.

```js
const mockResponse = {
    ...MOCK_FORMATTED_RESPONSE,
    dayLength: "12:00:00"
}
```

## License

MIT
