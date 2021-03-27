import ky from "ky-universal";
import {Options as KyOptions} from "ky";
import camelCaseKeys from "camelcase-keys";

import {
    MOCK_FORMATTED_CAMEL_CASE_RESPONSE,
    MOCK_FORMATTED_SNAKE_CASE_RESPONSE,
    MOCK_UNFORMATTED_CAMEL_CASE_RESPONSE,
    MOCK_UNFORMATTED_SNAKE_CASE_RESPONSE,
} from "./mocks";

export {
    MOCK_FORMATTED_CAMEL_CASE_RESPONSE,
    MOCK_FORMATTED_SNAKE_CASE_RESPONSE,
    MOCK_UNFORMATTED_CAMEL_CASE_RESPONSE,
    MOCK_UNFORMATTED_SNAKE_CASE_RESPONSE,
};

interface BaseSunsetSunriseRequest {
    latitude: number;
    longitude: number;
    date?: string | null;
    apiUrl?: string;
    kyOptions?: KyOptions;
    useMocks?: boolean;
}

interface BaseSnakeCaseSunsetSunriseResults {
    sunrise: string;
    sunset: string;
    solar_noon: string;
    civil_twilight_begin: string;
    civil_twilight_end: string;
    nautical_twilight_begin: string;
    nautical_twilight_end: string;
    astronomical_twilight_begin: string;
    astronomical_twilight_end: string;
}

interface BaseCamelCaseSunsetSunriseResults {
    sunrise: string;
    sunset: string;
    solarNoon: string;
    civilTwilightBegin: string;
    civilTwilightEnd: string;
    nauticalTwilightBegin: string;
    nauticalTwilightEnd: string;
    astronomicalTwilightBegin: string;
    astronomicalTwilightEnd: string;
}

interface UnformattedSnakeCaseSunsetSunriseResponse
    extends BaseSnakeCaseSunsetSunriseResults {
    day_length: string;
}

interface UnformattedCamelCaseSunsetSunriseResponse
    extends BaseCamelCaseSunsetSunriseResults {
    dayLength: string;
}

interface FormattedSnakeCaseSunsetSunriseResponse
    extends BaseSnakeCaseSunsetSunriseResults {
    day_length: number;
}

interface FormattedCamelCaseSunsetSunriseResponse
    extends BaseCamelCaseSunsetSunriseResults {
    dayLength: number;
}

interface SunsetSunriseRequest extends BaseSunsetSunriseRequest {
    formatted?: boolean;
    camelCase?: boolean;
}

type SnakeCaseSunsetSunriseResponse =
    | FormattedSnakeCaseSunsetSunriseResponse
    | UnformattedSnakeCaseSunsetSunriseResponse;

type CamelCaseSunsetSunriseResponse =
    | FormattedCamelCaseSunsetSunriseResponse
    | UnformattedCamelCaseSunsetSunriseResponse;

type SunsetSunriseResponse =
    | SnakeCaseSunsetSunriseResponse
    | CamelCaseSunsetSunriseResponse;

export async function getSunsetSunriseInfo(
    request: BaseSunsetSunriseRequest & {formatted: false; camelCase?: false}
): Promise<UnformattedSnakeCaseSunsetSunriseResponse>;

export async function getSunsetSunriseInfo(
    request: BaseSunsetSunriseRequest & {formatted: false; camelCase: true}
): Promise<UnformattedCamelCaseSunsetSunriseResponse>;

export async function getSunsetSunriseInfo(
    request: BaseSunsetSunriseRequest & {formatted?: true; camelCase?: false}
): Promise<FormattedSnakeCaseSunsetSunriseResponse>;

export async function getSunsetSunriseInfo(
    request: BaseSunsetSunriseRequest & {formatted?: true; camelCase: true}
): Promise<FormattedCamelCaseSunsetSunriseResponse>;

export async function getSunsetSunriseInfo(
    request: BaseSunsetSunriseRequest & {formatted: boolean; camelCase?: false}
): Promise<SnakeCaseSunsetSunriseResponse>;

export async function getSunsetSunriseInfo(
    request: BaseSunsetSunriseRequest & {formatted: boolean; camelCase: true}
): Promise<CamelCaseSunsetSunriseResponse>;

/* We need to duplicate the implementation signature because only the overloads
   contribute to the final shape of the function signature. See:
   https://github.com/Microsoft/TypeScript/wiki/FAQ#why-am-i-getting-supplied-parameters-do-not-match-any-signature-error
   */
export async function getSunsetSunriseInfo(
    request: SunsetSunriseRequest
): Promise<SunsetSunriseResponse>;

export async function getSunsetSunriseInfo(
    request: SunsetSunriseRequest
): Promise<SunsetSunriseResponse> {
    if (!request.latitude) {
        throw new Error("Latitude is a required parameter");
    }
    if (!request.longitude) {
        throw new Error("Longitude is a required parameter");
    }
    if (
        typeof request.latitude !== "number" ||
        !isFinite(request.latitude) ||
        Math.abs(request.latitude) > 90
    ) {
        throw new Error(
            "Latitude must be a number between -90 and 90 (inclusive)"
        );
    }
    if (
        typeof request.longitude !== "number" ||
        !isFinite(request.longitude) ||
        Math.abs(request.longitude) > 180
    ) {
        throw new Error(
            "Longitude must be a number between -180 and 180 (inclusive)"
        );
    }
    if (
        typeof request.date !== "undefined" &&
        request.date !== null &&
        typeof request.date !== "string"
    ) {
        throw new Error("Invalid date");
    }

    if (request.useMocks) {
        if (request.formatted && request.camelCase) {
            return MOCK_FORMATTED_CAMEL_CASE_RESPONSE;
        } else if (request.formatted) {
            return MOCK_FORMATTED_SNAKE_CASE_RESPONSE;
        } else if (!request.formatted && request.camelCase) {
            return MOCK_UNFORMATTED_CAMEL_CASE_RESPONSE;
        } else {
            return MOCK_UNFORMATTED_SNAKE_CASE_RESPONSE;
        }
    }

    const response = await ky(
        request.apiUrl || "https://api.sunrise-sunset.org/json",
        {
            method: "get",
            searchParams: {
                lat: request.latitude,
                lng: request.longitude,
                ...(typeof request.date === "string" && {date: request.date}),
                ...(typeof request.formatted === "boolean" && {
                    formatted: request.formatted ? 1 : 0,
                }),
            },
            ...request.kyOptions,
        }
    );

    const body = await response.json();

    if (request.camelCase) {
        body.results = camelCaseKeys(body.results);
    }

    return body.results;
}
