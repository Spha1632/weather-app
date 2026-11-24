export async function mainSection(data) {
  const mainElement = document.createElement("main");

  /* LEFT CONTENT */

  const leftContentWrapper = document.createElement("div");
  leftContentWrapper.classList.add("left-content");

  const topLeftContentWrapper = document.createElement("div");
  topLeftContentWrapper.classList.add("top-left-content");

  const currentForecastWrapper = document.createElement("div");
  currentForecastWrapper.classList.add("current-forecast");

  const currentForecastHeading = document.createElement("h2");
  currentForecastHeading.classList.add("heading");
  currentForecastHeading.textContent = "Today's Forecast";

  const wrapper = document.createElement("div");

  const currentTemp = document.createElement("div");
  currentTemp.classList.add("current-temp");

  const locationWrapper = document.createElement("h1");
  locationWrapper.classList.add("location");
  const locationIcon = document.createElement("img");
  locationIcon.src = await getIcon("map-marker");
  locationIcon.style.height = "36px";
  const locationText = document.createElement("span");
  locationText.textContent = data.resolvedAddress;
  locationWrapper.append(locationIcon, locationText);

  const currentData = data.days[0];

  const currentDate = document.createElement("p");
  currentDate.classList.add("current-date");
  currentDate.textContent = formatDate(currentData.datetime);

  const currentInfo = document.createElement("div");
  currentInfo.classList.add("current-info");

  const currentInfoDiv = document.createElement("div");
  currentInfoDiv.classList.add("current-info-div");

  const currentIcon = document.createElement("img");
  currentIcon.src = await getIcon(currentData.icon);
  currentIcon.style.height = "30px";

  const currentTempText = document.createElement("p");
  currentTempText.textContent = `${currentData.temp}°`;

  const extraInfo = document.createElement("div");
  extraInfo.classList.add("extra-info");

  const condition = document.createElement("p");
  condition.classList.add("condition");
  condition.textContent = currentData.conditions;

  const minMax = document.createElement("p");
  minMax.classList.add("min-max");
  minMax.textContent = `${currentData.tempmin}° / ${currentData.tempmax}°`;

  const feelsLike = document.createElement("p");
  feelsLike.classList.add("current-feels-like");
  feelsLike.textContent = `${currentData.feelslike}°`;

  /* WEATHER CONDITIONS CARDS */

  const { humidity, pressure, visibility, feelslike } = currentData;

  const weatherConditions = [
    {
      title: "Humidity",
      icon: "water-percent",
      value: `${humidity}%`,
    },
    {
      title: "Pressure",
      icon: "waves",
      value: `${pressure} hPa`,
    },
    {
      title: "Visibility",
      icon: "eye",
      value: `${visibility} km`,
    },
    {
      title: "Feels Like",
      icon: "thermometer",
      value: `${feelslike}°`,
    },
  ];

  /* BOTTOM LEFT CONTENT */

  const bottomLeftContent = document.createElement("div");
  bottomLeftContent.classList.add("bottom-left-content");

  const bottomLeftContentHeading = document.createElement("h3");
  bottomLeftContentHeading.classList.add("heading");
  bottomLeftContentHeading.textContent = "Today at:";

  const bottomCardItems = document.createElement("div");
  bottomCardItems.classList.add("card-items");

  const now = new Date();

  const hourlyConditions = currentData.hours;

  const next8Hours = hourlyConditions
    .filter((hour) => {
      const hourlyTime = new Date(`${currentData.datetime}T${hour.datetime}`);

      return hourlyTime >= now;
    })
    .slice(0, 8);

  next8Hours.forEach(async (hour) => {
    const cardItem = await createBottomCardItem({
      icon: hour.icon,
      temp: hour.temp,
      datetime: hour.datetime,
    });
    bottomCardItems.appendChild(cardItem);
  });

  /* RIGHT CONTENT */

  const rightContentWrapper = document.createElement("div");
  rightContentWrapper.classList.add("right-content");

  const listItems = document.createElement("div");
  listItems.classList.add("list-items");

  const days = data.days;

  days.forEach(async (day) => {
    const listItem = await createListItems(day);
    listItems.append(listItem);
  });

  /* APPENDS FOR LEFT CONTENT */

  rightContentWrapper.append(listItems);
  bottomLeftContent.append(bottomLeftContentHeading, bottomCardItems);
  extraInfo.append(condition, minMax, feelsLike);
  currentInfoDiv.append(currentIcon, currentTempText);
  currentInfo.append(currentInfoDiv, extraInfo);
  currentTemp.append(locationWrapper, currentDate, currentInfo);
  wrapper.append(currentTemp);
  weatherConditions.forEach(async (condition) => {
    const ele = await createCardElement(condition);
    wrapper.appendChild(ele);
  });
  currentForecastWrapper.append(currentForecastHeading, wrapper);
  topLeftContentWrapper.append(currentForecastWrapper);
  leftContentWrapper.append(topLeftContentWrapper, bottomLeftContent);

  /* APPENDS FOR RIGHT CONTENT */

  mainElement.append(leftContentWrapper, rightContentWrapper);
  return mainElement;
}

async function createCardElement(condition) {
  const wrapper = document.createElement("div");
  wrapper.classList.add("weather-condition");

  const title = document.createElement("p");
  title.classList.add("title");
  title.textContent = condition.title;

  const infoWrapper = document.createElement("div");
  infoWrapper.classList.add("info");

  const iconDiv = document.createElement("div");
  const icon = document.createElement("img");
  icon.src = await getIcon(condition.icon);
  iconDiv.append(icon);

  const value = document.createElement("p");
  value.textContent = condition.value;

  infoWrapper.append(iconDiv, value);

  wrapper.append(title, infoWrapper);
  return wrapper;
}

async function createBottomCardItem(condition) {
  const cardItem = document.createElement("div");
  cardItem.classList.add("card-item");

  const time = document.createElement("p");
  time.classList.add("time");
  time.textContent = condition.datetime;

  const iconDiv = document.createElement("div");
  iconDiv.classList.add("icon");

  const icon = document.createElement("img");
  const iconSVG = await getIcon(condition.icon);
  icon.src = iconSVG;
  iconDiv.append(icon);

  const temp = document.createElement("p");
  temp.classList.add("temp");
  temp.textContent = `${condition.temp}°`;

  cardItem.append(time, iconDiv, temp);

  return cardItem;
}

async function createListItems(daily) {
  const listItem = document.createElement("div");
  listItem.classList.add("list-item");

  const iconDiv = document.createElement("div");
  iconDiv.classList.add("icon");
  const icon = document.createElement("img");
  const iconSVG = await getIcon(daily.icon);
  icon.src = iconSVG;
  iconDiv.append(icon);

  const temp = document.createElement("p");
  temp.classList.add("temp");
  temp.textContent = `${daily.temp}°`;

  const day = document.createElement("p");
  day.classList.add("day");
  day.textContent = daily.datetime;

  listItem.append(icon, temp, day);

  return listItem;
}

async function getIcon(value) {
  try {
    const icon = await import(`../icons/${value}.svg`);
    return icon.default;
  } catch (err) {
    console.error("Failed to load icon:", err);
    return null;
  }
}

function formatDate(date) {
  const newDate = new Date(`${date}T00:00:00`);

  const formatted = newDate.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return formatted;
}
