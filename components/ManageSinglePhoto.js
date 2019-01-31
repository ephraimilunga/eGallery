"use strict";

// ************** IMPORT MODULES **********//
import { helpers } from "./Helpers";
import {
  fullHeart,
  emptyHeart,
  singlePhotoDetailsContainer,
  loader,
  singlePhotoDetailsContent,
  photosBlocksContainer,
  photosDestinationsContent
} from "../components/HTMLElementSelector";
import { uiHandler } from "./UIHandler";

// ************** INSTANTIATE OBJECT ************//

// ************* CLASS DECLARATION *********** //
class SinglePhotoManager {
  //**
  /* This method set a single photo as favorite, download a photo when the download button is click
   /* and display the details of a photo;
   /* @param {Event} e 
   /* @param {String} from (is the flag to append or not an event listener on the single
   /* view container). if its set to null then append an event, if its set to "photo_details" do not append an event, 
   /* this will prevent to append twice an event on the single photo view container
   /* 
   */
  handleSinglePhoto(e, from = null) {
    // get the element that has been clicked
    const clickedElement = e.target;

    // set the photo as favorite when the user click on the heart icon
    if (
      helpers.handleHasThisClass(clickedElement, "single_photo_favorite_icon")
    ) {
      // get the like state
      const likeState = clickedElement.dataset.favorite;

      // get the photo id
      const id =
        clickedElement.parentNode.parentNode.getAttribute("id") ||
        clickedElement.dataset.id;

      /// if the state is unset then set it otherwise unset
      if (likeState === "unset") {
        // change the the empty heart to an empty one
        clickedElement.setAttribute("src", fullHeart);

        // save the photo as favorite
        manageSinglePhoto.handleSetUnsetFavorite(id);

        // set the state to set
        clickedElement.dataset.favorite = "set";
      } else {
        // change the full heart to an empty one
        clickedElement.setAttribute("src", emptyHeart);

        // save the photo as favorite
        manageSinglePhoto.handleSetUnsetFavorite(id);

        // set the state to unset
        clickedElement.dataset.favorite = "unset";
      }
    }

    // handle download or open the user/author of the photo profile
    if (helpers.handleHasThisClass(clickedElement, "has_href")) {
      window.open(clickedElement.dataset.href, "_blank");
    }

    // display the details container when the user click on the picture
    if (
      helpers.handleHasThisClass(clickedElement, "footer_author_place_name")
    ) {
      // display the loader the loader
      uiHandler.handleDisplayMessageToTheUser(
        singlePhotoDetailsContent,
        loader
      );

      // get the cliked photo id
      const photoId = clickedElement.parentNode.getAttribute("id");

      // set the flag that indicate we should load data from favorite photos list
      // if the query was triggered from the favorite list
      const actionFrom = clickedElement.parentNode.dataset.from;

      // show the single photo details
      helpers.handleAddClass(
        singlePhotoDetailsContainer,
        "show_single_photo_details_container_show"
      );

      // remove the the class that hide the single  photo details container
      helpers.handleRemoveClass(
        singlePhotoDetailsContainer,
        "show_single_photo_details_container_hide"
      );

      // await 1s to display the photo details
      setTimeout(() => {
        uiHandler.handleDisplayMessageToTheUser(
          singlePhotoDetailsContent,
          manageSinglePhoto.handleDisplaySinglePhotoDetails(photoId, actionFrom)
        ); // display the clicked photo details
      }, 1000);

      // if the form argument is null then add an event to the single details view conatiner
      // this prevent to append multiple event to the container when runnung theis function again
      if (from === null) {
        setTimeout(() => {
          // dov
          singlePhotoDetailsContent.addEventListener(
            "click",
            manageSinglePhoto.handleSetFavoritePhotosDetailsView
          );
        }, 1000);
      }
    }
  }

