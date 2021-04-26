import ky from "ky-universal";
import {Options as KyOptions} from "ky";
import camelCaseKeys from "camelcase-keys";

import {MOCK_FORMATTED_RESPONSE, MOCK_UNFORMATTED_RESPONSE} from "./mocks";

export {MOCK_FORMATTED_RESPONSE, MOCK_UNFORMATTED_RESPONSE};

interface BaseSunriseSunsetOptions {
    latitude: number;
    longitude: number;
    date?: string | null;
    apiUrl?: string;
    kyOptions?: KyOptions;
    useMocks?: boolean;
}

export interface SunriseSunsetOptions extends BaseSunriseSunsetOptions {
    formatted?: boolean;
}

interface BaseSunriseSunsetResponse {
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

export interface UnformattedSunriseSunsetResponse
    extends BaseSunriseSunsetResponse {
    dayLength: string;
}

export interface FormattedSunriseSunsetResponse
    extends BaseSunriseSunsetResponse {
    dayLength: number;
}

export type SunriseSunsetResponse =
    | FormattedSunriseSunsetResponse
    | UnformattedSunriseSunsetResponse;

export async function getSunriseSunsetInfo(
    options: BaseSunriseSunsetOptions & {formatted: false}
): Promise<UnformattedSunriseSunsetResponse>;

export async function getSunriseSunsetInfo(
    options: BaseSunriseSunsetOptions & {formatted?: true}
): Promise<FormattedSunriseSunsetResponse>;

export async function getSunriseSunsetInfo(
    options: BaseSunriseSunsetOptions & {formatted: boolean}
): Promise<SunriseSunsetResponse>;

/* We need to duplicate the implementation signature because only the overloads
   contribute to the final shape of the function signature. See:
   https://github.com/Microsoft/TypeScript/wiki/FAQ#why-am-i-getting-supplied-parameters-do-not-match-any-signature-error
   */
export async function getSunriseSunsetInfo(
    options: SunriseSunsetOptions
): Promise<SunriseSunsetResponse>;

export async function getSunriseSunsetInfo(
    options: SunriseSunsetOptions
): Promise<SunriseSunsetResponse> {
    if (!options.latitude) {
        throw new Error("Latitude is a required parameter");
    }
    if (!options.longitude) {
        throw new Error("Longitude is a required parameter");
    }
    if (
        typeof options.latitude !== "number" ||
        !isFinite(options.latitude) ||
        Math.abs(options.latitude) > 90
    ) {
        throw new Error(
            "Latitude must be a number between -90 and 90 (inclusive)"
        );
    }
    if (
        typeof options.longitude !== "number" ||
        !isFinite(options.longitude) ||
        Math.abs(options.longitude) > 180
    ) {
        throw new Error(
            "Longitude must be a number between -180 and 180 (inclusive)"
        );
    }
    if (
        typeof options.date !== "undefined" &&
        options.date !== null &&
        typeof options.date !== "string"
    ) {
        throw new Error("Invalid date");
    }

    if (options.useMocks) {
        if (typeof options.formatted === "undefined" || options.formatted) {
            return MOCK_FORMATTED_RESPONSE;
        } else {
            return MOCK_UNFORMATTED_RESPONSE;
        }
    }

    const response = await ky(
        options.apiUrl || "https://api.sunrise-sunset.org/json",
        {
            method: "get",
            searchParams: {
                lat: options.latitude,
                lng: options.longitude,
                ...(typeof options.date === "string" && {date: options.date}),
                ...(typeof options.formatted === "boolean" && {
                    formatted: options.formatted ? 1 : 0,
                }),
            },
            ...options.kyOptions,
        }
    );

    const body = await response.json();

    return camelCaseKeys(body.results);
}
