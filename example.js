/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const ky = require("ky-universal");
const getSunriseSunsetInfo = require("./build").getSunriseSunsetInfo;

(async function main() {
    try {
        const response = await getSunriseSunsetInfo({
            latitude: 36.72016,
            longitude: -44.42034,
            formatted: false,
        });
        console.log(response);
    } catch (error) {
        if (error instanceof ky.HTTPError && error.response.status === 400) {
            console.error(await error.response.json());
        }
        console.error(error);
    }
})();
