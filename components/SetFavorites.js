"use strict";
import Glide from "@glidejs/glide";

// ************ IMPORT MODULES **************** //
import { helpers } from "../components/Helpers";
import UIHandler from "../components/UIHandler";
import URLRedirection from "../components/URLRedirector";
import { showAllFavorites } from "../components/ShowAllFavorites";
import { apisrequest } from "../components/ApisRequest";
import {
  favoriteCounter,
  destinationSuggestionIcon,
  favoriteDestinationContainer,
  loader,
  favoriteEmptyMessage,
  arrows
} from "../components/HTMLElementSelector";

// ************ INSTANTIAT OBJECTS *********** //
const uiHandler = new UIHandler();
const urlRedirector = new URLRedirection();

// *********** CLASSES DECLARATION *************//
class SetFavorites {
  //**
  /* Handle to set or unset a photo/destination as favorite.
     /* @param {Event} e  
     /*/
  handleSetFavorites(e) {
    // get the target element
    const targetDestination = e.target;

    // get the class list of the target element
    const targetDestinationClassList = targetDestination.classList;

    // check to see what element has been clicked.
    // this will help to determine either to set as favorite the clicked destination or display photos for the target destination
    if (
      targetDestinationClassList.contains("destination_suggestion_name") ||
      targetDestinationClassList.contains(
        "destination_suggestion_name_content_overlay"
      ) ||
      targetDestinationClassList.contains(
        "destination_suggestion_name_container"
      ) ||
      targetDestinationClassList.contains(
        "favorite_icon_destination_container"
      ) ||
      targetDestinationClassList.contains("all_destination_favorite_block")
    ) {
      // we run this code if the user does not click the like button
      // get the parent eleme of the clicked element
      // this will help us to get the destination
      const parentNodeDestinationName =
        targetDestination.parentNode.parentNode.parentNode;

      const parentOverLay = targetDestination.parentNode;
      // get the destination name
      const destinationName =
        parentOverLay.dataset.destination ||
        parentNodeDestinationName.dataset.destination ||
        targetDestination.dataset.destination;

      // save the city has visited
      helpers.handleSaveVisitedCities(destinationName);

      // check to see if the event came from the all favorites container (page)
      // if yes we prevent the redirection, we hide the favorite container and
      // display the photos base on the clicked favorite destination
      if (
        helpers.handleHasThisClass(
          targetDestination,
          "all_destination_favorite_block"
        ) &&
        helpers.handleHasThisClass(targetDestination, "photos_page")
      ) {
        // hide the all favorite container
        showAllFavorites.handleShowHideAllFavoritesContainer(e);

        // fetch and display photos base on the clicked favorite destination
        apisrequest.handleGetPhotos(destinationName);

        // set the destination name as the current  search key word
        helpers.handleLocalStorage("searchKeyWord", "set", {
          name: destinationName
        });
      } else {
        // redirect the user to the photos page
        urlRedirector.handleRedirection(destinationName);
      }
    }

    // if the user click the favorite button then run this code
    if (targetDestination.dataset.setfavorite) {
      // first check to see if the clicked favorite belongs to the destination suggestion block
      // if yes run this code
      if (targetDestination.dataset.destinationname) {
        // set the key name that will help to identify the favorite Destination list in the local storage
        const keyName = "favoriteDestinations";

        // get the favorite Name (the city name)
        const favDestinationName = targetDestination.dataset.destinationname;

        // get the favorite list from the local storage
        let favoriteDestination =
          helpers.handleLocalStorage(keyName, "get") || [];

        // check to see if we have a favorite list
        if (favoriteDestination) {
          // check to see if the favorite list is great than 0
          if (favoriteDestination.length > 0) {
            // check to see if the clicked destination is in the favorite lsit from the local storage
            if (helpers.isInTheArray(favDestinationName, favoriteDestination)) {
              // if the list from the local storage contains the clicked destination
              //then remove it from the list.
              const newFavoriteList = favoriteDestination.filter(
                destination => destination !== favDestinationName
              );

              // save the new list in the local storage
              helpers.handleLocalStorage(keyName, "set", newFavoriteList);

              // change the icon to an empty heart
              targetDestination.setAttribute(
                "src",
                "/heart_single_photo.981e654d.svg"
              );

              // update the counter favorite in the nav bar
              uiHandler.handleDisplayFavoriteCount();
            } else {
              // if the clicked destination is not in the list from the local storage
              // push the new destination in the list
              favoriteDestination.push(favDestinationName);

              // insert the list in the local storage as first favorite.
              helpers.handleLocalStorage(keyName, "set", favoriteDestination);

              // set the favorite to a full heart
              targetDestination.setAttribute(
                "src",
                "/full_heart_icon.58bd4568.svg"
              );

              // update the favorite counter in the nav bar
              uiHandler.handleDisplayFavoriteCount();
            }
          } else {
            // if the favorite is less than 0
            // push the lick to the empty array array
            favoriteDestination.push(favDestinationName);

            //save the first favorite in the local storage
            helpers.handleLocalStorage(keyName, "set", favoriteDestination);

            // set he clicked favorite icon to a full heart
            targetDestination.setAttribute(
              "src",
              "/full_heart_icon.58bd4568.svg"
            );

            // update the counter in the nav bar
            uiHandler.handleDisplayFavoriteCount();
          }
        } else {
          // if we we do not have any list
          // push the new destination in the array
          favoriteDestination.push(favDestinationName);

          // save the new destination in the local storage
          helpers.handleLocalStorage(keyName, "set", favoriteDestination);

          // set the clicked heart to a full heart
          targetDestination.setAttribute(
            "src",
            "/full_heart_icon.58bd4568.svg"
          );

          // update the counter in the nav bar
          uiHandler.handleDisplayFavoriteCount();
        }
        // refresh the favorite block
        setFave.handleDisplayFavorite("destination");
      }
    }
  }

