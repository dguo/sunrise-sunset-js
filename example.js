const getSunriseSunsetInfo = require("./build").getSunriseSunsetInfo;

(async function main() {
    try {
        const response = await getSunriseSunsetInfo({
            latitude: 36.72016,
            longitude: -4.42034,
            formatted: false,
        });
        console.log(response);
    } catch (error) {
        console.log(await error.response.json());
    }
})();
