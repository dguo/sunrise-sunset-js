import ky from "ky-universal";
import {Options as KyOptions} from "ky";
import camelCaseKeys from "camelcase-keys";

import {MOCK_FORMATTED_RESPONSE, MOCK_UNFORMATTED_RESPONSE} from "./mocks";

export {MOCK_FORMATTED_RESPONSE, MOCK_UNFORMATTED_RESPONSE};

interface BaseSunriseSunsetRequest {
    latitude: number;
    longitude: number;
    date?: string | null;
    apiUrl?: string;
    kyOptions?: KyOptions;
    useMocks?: boolean;
}

export interface SunriseSunsetRequest extends BaseSunriseSunsetRequest {
    formatted?: boolean;
}

interface BaseSunriseSunsetResults {
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

interface UnformattedSunriseSunsetResponse extends BaseSunriseSunsetResults {
    dayLength: string;
}

interface FormattedSunriseSunsetResponse extends BaseSunriseSunsetResults {
    dayLength: number;
}

type SunriseSunsetResponse =
    | FormattedSunriseSunsetResponse
    | UnformattedSunriseSunsetResponse;

export async function getSunriseSunsetInfo(
    request: BaseSunriseSunsetRequest & {formatted: false}
): Promise<UnformattedSunriseSunsetResponse>;

export async function getSunriseSunsetInfo(
    request: BaseSunriseSunsetRequest & {formatted?: true}
): Promise<FormattedSunriseSunsetResponse>;

export async function getSunriseSunsetInfo(
    request: BaseSunriseSunsetRequest & {formatted: boolean}
): Promise<SunriseSunsetResponse>;

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
        if (typeof request.formatted === "undefined" || request.formatted) {
            return MOCK_FORMATTED_RESPONSE;
        } else {
            return MOCK_UNFORMATTED_RESPONSE;
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

    return camelCaseKeys(body.results);
}
