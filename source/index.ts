import ky from "ky-universal";

interface SunsetSunriseRequest {
    latitude: number;
    longitude: number;
    date?: string;
    formatted?: boolean;
}

type SunsetSunriseStatus =
    | "OK"
    | "INVALID_REQUEST"
    | "INVALID_DATE"
    | "UNKNOWN_ERROR";

interface SunsetSunriseResponse {
    results: {
        sunrise: string;
        sunset: string;
        solar_noon: string;
        day_length: string | number;
        civil_twilight_begin: string;
        civil_twilight_end: string;
        nautical_twilight_begin: string;
        nautical_twilight_end: string;
        astronomical_twilight_begin: string;
        astronomical_twilight_end: string;
    };
    status: SunsetSunriseStatus;
}

export async function getSunsetSunriseInfo(
    request: SunsetSunriseRequest
): Promise<SunsetSunriseResponse> {
    const response = await ky
        .get(`https://api.sunrise-sunset.org/json`, {
            searchParams: {
                lat: request.latitude,
                lng: request.longitude,
                date: request.date ?? "2021-10-32",
                formatted:
                    typeof request.formatted === "undefined" ||
                    request.formatted
                        ? 1
                        : 0,
            },
        })
        .json();

    return response as SunsetSunriseResponse;
}
