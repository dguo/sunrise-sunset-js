import fetchMock from "fetch-mock-jest";

import {getSunsetSunriseInfo} from "./index";
import * as mocks from "./mocks";

fetchMock
    .mock(
        (url) => !url.includes("formatted=1"),
        mocks.MOCK_RAW_UNFORMATTED_RESPONSE
    )
    .mock(
        (url) => url.includes("formatted=1"),
        mocks.MOCK_RAW_FORMATTED_RESPONSE
    );

test("Successful unformatted response", async () => {
    const info = await getSunsetSunriseInfo({
        latitude: 34.5,
        longitude: 88.88,
        date: "2020-03-01",
        formatted: false,
    });

    expect(info).toEqual(mocks.MOCK_UNFORMATTED_SNAKE_CASE_RESPONSE);
});

test("Successful unformatted camel case response", async () => {
    const info = await getSunsetSunriseInfo({
        latitude: 34.5,
        longitude: 88.88,
        camelCase: true,
    });

    expect(info).toEqual(mocks.MOCK_UNFORMATTED_CAMEL_CASE_RESPONSE);
});

test("Successful formatted response", async () => {
    const info = await getSunsetSunriseInfo({
        latitude: 34.5,
        longitude: 88.88,
        formatted: true,
    });

    expect(info).toEqual(mocks.MOCK_FORMATTED_SNAKE_CASE_RESPONSE);
});

test("Successful formatted camel case response", async () => {
    const info = await getSunsetSunriseInfo({
        latitude: 34.5,
        longitude: 88.88,
        camelCase: true,
        formatted: true,
    });

    expect(info).toEqual(mocks.MOCK_FORMATTED_CAMEL_CASE_RESPONSE);
});

test.each([100, "foo", -90.1, NaN, null])(
    "Errors for an invalid latitude: %p",
    async (invalidLatitude) => {
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
        await expect(
            getSunsetSunriseInfo({
                latitude: 50,
                longitude: invalidLongitude as number,
            })
        ).rejects.toThrowError(/longitude/i);
    }
);

test.each([42, true])("Errors for a bad date: %p", async (invalidDate) => {
    await expect(
        getSunsetSunriseInfo({
            latitude: 50,
            longitude: 70,
            date: (invalidDate as unknown) as string,
        })
    ).rejects.toThrowError(/date/i);
});