  //**
  /* this method set an empty heart to a full if the destination has been saved has favorite.
   /* @param {String} target is the flag that determine wich list to get from the local storage (photos/destination)
   */
  handleShowAsFavorite(target = null) {
    // set the keyname to look for in the local storage
    const keyName = "favoriteDestinations";

    // if the tarage is equal to suggestionDestination
    // execute this code
    if (target === "suggestionDestination") {
      // get the favorite list if exit or set it to an empty array
      const favoriteListFromLocalStorage =
        helpers.handleLocalStorage(keyName, "get") || [];

      /// check if the destination name is in the favorite list
      // if yes set a full heart otherwise do nothing
      destinationSuggestionIcon.forEach(icon => {
        if (
          helpers.isInTheArray(
            icon.dataset.destinationname,
            favoriteListFromLocalStorage
          )
        ) {
          icon.setAttribute("src", "/full_heart_icon.58bd4568.svg");
        }
      });

      // update the counter in the nav bar
      uiHandler.handleDisplayFavoriteCount();
    }
  }

  //**
  /* This method display the user's favorite destination and photos on UI (User Interface)
   /* its handle also the counter update in the nav bar 
   /* @param {String} target a string flag to indicate what to load on UI either the favorite destinations or phtos
   */
  handleDisplayFavorite(target) {
    // if the falg indicate destination
    // then load the destinations favorite to the user interface
    if (target === "destination") {
      // display the loader if the process takes long
      uiHandler.handleDisplayMessageToTheUser(
        favoriteDestinationContainer,
        loader
      );

      // get all favorite destination from the the local storage
      const getFavoritesDestination =
        helpers.handleLocalStorage("favoriteDestinations", "get") || [];
      const favoriteListLength = helpers.handleLength(getFavoritesDestination);

      // check to see if we have a favorite list
      if (getFavoritesDestination && favoriteListLength > 0) {
        // if yes
        // loop through the list and  generate an HTML format from that list
        const favList = getFavoritesDestination
          .map(favorite => {
            const splitedCity = helpers.handleSplitString(favorite, ",");
            return `
                  <!--start destination block-->
                  <div data-destination="${favorite}" class="destination_suggestion_block" style="background-image: url('https://source.unsplash.com/featured/?${favorite}')">
                  
                      <div class="favorite_icon_destination_container">
                          <img data-setfavorite="destination" data-destinationname="${favorite}" src="/full_heart_icon.58bd4568.svg"
                              alt="">
                      </div>
                  
                      <div class="destination_suggestion_name_container">
                          <div class="destination_suggestion_name_content_overlay">
                              <p class="destination_suggestion_name">${
                                splitedCity[0]
                              } - ${splitedCity[1]}</p>
                          </div>
                      </div>
                  
                  </div>
                  <!--start destination block-->
              `;
          })
          .join("");

        let blockContainer = "";

        if (favoriteListLength > 0) {
          if (favoriteListLength < 4) {
            // if the favorites are less than 3 remove the carousel
            arrows.forEach(arrow => (arrow.style.display = "none"));
            blockContainer = `
                <div class="suggestion_destination_less_block_container">
                  ${favList}
                </div>
            `;
          }

          if (favoriteListLength >= 4) {
            // if the favorites are great than 3 add the carousel
            arrows.forEach(arrow => (arrow.style.display = "block"));
            blockContainer = `
                <div class="glide__slides favorite_pictures_slides">
                     ${favList}
                </div>
            `;

            ///// instantiate the favorie carousel
            setTimeout(() => {
              new Glide(".favorite_destination_slider", {
                type: "carousel",
                startAt: 0,
                perView: 3
              }).mount();
            }, 500);
          }

          // await 2 second ans append a click event on all blocks
          setTimeout(() => {
            // add a click event on each block of the favorite destinations
            const favoriteDestinationOverOnHover = document.querySelectorAll(
              ".destination_suggestion_name_container"
            );

            helpers.handleAddEventListener(
              favoriteDestinationOverOnHover,
              "click",
              setFave.handleSetFavorites
            );
          }, 1000);
        }

        // display the favorite to the UI
        uiHandler.handleDisplayMessageToTheUser(
          favoriteDestinationContainer,
          blockContainer
        );
      } else {
        // if the list is empty then display an empty warning to the user
        uiHandler.handleDisplayMessageToTheUser(
          favoriteDestinationContainer,
          favoriteEmptyMessage
        );
      }
    }
  }
}

// ************  EXPORT MODULS ************//
export default SetFavorites;

const setFave = new SetFavorites();

export { setFave };
