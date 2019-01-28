"use strict";
import "@babel/polyfill";

// ************** GLOBAL IMPORT *****************//
//**********************************************//
import Helpers from "../components/Helpers";
import URLRedirection from "../components/URLRedirector";
import ApisRequest from "../components/ApisRequest";
import ShowAllFavorites from "../components/ShowAllFavorites";
import SetFavorites from "../components/SetFavorites";
import SinglePhotoManager from "../components/ManageSinglePhoto";
import { uiHandler } from "../components/UIHandler";
import {
  inputs,
  searchDropDown,
  navBar,
  searchIcon,
  heroHeader,
  visitedCitiesContainer,
  suggestionDestinationContainer,
  getPhotoCurrentLocation,
  showHideAllFavoritesButton,
  photosDestinationsContent,
  switchAllFavoritesButton,
  loader
} from "../components/HTMLElementSelector";

// ***************** INSTANTIATE OBJECT *****************//
// *****************************************************//
const helpers = new Helpers();
const apisrequest = new ApisRequest();
const setFavorites = new SetFavorites();
const urlRedirector = new URLRedirection();
const handleShowHideFavorite = new ShowAllFavorites();
const handleSinglePhoto = new SinglePhotoManager();

// ************** FUNCTIONS *****************//
//******************************************//

// show the drop down when the user click in the input
function handleInputFocus(e) {
  // position the dropdown base on the current target input position
  helpers.handlePosition(searchDropDown, e.target);

  // display the drop down
  helpers.handleAddClass(searchDropDown, "active");

  // display the last visited cities to the user
  uiHandler.handleDisplayVisitedCities();
}

// handle window scroll event
function handleWindowScroll() {
  // get the scrolled pixels
  const scrolledPixels = this.scrollY;

  // display the nav bar background if the scrolled pixed is great then 100
  if (scrolledPixels > 100) {
    helpers.handleAddClass(navBar, "home_nav_bar_bg");
  } else {
    helpers.handleRemoveClass(navBar, "home_nav_bar_bg");
  }

  // update the drop down position if the user start to scrolling
  helpers.handlePosition(searchDropDown, inputs);
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
    helpers.handleSetInputValue(inputs);
  }

  // check for when the user click the search icon
  if (
    helpers.handleIsTruthy(inputs) &&
    e.target.classList.contains("search_icon")
  ) {
    helpers.handleSetInputValue(inputs);
  }
}

// hanndle click event on the search dropdown
function handleDropDownClickEvent(e) {
  // get the clicked element
  const clickedElement = e.target;

  // fill the form when the user click on a location from the dropdown
  if (
    !clickedElement.classList.contains("delete_icon_visited_city") &&
    !clickedElement.classList.contains("visited_country_intial_name")
  )
    helpers.handleFillInput(inputs, clickedElement, "location");

  // if the target element is the delete icon then call the helper function that remove the visited cities
  if (clickedElement.classList.contains("delete_icon_visited_city")) {
    // delete the visited city
    helpers.handleDeleteVisitedCity(e);

    // update the visited cities counter
    helpers.handleCountVisitedCities();
  }

  ///
  if (clickedElement.classList.contains("clear_suggestion_list")) {
    // remove the visited cities list from the UI
    helpers.handleRemoveElementFromUI(visitedCitiesContainer);

    // remove the visited list from the local Storage
    helpers.handleLocalStorage("visitedCities", "remove");
  }
}

// **************** HANDLER FOR WHEN THE DOM CONTENT HAS BEEN LOADED *************//
function handleContentHasBeenLoaded() {
  // check to see if you have already the user current location
  // not save it otherwise no nothing
  if (!helpers.handleLocalStorage("currentLocation", "get")) {
    apisrequest.handleGetUserCurrentLocation();
  }

  // add a click event on each block of the suggestion destinations
  helpers.handleAddEventListener(
    suggestionDestinationContainer,
    "click",
    setFavorites.handleSetFavorites
  );

  // set all favorite destination's icon as full-heart if is present
  // in the favorite list from local storage
  setFavorites.handleShowAsFavorite("suggestionDestination");

  // load the favorite destination
  setFavorites.handleDisplayFavorite("destination");

  // display the favorite number the user
  uiHandler.handleDisplayFavoriteCount();
}

// get the current location photos
function getPhotFromoCurrentLocation() {
  // get the current city from the local storage
  const currentLocationName = helpers.handleLocalStorage(
    "currentLocation",
    "get"
  );

  const locatioinFullName = `${currentLocationName.city}, ${
    currentLocationName.initial
  }, ${currentLocationName.country}`;

  // save the city has visited
  helpers.handleSaveVisitedCities(locatioinFullName);

  // redirect the user to the photos page
  urlRedirector.handleRedirection(locatioinFullName);
}

// switch between all favorite photos and destination
function handleSwitchAllFavoriteButton(e) {
  // display the loader to the user
  uiHandler.handleDisplayMessageToTheUser(photosDestinationsContent, loader);

  // get the clicked button
  const clickedButton = this;

  // get the name of the button
  const buttonRole = clickedButton.dataset.name;

  //add the active class to the clicked button and remove to other
  switchAllFavoritesButton.forEach(button => {
    if (button.dataset.name === buttonRole) {
      helpers.handleAddClass(button, "current_loading");

      // call the method in charge of displaying each favorite category
      handleShowHideFavorite.handleShowFavorite(buttonRole);
    } else {
      helpers.handleRemoveClass(button, "current_loading");
    }
  });
}

// get the cities when the user is typing in
function handleFetchCities(e) {
  apisrequest.handleGetCities(e.target.value);
}

// ************** EVENT LISTENER *****************//
//*************************************************

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

// add a click event to the hero section
helpers.handleAddEventListener(
  heroHeader,
  "click",
  helpers.handleHideTheDropdown
);

// add a click event to the get current location photos button
helpers.handleAddEventListener(
  getPhotoCurrentLocation,
  "click",
  getPhotFromoCurrentLocation
);

//append an event to all favorite heart and
//close(helps to close the container that show  favorites) icon;
helpers.handleAddEventListener(
  showHideAllFavoritesButton,
  "click",
  handleShowHideFavorite.handleShowHideAllFavoritesContainer
);

// append an event to the main container
//that hold the photos on photos page
helpers.handleAddEventListener(
  photosDestinationsContent,
  "click",
  handleSinglePhoto.handleSinglePhoto
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
  setFavorites.handleSetFavorites
);

// event on document object
helpers.handleAddEventListener(
  document,
  "DOMContentLoaded",
  handleContentHasBeenLoaded
);

// event on window
helpers.handleAddEventListener(window, "keypress", handleTouchValidation);
helpers.handleAddEventListener(window, "scroll", handleWindowScroll);

// ************* EXPORT ***************//
