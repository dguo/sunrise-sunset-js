const getSunsetSunriseInfo = require('./dist').getSunsetSunriseInfo;

(async function main() {
    try {
    const response = await getSunsetSunriseInfo({latitude: 36.7201600, longitude: -4.4203400});
    console.log(response);
    } catch (error) {
        console.log(await error.response.json());
    }
})()
