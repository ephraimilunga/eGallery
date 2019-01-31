"use strict";
import "@babel/polyfill";
// ******** IMPORT MODULE ***********/
import SinglePhotoManager from "../components/ManageSinglePhoto";
import { apisrequest } from "../components/ApisRequest";
import { setFave } from "../components/SetFavorites";
import {
  inputs,
  searchDropDown,
  searchIcon,
  photosPageMainContainer,
  tagsContainer,
  getPhotoCurrentLocation,
  switchButton,
  visitedCitiesContainer,
  photosBlocksContainer,
  showHideAllFavoritesButton,
  switchAllFavoritesButton,
  photosDestinationsContent,
  loader
} from "../components/HTMLElementSelector";

import { helpers } from "../components/Helpers";
import { uiHandler } from "../components/UIHandler";
import ShowAllFavorites from "../components/ShowAllFavorites";

//************ INSTANTIATE OBJECT *************/
const handleSinglePhoto = new SinglePhotoManager();
const handleShowHideFavorite = new ShowAllFavorites();
//************ FUNCTION ****************** */

// ************ show the drop down when the user click in the input
function handleInputFocus(e) {
  // position the dropdown base on the current target input position
  helpers.handlePosition(searchDropDown, e.target);

  // display the drop down
  helpers.handleAddClass(searchDropDown, "active");

  // display the last visited cities to the user
  uiHandler.handleDisplayVisitedCities();
}

// *********** hanndle click event on the search dropdown
function handleDropDownClickEvent(e) {
  // get the clicked element
  const clickedElement = e.target;

  // fill the form when the user click on a location from the dropdown
  if (
    !helpers.handleHasThisClass(clickedElement, "delete_icon_visited_city") &&
    !helpers.handleHasThisClass(clickedElement, "last_visited_places_title") &&
    !helpers.handleHasThisClass(
      clickedElement,
      "visited_country_intial_name"
    ) &&
    !helpers.handleHasThisClass(clickedElement, "clear_suggestion_list")
  ) {
    helpers.handleFillInput(inputs, clickedElement, "location", "photosPage");

    // call the function that triggered the method that fetch photos
    // from unsplash
    fetchPhotos(inputs);
  }

  // if the target element is the delete icon then call the helper function that remove the visited cities
  if (clickedElement.classList.contains("delete_icon_visited_city")) {
    // delete the clicked city
    helpers.handleDeleteVisitedCity(e);

    // update the visited cities counter
    helpers.handleCountVisitedCities();
  }

  /// if the clicked element the clear list then
  // delete the list from the UI and the local storage
  if (clickedElement.classList.contains("clear_suggestion_list")) {
    // remove the visited cities list from the UI
    helpers.handleRemoveElementFromUI(visitedCitiesContainer);

    // remove the visited list from the local Storage
    helpers.handleLocalStorage("visitedCities", "remove");
  }
}

// check if the user has pressed the enter touch and the input value is not empty
// if the pressed touch is Enter/Return and the input is not empty
// call the handleGetInputValue function/method from the helpers object
function handleTouchValidation(e) {
  // check for when the user click on the enter touch
  if (
    e.isTrusted &&
    e.key === "Enter" &&
    e.charCode === 13 &&
    helpers.handleIsTruthy(inputs)
  ) {
    helpers.handleSetInputValue(inputs, "photosPage");

    // call the function that triggered the method that fetch photos
    // from unsplash
    fetchPhotos(inputs);

    // heide the search drop down
    helpers.handleRemoveClass(searchDropDown, "active");
  }

  // check for when the user click the search icon
  if (
    helpers.handleIsTruthy(inputs) &&
    e.target.classList.contains("search_icon")
  ) {
    helpers.handleSetInputValue(inputs, "photosPage");

    // call the function that triggered the method that fetch photos
    // from unsplash
    fetchPhotos(inputs);

    // heide the search drop down
    helpers.handleRemoveClass(searchDropDown, "active");
  }
}

// fetch photos from unsplash Api
function fetchPhotos(input) {
  // get the input value
  const inputValue = helpers.handleCapitalize(input.value);

  apisrequest.handleGetPhotos(inputValue);

  // save the current search word as the searchKeyword in local storage
  helpers.handleLocalStorage("searchKeyWord", "set", { name: inputValue });

  //empty the input
  inputs.value = "";
}

// get the photo base on the clicked tags
function handleGetPhotBaseOnTagName(e) {
  // clicked tag name
  const tagName = e.target.dataset.tag;

  // stop the function if the target element is not a valid value
  if (!tagName) return;

  // set the name to the method in charge of fetch photos
  apisrequest.handleGetPhotos(tagName);

  // save the current search word as the searchKeyword in local storage
  helpers.handleLocalStorage("searchKeyWord", "set", { name: tagName });
}