  //**
  /* Set or Unset a photo as favorite or detele if the action came from the favorite list
   /* @param {String} currentId 
   */
  handleSetUnsetFavorite(currentId) {
    // glabal variables
    const favoritePhotosKey = "favoritePhotos";
    const photosDetailsKey = "photosDetails";

    // get the photos details list from the local storage
    const photosDetailsList =
      helpers.handleLocalStorage(photosDetailsKey, "get") || [];

    // get the favorite photos list from local stoage
    // filter to remove any none value
    const favoritePhotos =
      helpers.handleLocalStorage(favoritePhotosKey, "get") || [];

    // get the favorite photos list length
    const favoritePhotosListLength = helpers.handleLength(favoritePhotos);

    if (favoritePhotos) {
      if (favoritePhotosListLength > 0) {
        // check if we have the current id in the list
        const isPresent = helpers
          .handleClearArrayObject(favoritePhotos)
          .some(photo => photo.id === currentId);

        // if we have the current id in the list then remove from the list
        // and set the icon to an empty heart
        if (isPresent) {
          // filter and remove the photo details that match the current id;
          const newFavoritePhotosList = helpers
            .handleClearArrayObject(favoritePhotos)
            .filter(photo => photo.id !== currentId);

          // save the new list in the local storage
          helpers.handleLocalStorage(
            favoritePhotosKey,
            "set",
            newFavoritePhotosList
          );

          // select the icon corresponding to the current clicked photo block id
          // on search result container or the container that display all fovorite (photos/destination)
          const favoriteIcon = helpers.handleSelectFavoriteIcons(
            currentId,
            photosBlocksContainer,
            photosDestinationsContent,
            singlePhotoDetailsContainer
          );

          //set the status to unset (mains not yet set as favorite)
          favoriteIcon.dataset.favorite = "unset";
          // change the icon to an empty heart
          favoriteIcon.setAttribute("src", emptyHeart);

          // check to see if the clicked icon is one of the favorite photos
          // base on the delete favorite class. If yes we gonna delete the clickd  photo
          if (
            helpers.handleHasThisClass(favoriteIcon, "delete_favorite_photo")
          ) {
            // remove the current photo from UI
            helpers.handleRemoveElementFromUI(
              favoriteIcon.parentNode.parentNode.parentNode
            );
          }
        } else {
          // if we do not have the id in the list
          // insert it and set the icon to a full heart.

          //****  */

          // get the photo details that match the currrent id from the photosDetails list
          const photoDetails = helpers
            .handleClearArrayObject(photosDetailsList)
            .filter(photo => photo.id === currentId);

          // add the photo details to the favorite photos list
          favoritePhotos.push(photoDetails[0]);

          // save the new favorite photos list
          helpers.handleLocalStorage(favoritePhotosKey, "set", favoritePhotos);

          // select the icon corresponding to the current clicked photo block id
          // on search result container or the container that display all fovorite (photos/destination)
          const favoriteIcon = helpers.handleSelectFavoriteIcons(
            currentId,
            photosBlocksContainer,
            photosDestinationsContent,
            singlePhotoDetailsContainer
          );
          //set the status to unset (mains not yet set as favorite)
          favoriteIcon.dataset.favorite = "set";
          // change the icon to an empty heart
          favoriteIcon.setAttribute("src", fullHeart);

          // check to see if the clicked icon is one of the favorite photos
          // base on the delete favorite class. If yes we gonna delete the clickd  photo
          if (
            helpers.handleHasThisClass(favoriteIcon, "delete_favorite_photo")
          ) {
            helpers.handleRemoveElementFromUI(
              favoriteIcon.parentNode.parentNode.parentNode
            );
          }
        } // end else
      } else {
        // if we do not have the id in the list
        // insert it and set the icon to a full heart.

        //****  */

        // get the photo details that match the currrent id from the photosDetails list
        const photoDetails = helpers
          .handleClearArrayObject(photosDetailsList)
          .filter(photo => photo.id === currentId);

        // add the photo details to the favorite photos list
        favoritePhotos.push(photoDetails[0]);

        // save the new favorite photos list
        helpers.handleLocalStorage(favoritePhotosKey, "set", favoritePhotos);

        // select the icon corresponding to the current clicked photo block id
        // on search result container or the container that display all fovorite (photos/destination)
        const favoriteIcon = helpers.handleSelectFavoriteIcons(
          currentId,
          photosBlocksContainer,
          photosDestinationsContent,
          singlePhotoDetailsContainer
        );

        //set the status to unset (mains not yet set as favorite)
        favoriteIcon.dataset.favorite = "set";
        // change the icon to an empty heart
        favoriteIcon.setAttribute("src", fullHeart);

        // check to see if the clicked icon is one of the favorite photos
        // base on the delete favorite class. If yes we gonna delete the clickd  photo
        if (helpers.handleHasThisClass(favoriteIcon, "delete_favorite_photo")) {
          helpers.handleRemoveElementFromUI(
            favoriteIcon.parentNode.parentNode.parentNode
          );
        }
      }

      // update the favorites counter in the nav bar
      uiHandler.handleDisplayFavoriteCount();

      //update the counter on the favorite photos/destinations contaiener
      uiHandler.handleShowIndividualFavoriteCounter();
    }
  }

