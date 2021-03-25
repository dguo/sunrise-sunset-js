import ky from "ky-universal";

interface BaseSunsetSunriseRequest {
    latitude: number;
    longitude: number;
    date?: string;
}

type SunsetSunriseStatus =
    | "OK"
    | "INVALID_REQUEST"
    | "INVALID_DATE"
    | "UNKNOWN_ERROR";

interface BaseSunsetSunriseResults {
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

interface UnformattedSunsetSunriseResponse {
    results: BaseSunsetSunriseResults & {
        day_length: string;
    };
    status: SunsetSunriseStatus;
}

interface FormattedSunsetSunriseResponse {
    results: BaseSunsetSunriseResults & {
        day_length: number;
    };
    status: SunsetSunriseStatus;
}

export async function getSunsetSunriseInfo(
    request: BaseSunsetSunriseRequest & {formatted?: false}
): Promise<UnformattedSunsetSunriseResponse>;

export async function getSunsetSunriseInfo(
    request: BaseSunsetSunriseRequest & {formatted: true}
): Promise<FormattedSunsetSunriseResponse>;

export async function getSunsetSunriseInfo(
    request: BaseSunsetSunriseRequest & {formatted: boolean}
): Promise<FormattedSunsetSunriseResponse | UnformattedSunsetSunriseResponse>;

export async function getSunsetSunriseInfo(
    request: BaseSunsetSunriseRequest & {formatted?: boolean}
): Promise<FormattedSunsetSunriseResponse | UnformattedSunsetSunriseResponse> {
    const response = await ky
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

    return response as
        | FormattedSunsetSunriseResponse
        | UnformattedSunsetSunriseResponse;
}
