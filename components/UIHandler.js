"use strict";

// ************* IMPORT MODULES ************** //
import Map from "./Map";
import { helpers } from "../components/Helpers";
import {
  newSuggestionCitiesContainer,
  lastVisitedCitiesContaienr,
  photosLocationTitle,
  photosCounter,
  loaderContainer,
  showLoader,
  hideLoader,
  tagsContainer,
  togglerSwitchMap,
  switchButtonText,
  photosAndMapContainer,
  favoriteCounter,
  fullHeart,
  photosDestinationsContent,
  emptyHeart,
  indiVidualPhotoCounter,
  indiVidualDestinationCounter,
  favoritePhotosKeyName,
  favoriteDestinationKeyName,
  photosBlocksContainer
} from "../components/HTMLElementSelector";

//************** INSTANTIATE THE OBJECTS ********/
const map = new Map();
// ************* CLASSES DECLARATION **********//
class UIHandler {
  //**
  /* display the cities in the dropdown when the user is being typing in the input
   /* @param {Object} citiesList 
   */
  handleDisplayCity(citiesList) {
    // loop through the cities list
    // to build the city html format
    const formatedList = citiesList
      .map(city => {
        // split the city
        const splitedCity = helpers.handleSplitString(city, ","); //city.split(",");

        // return the cities Html format
        return `
        <div data-location="${city}" class="city_content">
            <div data-location="${city}" class="city_name">${
          splitedCity[0]
        }</div>
            <div class="country_intial_name">${splitedCity[1]} - ${
          splitedCity[2]
        }</div>
        </div>
      `;
      })
      .join("");

    // display the cities to the user
    this.handleDisplayMessageToTheUser(
      newSuggestionCitiesContainer,
      formatedList
    );
  }

  //**
  /* Display the text passed as the second argument within the container (first argume)
   /* @param {HTMLELement} container 
   /* @param {HTMLValue} textToDisplay 
   */
  handleDisplayMessageToTheUser(container, textToDisplay) {
    container.innerHTML = textToDisplay;
  }

  //**
  /* Didsplay the visited cities to the user
   /* @param {ArrayObect} cityObject : hold all visited cities from the localstorage
   */
  handleDisplayVisitedCities(cityObject = null) {
    // local storage identifier
    const storageKeyName = "visitedCities";

    // get the cities listed from the local storage
    const visitedCitiesFromLocalStorage =
      cityObject || helpers.handleLocalStorage(storageKeyName, "get") || [];

    // check to see if we have any value from the local storage
    if (
      visitedCitiesFromLocalStorage &&
      visitedCitiesFromLocalStorage.length > 0
    ) {
      //if yes
      // loop through and build the visited lsit
      const cityHtmlForm = visitedCitiesFromLocalStorage
        .reverse()
        .map(city => {
          // split the city for a better display
          const splitedCity = helpers.handleSplitString(city, ",");

          //return the city formatted
          return `
          <div data-location="${city}" class="visited_city_content">
              <div data-location="${city}" class="visited_city_name">${
            splitedCity[0]
          }</div>
              <div class="visited_country_intial_name">${splitedCity[1] ||
                ""} - ${splitedCity[2] || ""}</div>
              <div class="delete_from_visted"><img class="delete_icon_visited_city" src="cancel_icon.97a97d0f.svg" alt=""></div>
          </div>
        `;
        })
        .join("");

      // build the complet last visited cities suggestion
      const lastVisitedCitiesBlock = `
            <div class="last_visited_places_title">
                <p class="suggestion_text">Last visit : (<span class="visited_cities_counter">${helpers.handleLength(
                  visitedCitiesFromLocalStorage
                )}</span>)</p>
                <p class="clear_suggestion_list">Clear List</p>
            </div>
            <div class="last_visited_places_content">
                ${cityHtmlForm}
            </div>
      `;
      // display the visited cities to the user
      uiHandler.handleDisplayMessageToTheUser(
        lastVisitedCitiesContaienr,
        lastVisitedCitiesBlock
      );
    }
  }

