import ky from "ky-universal";
import camelCaseKeys from "camelcase-keys";

interface BaseSunsetSunriseRequest {
    latitude: number;
    longitude: number;
    date?: string;
    camelCase?: boolean;
}

type SunsetSunriseStatus =
    | "OK"
    | "INVALID_REQUEST"
    | "INVALID_DATE"
    | "UNKNOWN_ERROR";

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

interface UnformattedSnakeCaseSunsetSunriseResponse {
    results: BaseSnakeCaseSunsetSunriseResults & {
        day_length: string;
    };
    status: SunsetSunriseStatus;
}

interface UnformattedCamelCaseSunsetSunriseResponse {
    results: BaseCamelCaseSunsetSunriseResults & {
        dayLength: string;
    };
    status: SunsetSunriseStatus;
}

interface FormattedSnakeCaseSunsetSunriseResponse {
    results: BaseSnakeCaseSunsetSunriseResults & {
        day_length: number;
    };
    status: SunsetSunriseStatus;
}

interface FormattedCamelCaseSunsetSunriseResponse {
    results: BaseCamelCaseSunsetSunriseResults & {
        dayLength: number;
    };
    status: SunsetSunriseStatus;
}

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
): Promise<
    | FormattedSnakeCaseSunsetSunriseResponse
    | UnformattedSnakeCaseSunsetSunriseResponse
>;

export async function getSunsetSunriseInfo(
    request: BaseSunsetSunriseRequest & {formatted: boolean; camelCase: true}
): Promise<
    | FormattedCamelCaseSunsetSunriseResponse
    | UnformattedCamelCaseSunsetSunriseResponse
>;

export async function getSunsetSunriseInfo(
    request: BaseSunsetSunriseRequest & {
        formatted?: boolean;
        camelCase?: boolean;
    }
): Promise<
    | FormattedSnakeCaseSunsetSunriseResponse
    | FormattedCamelCaseSunsetSunriseResponse
    | UnformattedSnakeCaseSunsetSunriseResponse
    | UnformattedCamelCaseSunsetSunriseResponse
> {
    const response: any = await ky
        .get(`https://api.sunrise-sunset.org/json`, {
            searchParams: {
                lat: request.latitude,
                lng: request.longitude,
                ...(request.date && {date: request.date}),
                ...(typeof request.formatted === "boolean" && {
                    formatted: request.formatted ? 1 : 0,
                }),
            },
        })
        .json();

    if (request.camelCase) {
        response.results = camelCaseKeys(response.results);
    }

    return response;
}
