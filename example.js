const getSunsetSunriseInfo = require("./build").getSunsetSunriseInfo;

(async function main() {
    try {
        const response = await getSunsetSunriseInfo({
            latitude: 36.72016,
            longitude: -4.42034,
            formatted: false,
            camelCase: true,
        });
        console.log(response);
    } catch (error) {
        console.log(await error.response.json());
    }
})();