  //**
  /* Display the photos to the user
   /* @param {ArrayObject} photosList 
   */
  handleDisplayPhotos(photosList) {
    // get all photo tags
    uiHandler.handleDisplayTags(photosList);

    // get each photo deails
    map.handleAllSinglePhotoDetails(photosList);

    // display the number of retrieved photos
    const photosNumber = helpers.handleLength(photosList);
    const sufixText = photosNumber > 1 ? "Photos" : "Photo";
    uiHandler.handleDisplayMessageToTheUser(
      photosCounter,
      photosNumber + " " + sufixText
    );

    // display the location of the current photos or the search word name
    const locationName = helpers.handleSplitString(
      helpers.handleLocalStorage("searchKeyWord", "get").name,
      ","
    );

    const fullLocationName = `${helpers.handleCapitalize(locationName[0])} ${
      locationName[1] ? "-" : " "
    } ${helpers.handleIsFalsy(locationName[1])}${
      locationName[2] ? "," : " "
    }  ${helpers.handleIsFalsy(locationName[2])}`;

    // display the current search keyword or location to the user
    uiHandler.handleDisplayMessageToTheUser(
      photosLocationTitle,
      fullLocationName
    );

    // clear the main container (in case we have some previous photos)
    photosBlocksContainer.innerHTML = "";

    // split the list of photos base on the number of column we want to display
    const splittedArray = helpers.handleSplitObject(photosList, 3);

    // loop through the new built array (splittedArray)
    // build html block and display them to the user
    splittedArray.map(photosGroup => {
      // call the method in charge of building and displaying the html format of  photos
      uiHandler.handleShowPhotos(photosGroup);
    });

    // wait 3s then remove the loader
    setTimeout(() => {
      // show the loader to the user
      // 0. remve the hide state to the loader container
      helpers.handleRemoveClass(loaderContainer, showLoader);
      // 1. display the loader
      helpers.handleAddClass(loaderContainer, hideLoader);
    }, 3000);
  }

  //**
  /* Display the list of photos passed as first argume within the the html element pass as  second argument
   /* @param {arrayObject} photosObject 
   /* @param {HTMLElement} photosContainer 
   */

  handleShowPhotos(photosObject, photosContainer) {
    // create the block element
    const divBlock = document.createElement("div");

    // add a class to the div block for the sake of style
    divBlock.classList.add("photos_main_block");

    // build the html form of photos
    const photosList = photosObject
      .map(photo => {
        return `
      <!--start good single photo block-->
      <div id="${photo.id}" class="photo_block_container">

          <div class="header_favorite_container">
              <div class="author_profile">
                 <a href="${photo.user.links.html}"> <img data-href="${
          photo.user.links.html
        }" class="author_profile_picture has_href" src="${
          photo.user.profile_image.medium
        }" alt=""></a>
                  <div class="author_name_title">
                     <a href="${photo.user.links.html}"> <p data-href="${
          photo.user.links.html
        }" class="author_name has_href">${photo.user.name}</p></a>
                      <p class="author_title">${helpers.handleIsFalsy(
                        photo.user.location
                      )}</p>
                  </div>
              </div>
              <img data-id="${photo.id}"  data-favorite="${
          uiHandler.handleIsUserFavorite(photo.id) ? "set" : "unset"
        }" class="single_photo_favorite_icon" src="${
          uiHandler.handleIsUserFavorite(photo.id) ? fullHeart : emptyHeart
        }" alt="">
          </div>
          
          <img class="single_photo_img" src="${photo.urls.regular}" alt="">
          
          <div class="footer_author_place_name">

              <div class="footer_global_wrapper">
                  <div class="footer_content_wrapper">
                      <a class="download_photo" target="_blank" href="${
                        photo.links.download
                      }?force=true">
                          <img data-href="${
                            photo.links.download
                          }?force=true" class="download_icon has_href" src="download.348554b6.svg" alt="">
                      </a>
                      <div class="place_name">
                          <p id="${
                            photo.id
                          }" class="places_name_text">Durban KZN</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <!--end single photo block-->
     `;
      })
      .join("");

    // set div text content to the list of photo (photosList).
    divBlock.innerHTML = photosList;

    // display the photos to the user
    photosBlocksContainer.appendChild(divBlock);
  }

