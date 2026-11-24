import { header } from "./DOM/header.js";
import { mainSection } from "./DOM/mainSection.js";
import { getWeatherData } from "./modules/weatherData.js";
import "./style.css";

async function init() {
  try {
    const defaultUnit = "metric";
    const defaultCity = "Miami,FL";
    let prevCity = null;

    const container = document.querySelector(".container");
    const headerElement = header();
    const data = await getWeatherData(defaultCity, defaultUnit);
    const mainElement = await mainSection(data);
    container.append(headerElement, mainElement);

    const form = document.querySelector(".search-form");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const input = document.querySelector(".search-bar").value;
      const value = input.replace(/\s+/g, " ").trim();
      const city = value.replace(/\s+/g, "+");

      if (value) {
        const unit = document.getElementById("unit");
        const newCity = await getWeatherData(city, unit.className);
        prevCity = value;
        const oldMain = document.querySelector("main");

        if (oldMain) {
          oldMain.textContent = "Loading...";

          const newMain = await mainSection(newCity);
          oldMain.replaceWith(newMain);
        }

        form.reset();
      }
    });

    const unitEle = document.getElementById("unit");

    unitEle.addEventListener("click", async () => {
      if (prevCity === null) {
        const unit = document.getElementById("unit");
        const newCity = await getWeatherData(defaultCity, unit.className);
        const oldMain = document.querySelector("main");

        if (oldMain) {
          oldMain.textContent = "Loading...";

          const newMain = await mainSection(newCity);
          oldMain.replaceWith(newMain);
        }
      } else {
        const unit = document.getElementById("unit");
        const newCity = await getWeatherData(prevCity, unit.className);
        const oldMain = document.querySelector("main");

        if (oldMain) {
          oldMain.textContent = "Loading...";

          const newMain = await mainSection(newCity);
          oldMain.replaceWith(newMain);
        }
      }
    });
  } catch (error) {
    console.log(error);
  }
}

init();
