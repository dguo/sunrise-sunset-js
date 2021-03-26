import fetchMock from "fetch-mock-jest";

import {getSunsetSunriseInfo} from "./index";

afterEach(() => fetchMock.reset());

const MOCK_FORMATTED_RESPONSE = {
    results: {
        sunrise: "7:27:02 AM",
        sunset: "5:05:55 PM",
        solar_noon: "12:16:28 PM",
        day_length: "9:38:53",
        civil_twilight_begin: "6:58:14 AM",
        civil_twilight_end: "5:34:43 PM",
        nautical_twilight_begin: "6:25:47 AM",
        nautical_twilight_end: "6:07:10 PM",
        astronomical_twilight_begin: "5:54:14 AM",
        astronomical_twilight_end: "6:38:43 PM",
    },
    status: "OK",
};

const MOCK_UNFORMATTED_RESPONSE = {
    results: {
        sunrise: "2015-05-21T05:05:35+00:00",
        sunset: "2015-05-21T19:22:59+00:00",
        solar_noon: "2015-05-21T12:14:17+00:00",
        day_length: 51444,
        civil_twilight_begin: "2015-05-21T04:36:17+00:00",
        civil_twilight_end: "2015-05-21T19:52:17+00:00",
        nautical_twilight_begin: "2015-05-21T04:00:13+00:00",
        nautical_twilight_end: "2015-05-21T20:28:21+00:00",
        astronomical_twilight_begin: "2015-05-21T03:20:49+00:00",
        astronomical_twilight_end: "2015-05-21T21:07:45+00:00",
    },
    status: "OK",
};

test("Successful unformatted response", async () => {
    fetchMock.mock("*", MOCK_UNFORMATTED_RESPONSE);

    const info = await getSunsetSunriseInfo({
        latitude: 34.5,
        longitude: 88.88,
    });

    expect(info).toEqual(MOCK_UNFORMATTED_RESPONSE.results);
});

test("Successful formatted response", async () => {
    fetchMock.mock("*", MOCK_FORMATTED_RESPONSE);

    const info = await getSunsetSunriseInfo({
        latitude: 34.5,
        longitude: 88.88,
    });

    expect(info).toEqual(MOCK_FORMATTED_RESPONSE.results);
});

test.each([100, "foo", -90.1, NaN, null])(
    "Errors for an invalid latitude: %p",
    async (invalidLatitude) => {
        fetchMock.mock("*", MOCK_FORMATTED_RESPONSE);

        await expect(
            getSunsetSunriseInfo({
                latitude: invalidLatitude as number,
                longitude: 88.88,
            })
        ).rejects.toThrowError(/latitude/i);
    }
);

test.each([180.1, "bar", -190, NaN, null])(
    "Errors for a bad longitude: %p",
    async (invalidLongitude) => {
        fetchMock.mock("*", MOCK_FORMATTED_RESPONSE);

        await expect(
            getSunsetSunriseInfo({
                latitude: 50,
                longitude: invalidLongitude as number,
            })
        ).rejects.toThrowError(/longitude/i);
    }
);

test.each([42, true])("Errors for a bad date: %p", async (invalidDate) => {
    fetchMock.mock("*", MOCK_FORMATTED_RESPONSE);

    await expect(
        getSunsetSunriseInfo({
            latitude: 50,
            longitude: 70,
            date: (invalidDate as unknown) as string,
        })
    ).rejects.toThrowError(/date/i);
});