  //**
  /* Display the tags related the current viewing photos
   /* @param {ArrayObject} photos 
   */
  handleDisplayTags(photos) {
    // initialize the final list
    const clearTagsList = [];

    // loop through the photos list and extract all tags
    const tags = photos.map(photo => photo.tags).flat();

    // remove the tags that appear twice
    tags.reduce(function(obj, item) {
      if (!obj[item.title]) {
        clearTagsList.push(item.title);
        obj[item.title] = 0;
      }
      obj[item.title]++;
      return obj;
    }, {});

    const tagsHtmlFormat = clearTagsList
      .map(tag => {
        return `
          <div data-tag="${tag}" class="photos_filter_block">
            <p data-tag="${tag}" class="photos_filter_name">${tag}</p>
          </div>
     `;
      })
      .join("");

    // display the tags to the user
    uiHandler.handleDisplayMessageToTheUser(tagsContainer, tagsHtmlFormat);
  }

  //**
  /* Show and hide the map
   /* @param {Event} e 
   */
  handleToggleMap(e) {

    // the class that active the switch effect
    const toggleClassName = "active_toggle";
    const hideMapClassName = "hide_map";
    const showMapClassName = "show_map";

    // change the text to heither show or hide the map
    if (helpers.handleHasThisClass(togglerSwitchMap, toggleClassName)) {
      uiHandler.handleDisplayMessageToTheUser(switchButtonText, "Show the Map");
      // move the switch toggler
      helpers.handleTogglerClass(togglerSwitchMap, toggleClassName);

      // hide the map
      helpers.handleAddClass(photosAndMapContainer, hideMapClassName);
      helpers.handleRemoveClass(photosAndMapContainer, showMapClassName);
    } else {
      uiHandler.handleDisplayMessageToTheUser(switchButtonText, "Hide the Map");
      // move the switch toggler
      helpers.handleTogglerClass(togglerSwitchMap, toggleClassName);

      // show the map
      helpers.handleAddClass(photosAndMapContainer, showMapClassName);
      helpers.handleRemoveClass(photosAndMapContainer, hideMapClassName);
    }
  }

  //**
  /* Count and display the number of favorite
   */
  handleDisplayFavoriteCount() {
    // get the  favorite destinations
    const favoriteDestinationList =
      helpers.handleLocalStorage("favoriteDestinations", "get") || [];

    // get the favorite photos
    const favoritePhotosList =
      helpers.handleLocalStorage("favoritePhotos", "get") || [];

    // get the length of both favorite destinations and photos
    const favoriteDestinationLength = helpers.handleLength(
      favoriteDestinationList
    );
    const favoritePhotosListLength = helpers.handleLength(favoritePhotosList);

    //  sum the length
    const favoriteSum = favoriteDestinationLength + favoritePhotosListLength;

    // display the sum to the user
    uiHandler.handleDisplayMessageToTheUser(favoriteCounter, favoriteSum);
  }

  //**
  /* check if the current photo being loading was set as favorite by the user
   /* @param {String} currentLoadingPhotoId 
   */
  handleIsUserFavorite(currentLoadingPhotoId) {
    // get the favorite phtoos list from the local storage
    const favoritePhotos =
      helpers.handleLocalStorage("favoritePhotos", "get") || [];

    // check to see if we have any photo that match the current loading photo's id
    return favoritePhotos.some(photo => {
      if (photo) return photo.id === currentLoadingPhotoId;
    });
  }

