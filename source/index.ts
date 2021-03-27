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

interface BaseSunriseSunsetRequest {
    latitude: number;
    longitude: number;
    date?: string | null;
    apiUrl?: string;
    kyOptions?: KyOptions;
    useMocks?: boolean;
}

interface BaseSnakeCaseSunriseSunsetResults {
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

interface BaseCamelCaseSunriseSunsetResults {
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

interface UnformattedSnakeCaseSunriseSunsetResponse
    extends BaseSnakeCaseSunriseSunsetResults {
    day_length: string;
}

interface UnformattedCamelCaseSunriseSunsetResponse
    extends BaseCamelCaseSunriseSunsetResults {
    dayLength: string;
}

interface FormattedSnakeCaseSunriseSunsetResponse
    extends BaseSnakeCaseSunriseSunsetResults {
    day_length: number;
}

interface FormattedCamelCaseSunriseSunsetResponse
    extends BaseCamelCaseSunriseSunsetResults {
    dayLength: number;
}

export interface SunriseSunsetRequest extends BaseSunriseSunsetRequest {
    formatted?: boolean;
    camelCase?: boolean;
}

type SnakeCaseSunriseSunsetResponse =
    | FormattedSnakeCaseSunriseSunsetResponse
    | UnformattedSnakeCaseSunriseSunsetResponse;

type CamelCaseSunriseSunsetResponse =
    | FormattedCamelCaseSunriseSunsetResponse
    | UnformattedCamelCaseSunriseSunsetResponse;

export type SunriseSunsetResponse =
    | SnakeCaseSunriseSunsetResponse
    | CamelCaseSunriseSunsetResponse;

export async function getSunriseSunsetInfo(
    request: BaseSunriseSunsetRequest & {formatted: false; camelCase?: false}
): Promise<UnformattedSnakeCaseSunriseSunsetResponse>;

export async function getSunriseSunsetInfo(
    request: BaseSunriseSunsetRequest & {formatted: false; camelCase: true}
): Promise<UnformattedCamelCaseSunriseSunsetResponse>;

export async function getSunriseSunsetInfo(
    request: BaseSunriseSunsetRequest & {formatted?: true; camelCase?: false}
): Promise<FormattedSnakeCaseSunriseSunsetResponse>;

export async function getSunriseSunsetInfo(
    request: BaseSunriseSunsetRequest & {formatted?: true; camelCase: true}
): Promise<FormattedCamelCaseSunriseSunsetResponse>;

export async function getSunriseSunsetInfo(
    request: BaseSunriseSunsetRequest & {formatted: boolean; camelCase?: false}
): Promise<SnakeCaseSunriseSunsetResponse>;

export async function getSunriseSunsetInfo(
    request: BaseSunriseSunsetRequest & {formatted: boolean; camelCase: true}
): Promise<CamelCaseSunriseSunsetResponse>;

/* We need to duplicate the implementation signature because only the overloads
   contribute to the final shape of the function signature. See:
   https://github.com/Microsoft/TypeScript/wiki/FAQ#why-am-i-getting-supplied-parameters-do-not-match-any-signature-error
   */
export async function getSunriseSunsetInfo(
    request: SunriseSunsetRequest
): Promise<SunriseSunsetResponse>;

export async function getSunriseSunsetInfo(
    request: SunriseSunsetRequest
): Promise<SunriseSunsetResponse> {
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
