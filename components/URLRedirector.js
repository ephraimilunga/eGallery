"use stric";

// ********** IMPORT MODULES ************//
import { helpers } from "../components/Helpers";

// *********** INSTANTIATE OBJECTS ************//
//const helpers = new Helpers();

// ******** GLASS DECLARATION***********//
class URLRedirection {
  //**
  /* Redirect the user to the page that display the photos base on the searchKeywork.
     /* @param {*} searchKeyWord a string value that indicate what to search for.
     */
  handleRedirection(searchKeyWord) {
    // keyname in the local storage
    const keywordName = "searchKeyWord";

    // new search key word from the user
    const keyword = { name: searchKeyWord };

    // get the key search key word value from local storage
    const getSearchKeyWord =
      helpers.handleLocalStorage(keywordName, "get") || [];

    // check to see if we have any value
    if (getSearchKeyWord) {
      // check to see if the search key word from the local storage is the same  as the new key word
      if (getSearchKeyWord.name === searchKeyWord) {
        // if is the same redirect the user immediatlly
        window.location.href = "http://localhost:1234/photos.html";
      } else {
        // if not
        // update the search keyword in the local storage
        helpers.handleLocalStorage(keywordName, "set", keyword);

        // redirect the user to the photos page
        window.location.href = "http://localhost:1234/photos.html";
      }
    } else {
      // if we do not have any search keyword in the database
      // we insert the new key
      helpers.handleLocalStorage(keywordName, "set", keyword);
      // redirect the user to the photos page
      window.location.href = "http://localhost:1234/photos.html";
    }

    //
  }
}

// export the class
export default URLRedirection;