  //**
  /* Return the html format of the photo that match the id passed as argument with its details 
   /* @param {String} photoId 
   */
  handleDisplaySinglePhotoDetails(photoId, from) {
    // if the query came from the favorite photos list then load the data from
    // the favorite photos list otherwise load data from the photos Details list
    let photoDetaiilsList = "";
    let keyName = "";

    if (from !== "favoritelist") {
      // set the key name to identify the list in the local storage
      keyName = "photosDetails";

      // get all photo datails from the local storage
      photoDetaiilsList = helpers
        .handleLocalStorage(keyName, "get")
        .filter(photo => photo !== null);
    } else {
      // set the key name to identify the list in the local storage
      keyName = "favoritePhotos";

      // get all photo datails from the local storage
      photoDetaiilsList = helpers
        .handleLocalStorage(keyName, "get")
        .filter(photo => photo !== null);
    }

    // loop through to find the photo that match the given id
    const photoDetails = photoDetaiilsList.filter(
      photo => photo.id === photoId
    );

    // photo details
    const photo = photoDetails[0];

    // return the html format base on the photo details
    return `
      
        <div id="${photo.id}" class="section_details photo_section">
                  <div class="like_download_photos">
                        <img data-id="${photo.id}" data-favorite="${
      uiHandler.handleIsUserFavorite(photo.id) ? "set" : "unset"
    }" class="favorite_icon single_photo_favorite_icon" src="${
      uiHandler.handleIsUserFavorite(photo.id) ? fullHeart : emptyHeart
    }" alt="">
                        <div data-href="${
                          photo.links.download
                        }?force=true" class="download_container">
                            <img  data-href="${
                              photo.links.download
                            }?force=true" class="download_icon has_href" src="download.348554b6.svg" alt="">
                        </div>
                    </div>
                    <img class="photo_image" src="${photo.urls.full}" alt="">
                </div>

                <div class="section_details photos_info_section">
                    <img class="close_the_photo_details" src="cancel_icon.97a97d0f.svg" alt="">
                    <div class="author_details">
                        <img class="author_profile_picture" src="${
                          photo.user.profile_image.large
                        }" alt="">
                        <p class="author_name">${photo.user.name}</p>
                        ${helpers.handleIfValidReturnHtml(
                          photo.user.location,
                          "author_location"
                        )}  
                         ${helpers.handleIfValidReturnHtml(
                           photo.user.bio,
                           "author_bio"
                         )}
                    </div>

                    <div class="photot_details">
                        <p class="photo_description_title">Description</p>
                        ${helpers.handleIfValidReturnHtml(
                          photo.description,
                          "photo_description"
                        )}
                
                        <div class="photo_location">

                            <div class="left_block">
                                <div class="title">
                                    ${helpers.handleIfValidReturnHtml(
                                      photo.location
                                        ? photo.location.title
                                        : "...",
                                      "main_title"
                                    )}
                                    <p class="sub_title">Title</p>
                                </div>
                                
                                <div class="name">
                                     ${helpers.handleIfValidReturnHtml(
                                       photo.location
                                         ? photo.location.name
                                         : "...",
                                       "main_title"
                                     )}
                                    <p class="sub_title">Name</p>
                                </div>
                            </div>

                            <div class="right_block">
                                <div class="city">
                                      ${helpers.handleIfValidReturnHtml(
                                        photo.location
                                          ? photo.location.city
                                          : "...",
                                        "main_title"
                                      )}
                                    <p class="sub_title">City</p>
                                </div>
                                
                                <div class="country">
                                      ${helpers.handleIfValidReturnHtml(
                                        photo.location
                                          ? photo.location.country
                                          : "...",
                                        "main_title"
                                      )}
                                    <p class="sub_title">Country</p>
                                </div>
                            </div>

                        </div>

                        <div class="width_height_slug">
                            <div class="block_details photo_widh">
                                 ${helpers.handleIfValidReturnHtml(
                                   photo.width,
                                   "main_title"
                                 )}
                                <p class="sub_title">Width</p>
                            </div>
                        
                            <div class="block_details photo_height">
                                ${helpers.handleIfValidReturnHtml(
                                  photo.height,
                                  "main_title"
                                )}
                                <p class="sub_title">Height</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="photo_popularity_on_unsplash">
                        <p class="activity_on_un_title">On <a data-href="${
                          photo.links.html
                        }" href="${
      photo.links.html
    }" target="_blank">Unsplash</a></p>
                        <div class="block_details_on_un">
                            <div class="views">
                                ${helpers.handleIfValidReturnHtml(
                                  photo.views,
                                  "main_title"
                                )}
                                <p class="sub_title">Views</p>
                            </div>
                            
                            <div class="likes">
                                ${helpers.handleIfValidReturnHtml(
                                  photo.likes,
                                  "main_title"
                                )}
                                <p class="sub_title">Likes</p>
                            </div>
                            
                            <div class="download">
                             ${helpers.handleIfValidReturnHtml(
                               photo.downloads,
                               "main_title"
                             )}
                            <p class="sub_title">Download</p>
                            </div>
                        </div>
                    </div>

                </div>
    
    
    `;
  }

  //**
  /* theis function close and handle the like on the single photo details panel
   /* @param {Event} e 
   */
  handleSetFavoritePhotosDetailsView(e) {
    // get the element that has been clicked
    const clickedElement = e.target;

    // hide the the single photo details container when click on the cancel icon
    if (helpers.handleHasThisClass(clickedElement, "close_the_photo_details")) {
      // remove the class that shows the single photo details container
      helpers.handleRemoveClass(
        singlePhotoDetailsContainer,
        "show_single_photo_details_container_show"
      );

      // add the class that hide the single photos photo details container
      helpers.handleAddClass(
        singlePhotoDetailsContainer,
        "show_single_photo_details_container_hide"
      );
    }

    // send the event to the method that handle the set and unset favorite
    // by passing the second parameter to the function we sent a signal that says
    // the event was triggered on the single view container and therefore do not add another event to the container.
    manageSinglePhoto.handleSinglePhoto(e, "photo_details");
  }
}

// ************** EXPORT MODULES *******//
export default SinglePhotoManager;

const manageSinglePhoto = new SinglePhotoManager();

export { manageSinglePhoto };
