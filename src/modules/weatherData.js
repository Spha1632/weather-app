export async function getWeatherData(location, unit) {
  const req = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}/?unitGroup=${unit}&include=days,hours,current&elements=datetime,tempmax,tempmin,temp,humidity,conditions,pressure,icon,feelslike,visibility`);
  const weatherData = req.json()
  return weatherData;
}