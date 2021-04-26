import fetchMock from "fetch-mock-jest";

import {getSunriseSunsetInfo} from "./index";
import * as mocks from "./mocks";

fetchMock
    .mock(
        (url) => !url.includes("formatted=") || url.includes("formatted=1"),
        mocks.MOCK_RAW_FORMATTED_RESPONSE
    )
    .mock(
        (url) => url.includes("formatted=0"),
        mocks.MOCK_RAW_UNFORMATTED_RESPONSE
    );

test("Successful unformatted response", async () => {
    const info = await getSunriseSunsetInfo({
        latitude: 34.5,
        longitude: 88.88,
        date: "2020-03-01",
        formatted: false,
    });

    expect(info).toEqual(mocks.MOCK_UNFORMATTED_RESPONSE);
});

test("Successful formatted response", async () => {
    const info = await getSunriseSunsetInfo({
        latitude: 34.5,
        longitude: 88.88,
        formatted: true,
    });

    expect(info).toEqual(mocks.MOCK_FORMATTED_RESPONSE);
});

test("Can override the API URL", async () => {
    const newUrl = "https://example.com";

    await getSunriseSunsetInfo({
        latitude: 34.5,
        longitude: 88.88,
        apiUrl: newUrl,
    });

    expect(fetchMock.lastUrl()).toMatch(newUrl);
});

test("Can override Ky options", async () => {
    await getSunriseSunsetInfo({
        latitude: 34.5,
        longitude: 88.88,
        kyOptions: {
            searchParams: {
                foo: "bar",
            },
        },
    });

    expect(fetchMock.lastUrl()).toMatch("foo=bar");
});

test("Mock mode works when there's no explicit formatting mode", async () => {
    const info = await getSunriseSunsetInfo({
        latitude: 34.5,
        longitude: 88.88,
        useMocks: true,
    });

    expect(info).toEqual(mocks.MOCK_FORMATTED_RESPONSE);
});

test("Mock mode works when explicitly turning formatted mode on", async () => {
    const info = await getSunriseSunsetInfo({
        latitude: 34.5,
        longitude: 88.88,
        useMocks: true,
        formatted: true,
    });

    expect(info).toEqual(mocks.MOCK_FORMATTED_RESPONSE);
});

test("Mock mode works when explicitly turning formatted mode off", async () => {
    const info = await getSunriseSunsetInfo({
        latitude: 34.5,
        longitude: 88.88,
        useMocks: true,
        formatted: false,
    });

    expect(info).toEqual(mocks.MOCK_UNFORMATTED_RESPONSE);
});

test.each([100, "foo", -90.1, NaN, null])(
    "Errors for an invalid latitude: %p",
    async (invalidLatitude) => {
        await expect(
            getSunriseSunsetInfo({
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
            getSunriseSunsetInfo({
                latitude: 50,
                longitude: invalidLongitude as number,
            })
        ).rejects.toThrowError(/longitude/i);
    }
);

test.each([42, true])("Errors for a bad date: %p", async (invalidDate) => {
    await expect(
        getSunriseSunsetInfo({
            latitude: 50,
            longitude: 70,
            date: (invalidDate as unknown) as string,
        })
    ).rejects.toThrowError(/date/i);
});

test.each([{formatted: true}, {formatted: false}])(
    "Mock mode works with: %p",
    async (options) => {
        fetchMock.resetHistory();

        await getSunriseSunsetInfo({
            latitude: 23.46,
            longitude: -50,
            formatted: options.formatted,
            useMocks: true,
        });

        expect(fetchMock.calls().length).toEqual(0);
    }
);