// get current location photos
function getCurrentLocationPhotos() {
  // get the user current location from the local storage
  const currentLocation = helpers.handleLocalStorage(
    "currentLocation",
    "get"
  ) || { city: "Durban", initial: "NL", country: "South-Africa" };

  // extract the city, region code (initial) and the country name
  const city = currentLocation.city;
  const initial = currentLocation.initial;
  const country = currentLocation.country;

  // build the the current locatiion name
  const searchKeyWord = `${city}, ${initial} - ${country}`;

  // send the location to the method in charge of getting photos from the api
  apisrequest.handleGetPhotos(searchKeyWord);

  // the current location as the current  search keyword
  // in local storage
  helpers.handleLocalStorage("searchKeyWord", "set", { name: searchKeyWord });
}

// switch between all favorite photos and destination
function handleSwitchAllFavoriteButton(e) {
  // display the loader to the user
  uiHandler.handleDisplayMessageToTheUser(photosDestinationsContent, loader);

  // get the clicked button
  const clickedButton = this;

  // get the name of the button
  const buttonRole = clickedButton.dataset.name;

  // get the origin of the clickedButton
  // it can be from home or photos page
  // if from is equal to home page, the application will redirect the user to the photos page
  // if not keep the user on the photo page
  const buttonFrom = clickedButton.dataset.from;

  //add the active class to the clicked button and remove to other
  switchAllFavoritesButton.forEach(button => {
    if (button.dataset.name === buttonRole) {
      helpers.handleAddClass(button, "current_loading");

      // call the method in charge of displaying each favorite category
      handleShowHideFavorite.handleShowFavorite(buttonRole, buttonFrom);
    } else {
      helpers.handleRemoveClass(button, "current_loading");
    }
  });
}

function handleFetchCities(e) {
  apisrequest.handleGetCities(e.target.value);
}

// *********** HANDLE EVENT ***********//
// append an input event on the search bar
helpers.handleAddEventListener(inputs, "input", handleFetchCities);

// append a focus  event  to the search input
helpers.handleAddEventListener(inputs, "focus", handleInputFocus);

// append an event listener on the dropdown
helpers.handleAddEventListener(
  searchDropDown,
  "click",
  handleDropDownClickEvent
);

/// add an event on the search icon in the search input bar
helpers.handleAddEventListener(searchIcon, "click", handleTouchValidation);

// append a click event to the main container on the photos page
helpers.handleAddEventListener(
  photosPageMainContainer,
  "click",
  helpers.handleHideTheDropdown
);

// append a click event to the tags container
helpers.handleAddEventListener(
  tagsContainer,
  "click",
  handleGetPhotBaseOnTagName
);

// append a click to the get current location button
helpers.handleAddEventListener(
  getPhotoCurrentLocation,
  "click",
  getCurrentLocationPhotos
);

// append an event to the butto that hide and show the map
helpers.handleAddEventListener(
  switchButton,
  "click",
  uiHandler.handleToggleMap
);

// append an event to the main container
//that hold the photos on photos page
helpers.handleAddEventListener(
  photosBlocksContainer,
  "click",
  handleSinglePhoto.handleSinglePhoto
);

// append an event to the main container
//that hold the photos on photos page
helpers.handleAddEventListener(
  photosDestinationsContent,
  "click",
  handleSinglePhoto.handleSinglePhoto
);

//append an event to all favorite heart and
//close(helps to close the container that show  favorites) icon;
helpers.handleAddEventListener(
  showHideAllFavoritesButton,
  "click",
  handleShowHideFavorite.handleShowHideAllFavoritesContainer
);

// append an event to the button that help the user to switch between favorite photos and destination
helpers.handleAddEventListener(
  switchAllFavoritesButton,
  "click",
  handleSwitchAllFavoriteButton
);

// append the click event to the contaienr that hold all favorite photos and destination
helpers.handleAddEventListener(
  photosDestinationsContent,
  "click",
  setFave.handleSetFavorites
);

// Events on window
window.addEventListener("keypress", handleTouchValidation);
window.addEventListener("DOMContentLoaded", () => {
  // get the search keyword from local storage
  const searchKeyword =
    helpers.handleLocalStorage("searchKeyWord", "get").name || "positivity";
  // get photo from the unsplash api base on the keyword.
  apisrequest.handleGetPhotos(searchKeyword);

  // display the number of favorite destination and photos
  uiHandler.handleDisplayFavoriteCount();
});

// back to home page
const backtohome = document.querySelector(".back_to_home_page_icon");
backtohome.addEventListener("click", function() {
  window.location.href = "https://ephraimilunga.co.za/egallery/";
});
