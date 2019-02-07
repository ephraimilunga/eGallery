"use strict";
//***************** IMPORT MODULES ****************/
//  Unsplash Modules
import Unsplash, { toJson } from "unsplash-js";

import UIHandler from "../components/UIHandler";
import { helpers } from "./Helpers";
//import { uiHandler } from "../components/UIHandler";
import {
  loader,
  newSuggestionCitiesContainer,
  showLoader,
  loaderContainer,
  hideLoader
} from "../components/HTMLElementSelector";

// *************** INSTANTIATE OBJECTS *************//
const uiHandler = new UIHandler();
const unsplash = new Unsplash({
  applicationId:
    "e3374e82ff1b9b886ffd9e4c1dfc2ad987b5adaf517c3bd1c8db51e6fd88100f",
  secret: "1b63fc0d362480a011f79572963f239d2906fad4f6aa5ec5ba7ef289ea1f5e46",
  callbackUrl: "/index.html"
});

// *************** CLASSES DECLARATION **************//

class ApisRequest {
  // get the user current location
  async handleGetUserCurrentLocation() {

    //*** End Points ****
    // IPfy (Get the user IP)
    const ipfy = "https://api.ipify.org?format=json";

    // cross origin api
    const corsApiUrl = "https://cors-anywhere.herokuapp.com/";

    // ipGeobytes (get te user location details. lat, lng, country name, ...)
    const ipGeobytes = "http://getcitydetails.geobytes.com/GetCityDetails?fqcn=";

    // ***** Requests *****//

    // get user ip
    const ip = await fetch(ipfy)
      .then(result => result.json())
      .then(data => data.ip);

    // get user city
    const city = await fetch(`${corsApiUrl}${ipGeobytes}${ip}`)
      .then(result => result.json())
      .then(data => data);

    // built the user current location info object
    const currentLocation = await {
      city: city.geobytescity,
      initial: city.geobytescode,
      country: city.geobytescountry,
      lat: city.geobyteslatitude,
      lng: city.geobyteslongitude
    };

    // save the user current location object in the local storage
    await helpers.handleLocalStorage("currentLocation", "set", currentLocation);
  }

  //**
  /* // get cities arrounds the world
   /* @param {String} searcKeyWord a string key word that the user type in the input field
   */
  async handleGetCities(searchKeyWord) {
    // display the loader the user
    uiHandler.handleDisplayMessageToTheUser(
      newSuggestionCitiesContainer,
      loader
    );

    // ***** End points ***/

    // cross orgin api
    const corsApiUrl = "https://cors-anywhere.herokuapp.com/";

    // cities api
    const getCity = "http://gd.geobytes.com/AutoCompleteCity?q=";

    // Get the city list that match the searcKeyWord
    const cities = await fetch(`${corsApiUrl}${getCity}${searchKeyWord}`)
      .then(result => result.json())
      .then(data => data);

    // send the cities list to the method in charge to validate if we have any data or the list is not a none cities names
    await helpers.valideTheCitiesList(cities);
  }

  //**
  /* Retrieves photos from unsplash
   /* @param {String} searchKeyWord : a string that wil be use to performe the search on.
   */
  handleGetPhotos(searchKeyWord) {
    // extract  the town and country from the full location name
    const keywordSplit = helpers.handleSplitString(searchKeyWord, ",");
    const keyword =
      helpers.handleCapitalize(keywordSplit[0]) +
      " " +
      helpers.handleIsFalsy(keywordSplit[2]);

    // show the loader to the user
    // 0. remve the hide state to the loader container
    helpers.handleRemoveClass(loaderContainer, hideLoader);
    // 1. add the loader to the loader container
    uiHandler.handleDisplayMessageToTheUser(loaderContainer, loader);
    // 2. display the loader
    helpers.handleAddClass(loaderContainer, showLoader);

    unsplash.search
      .photos(keyword, 1, 10)
      .then(toJson)
      .then(json => {
        uiHandler.handleDisplayPhotos(json.results);
      });
  }
}

export default ApisRequest;

const apisrequest = new ApisRequest();

export { apisrequest };
