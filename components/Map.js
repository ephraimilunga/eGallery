"use strict";

/// *************** IMPORT MODULES ***********//
//  Unsplash Modules
import Unsplash, { toJson } from "unsplash-js";
// personal modules
import { helpers } from "../components/Helpers";
import { $map } from "../components/HTMLElementSelector";
import { equal } from "assert";

// **************** INSTANTIATE OBJECTS *********//
//import "scriptjs";
const $scriptJs = require("scriptjs");

const unsplash = new Unsplash({
  applicationId:
    "e3374e82ff1b9b886ffd9e4c1dfc2ad987b5adaf517c3bd1c8db51e6fd88100f",
  secret: "1b63fc0d362480a011f79572963f239d2906fad4f6aa5ec5ba7ef289ea1f5e46",
  callbackUrl: "https://ephraimilunga.co.za/egallery/"
});

// **************** CLASS DECLARATION **********//
class Map {
  //**
  /* retrieve the detailsof each photo from the list object passed as argument
  /* @param {ArrayObjec} photoList 
   */
  async handleAllSinglePhotoDetails(photoList) {
    // key name to indentify the value in the local storage
    const keyName = "photosDetails";

    // empty the photos details list from local storage
    helpers.handleLocalStorage(keyName, "remove");

    // get all photos id
    const photoIds = await photoList.map(photo => photo.id);

    const photoIdsLengt = photoIds.length;

    // fetch all photos details
    await photoIds.forEach(id => {
      unsplash.photos
        .getPhoto(id)
        .then(toJson)
        .then(json => {
          // get the current photos details object from local storage
          const photosDetails =
            helpers.handleLocalStorage(keyName, "get") || [];

          // get the photoDetails length
          const photosDetailsLength = photosDetails.length + 1;

          // add the current iterate photo object to the array list from local storage
          photosDetails.push(json);

          // save the new list in the local storage
          helpers.handleLocalStorage(keyName, "set", photosDetails);

          // display the map the photosId and photosDetails length are equal
          if (photoIdsLengt === photosDetailsLength) {
            // display the map to the user
            initMap();
          }
        });
    });
  }
}

class GoogleMap {
  constructor() {
    this.map = null;
    this.bounds = null;
    this.TextMarke = null;
  }
  //**
  /* Load a map on the element passed as argument
   /* @param {HTMLElement} element 
   */
  async load(element) {
    return new Promise((resolve, reject) => {
      $scriptJs(
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyAJiIgRh18yhc2snlUOBB0avfnAbywNYCE",
        () => {
          // google overlay
          this.TextMarker = class TextMarker extends google.maps.OverlayView {
            constructor(pos, map, image) {
              super();
              this.img = null;
              this.pos = pos;
              this.image = image;
              this.setMap(map);
            }

            onAdd() {
              this.img = document.createElement("img");
              this.img.classList.add("marker");
              this.img.style.position = "absolute";
              this.img.setAttribute("src", this.image);
              this.getPanes().overlayImage.appendChild(this.img);
            }

            draw() {
              let position = this.getProjection().fromLatLngToDivPixel(
                this.pos
              );
              this.img.style.left = position.x + "px";
              this.img.style.top = position.y + "px";
              this.img.style.width = 60 + "px";
              this.img.style.height = 60 + "px";
              this.img.style.border = "2px solid #fff";
            }

            onRemove() {
              this.img.parentNode.removeChild(this.img);
            }
          };
          // and overlay
          // The map, centered at Uluru
          this.map = new google.maps.Map(element);
          this.bounds = new google.maps.LatLngBounds();
          // resolve
          resolve();
        }
      );
    });
  }

  //**
  /* display the position of photos on the map
   /* @param {String} lat 
   /* @param {String} lgn 
   /* @param {String} photo 
   */
  addMarker(lat, lng, photo) {
    const points = new google.maps.LatLng(lat, lng);
    // The marker
    let marker = new this.TextMarker(points, this.map, photo);

    // recenter the map
    this.bounds.extend(points);
  }

  //**
  /*Center map base on the icon.
   */
  centerMap() {
    this.map.panToBounds(this.bounds);
    this.map.fitBounds(this.bounds);
  }
}

const initMap = async function() {
  let map = new GoogleMap();
  await map.load($map);

  // key name to indentify the value in the local storage
  const keyName = "photosDetails";

  // get the current photos details object from local storage
  const photosDetails = helpers.handleLocalStorage(keyName, "get") || [];

  // the longitude, and latitude from the photos details object.
  photosDetails.forEach(photo => {
    if (photo.location) {
      if (photo.location.position) {
        if (
          photo.location.position.latitude &&
          photo.location.position.longitude
        ) {
          map.addMarker(
            photo.location.position.latitude,
            photo.location.position.longitude,
            photo.urls.small
          );
        }
      }
    }
  });

  // recenter map
  map.centerMap();
};

// **************** IMPORT MODULE *************//
export default Map;

const map = new Map();

export { map };