  //**
  /* Display either the favorite photos or destinations to the user
   /* @param {ArrayObjec} objecList 
   /* @param {from} String : use as a flag to signal where the query came from, 
   // if the event came  from the photos page prevent the redirect action,  otherwise 
   // if its came from home page then redirect the user to the photos page.
   */
  handleDisplayAllFavorite(favoritesList, from) {
    const favoriteDestinations = favoritesList
      .map(favorite => {
        // split the full destination name for a better display
        const splitedCity = helpers.handleSplitString(favorite, ",");

        // return the destination block block
        return `
          <!--start destination block-->
          <div data-destination="${favorite}" class="destination_block all_destination_favorite_block hide ${from}" style="background-image: url('https://source.unsplash.com/featured/?${favorite}')">
              <div class="destination_name_container">
                  <p class="destination_name">${splitedCity[0]} - ${splitedCity[1]}</p>
              </div>
          </div>
          <!--end destination block-->
      `;
      })
      .join("");

    // buil the html format of tthe destinations favorite
    const favoriteDestinationsHtmlFormat = `
       <div class="destination_block_container">
          ${favoriteDestinations}
        </div>
    `;

    // display favorite to the user
    uiHandler.handleDisplayMessageToTheUser(
      photosDestinationsContent,
      favoriteDestinationsHtmlFormat
    );
  }

  //**
  /* Display a number base on the length of favorite destinations or photos list
   */
  handleShowIndividualFavoriteCounter() {
    // get all favorite photos from the local storage
    const allFavoritePhotosList =
      helpers.handleLocalStorage(favoritePhotosKeyName, "get") || [];

    // get all favorite destinations from the local storage
    const allFavoriteDestinationList =
      helpers.handleLocalStorage(favoriteDestinationKeyName, "get") || [];

    //********* */

    // get the photos list length
    const listPhotoLength = helpers.handleLength(allFavoritePhotosList);

    // get  the destination list length
    const listDestinationLength = helpers.handleLength(
      allFavoriteDestinationList
    );

    //******** */

    /// show the the number of destination favorite
    uiHandler.handleDisplayMessageToTheUser(
      indiVidualDestinationCounter,
      listDestinationLength
    );

    /// show the the number of favorite photos
    uiHandler.handleDisplayMessageToTheUser(
      indiVidualPhotoCounter,
      listPhotoLength
    );
  }

  //
  handleDisplayFavoritePhotos(photos) {
    // create the HTML element to hold photos
    const divBlock = document.createElement("div");

    // give the html element a class (use for style)
    divBlock.classList.add("column_photos");

    // loop through the photo list and buil an html element
    const photoList = photos
      .map(photo => {
        return `
          <!--start single photo block-->
                        <div id="${
                          photo.id
                        }" data-from="favoritelist" class="single_photo_block">
    
                            <img  class="photo_image" src="${
                              photo.urls.regular
                            }" alt="${photo.urls.regular}">
    
                            <div class="single_photo_auto_favorite footer_author_place_name">
                                
                                <div class="user_profile">
                                    <img data-href="${
                                      photo.user.links.html
                                    }" class="author_image has_href" src="${
          photo.user.profile_image.medium
        }" alt="">
                                    <div class="author_name_location">
                                        <p data-href="${
                                          photo.user.links.html
                                        }" class="author_name has_href">${
          photo.user.name
        }</p>
                                        <p class="author_location">${helpers.handleIsFalsy(
                                          photo.user.location
                                        )}</p>
                                    </div>
                                </div>
    
                                <div class="like_and_download">
                                    <img data-id="${
                                      photo.id
                                    }" data-favorite="unset" class="favorite_icon single_photo_favorite_icon delete_favorite_photo" src="${fullHeart}" alt="">
                                    <div class="download_button">
                                        <img data-href="${
                                          photo.links.download
                                        }?force=true" class="download_icon has_href" src="download.348554b6.svg" alt="">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--end single photo block-->
      `;
      })
      .join("");

    // selected the container that will hold the photos
    const container = document.querySelector(".photos_block_container");

    // set the divBlock's innerHTML equal the photo list
    divBlock.innerHTML = photoList;

    // wait 1s
    setTimeout(() => {
      container.appendChild(divBlock);
    }, 1000);
  }
}

// ******** INSTANTIATE THE OBJECT *******//
const uiHandler = new UIHandler();

//********** EXPORT THE CLASS / FU*/
export default UIHandler;

export { uiHandler };
