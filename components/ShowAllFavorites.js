"use strict";

//******************** IMPORT MODULES ********** */
import { helpers } from "../components/Helpers";
import { uiHandler } from "../components/UIHandler";
import {
  allPhotosDestinationsContainer,
  photosDestinationsContent,
  loader,
  favoritePhotosKeyName,
  favoriteDestinationKeyName
} from "../components/HTMLElementSelector";
//**************** INSTANTIATE OBJECTS ****** */

//**************** CLASSES DECLARATION ******* //
class ShowAllFavorites {
  //**
  /* Load all favorites
    /* @param {String} toDisplay : a string that defines either to display photos or destinations
     */
  handleShowFavorite(toDisplay, from = null) {
    // display the number for favorite destination and photos list
    uiHandler.handleShowIndividualFavoriteCounter();

    if (toDisplay === "destination") {
      // get all favorite from the local storage
      const allFavoriteList =
        helpers.handleLocalStorage(favoriteDestinationKeyName, "get") || [];

      // get  the list length
      const listLength = helpers.handleLength(allFavoriteList);

      if (allFavoriteList && listLength > 0) {
        // display the destinations
        uiHandler.handleDisplayAllFavorite(allFavoriteList, from);
      } else {
        // built the message
        const emptyFavoriteListMessge = `
            <div class="empty_list_error">
                <div class="empty_list_error_wrapper">
                    <p class="empty_list_error_main_title">Oops ! Your <strong> Destination </strong> list his empty.</p>
                    <p class="empty_list_error_sub_title">All your favorites will appear here</p>
                </div>
            </div>
        `;

        /// display an empty status message to the user
        uiHandler.handleDisplayMessageToTheUser(
          photosDestinationsContent,
          emptyFavoriteListMessge
        );
      }
    }

    if (toDisplay === "photo") {
      //main div blocks cotainer
      const mainDiv = '<div class="photos_block_container"></div>';
      // insert first the div that will hold the photo columns
      uiHandler.handleDisplayMessageToTheUser(
        photosDestinationsContent,
        mainDiv
      );

      // get all favorite from the local storage
      const allFavoriteList =
        helpers.handleLocalStorage(favoritePhotosKeyName, "get") || [];

      // get the list length
      const listLength = helpers.handleLength(allFavoriteList);

      // check to see if we have value in the list
      if (allFavoriteList && listLength > 0) {
        // get the splited array
        const splittedArray = helpers.handleSplitObject(allFavoriteList, 4);

        // loop through the new built array (splittedArray)
        // build html block and display them to the user
        splittedArray.map(photosGroup => {
          // call the method in charge of building and displaying the html format of  photos
          uiHandler.handleDisplayFavoritePhotos(photosGroup);
        });
      } else {
        // display an empty status message to the user
        const emptyFavoriteListMessge = `
            <div class="empty_list_error">
                <div class="empty_list_error_wrapper">
                    <p class="empty_list_error_main_title">Oops ! Your <strong> Photo </strong> list his empty.</p>
                    <p class="empty_list_error_sub_title">All your favorites will appear here</p>
                </div>
            </div>
          `;
        /// display an empty status message to the user
        uiHandler.handleDisplayMessageToTheUser(
          photosDestinationsContent,
          emptyFavoriteListMessge
        );
      }
    }
  }

  //**
  /* Show and hide the container that show all favorites
   /* @param {Event} e 
   */
  handleShowHideAllFavoritesContainer(e) {
    // get the clicked element
    const clickedElement = e.target;

    // class that hide the all favorite container
    const hide = "display_favorite_photos_container_hide";

    // class that show the all favorite container
    const show = "display_favorite_photos_container_show";

    // clicked element location (either home or photos page)
    const from = clickedElement.dataset.from;

    // if the clicked element has "show" in its class list
    // run this code
    if (helpers.handleHasThisClass(clickedElement, "show")) {
      // display the loader to the user
      uiHandler.handleDisplayMessageToTheUser(
        photosDestinationsContent,
        loader
      );

      // remove the class that hide the container
      helpers.handleRemoveClass(allPhotosDestinationsContainer, hide);

      // add the class that show the container
      helpers.handleAddClass(allPhotosDestinationsContainer, show);

      // get the element that has the current loading status
      // this will determine what to display to the user
      const switchButton = document.querySelector(".current_loading");

      // get the name to load
      const toLoad = switchButton.dataset.name;

      // call the method that display the favorites
      showAllFavorites.handleShowFavorite(toLoad, from);
    }

    //if the clicked element has "hide" in its classList
    // reun this code
    if (helpers.handleHasThisClass(clickedElement, "hide")) {
      // remove the class that show the container
      helpers.handleRemoveClass(allPhotosDestinationsContainer, show);

      // add the class that hide the container
      helpers.handleAddClass(allPhotosDestinationsContainer, hide);
    }
  }
}
// ************ EXPORT MODULES ************//
export default ShowAllFavorites;

const showAllFavorites = new ShowAllFavorites();

export { showAllFavorites };
