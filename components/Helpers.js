"use strict";

// modules import
import { uiHandler } from "./UIHandler";
import URLRedirection from "../components/URLRedirector";
import {
  searchDropDown,
  notFoundMessage,
  newSuggestionCitiesContainer,
  visitedCitiesContainer
} from "./HTMLElementSelector";

// instantiate objects
//const uiHandler = new UIHandler();
const urlRedirector = new URLRedirection();

// Classes declaration
export default class Helpers {
  //**
  /* toggle the given class in the given element or NodeList classlist
     /* @param {HTMLElement} HTMLElement
     /* @param {String} className 
     */
  handleTogglerClass(HTMLElement, className) {
    if (HTMLElement.length > 1) {
      HTMLElement.forEach(element => element.classList.toggle(className));
    } else {
      HTMLElement.classList.toggle(className);
    }
  }

  //**
  /* add the given class in the given element or nodeElement class list
       /* @param {HTMLElement/NodeList} HTMLElement 
       /* @param {String} className 
       */
  handleAddClass(HTMLElement, className) {
    if (HTMLElement.length > 1) {
      HTMLElement.forEach(element => element.classList.add(className));
    } else {
      HTMLElement.classList.add(className);
    }
  }

  //**
  /* remove the given class in the given element or NodeList class list
         /* @param {HTMLElement/NodeList} HTMLElement
         /* @param {String} className 
         */
  handleRemoveClass(HTMLElement, className) {
    if (HTMLElement.length > 1) {
      HTMLElement.forEach(element => element.classList.remove(className));
    } else {
      HTMLElement.classList.remove(className);
    }
  }

  //**
  /* position the html element passed as first argument to the same position as the second argument
   /* @param {HTMLElement} elementToPosition 
   /* @param {HTMLElement} elementToGetLocationFrom  (current target element)
   */
  handlePosition(elementToPosition, elementToGetLocationFrom) {
    // get the element position (elementToGetLocationFrom)
    const position = elementToGetLocationFrom.getBoundingClientRect();

    // set the position of the first argument element
    // width
    elementToPosition.style.width = position.width + "px";

    // top
    elementToPosition.style.marginTop = position.top + position.height + "px";

    // left
    elementToPosition.style.marginLeft = position.left + "px";
  }

  //**
  /* get the value of the passed input element and send it to the APIs Request handler
   /* @param {HTMLElement} inputElement 
   /* @param {from} from : a string value that determine from where the search action came from.
       if its came from the photos page do not redirect the user.
   */
  handleSetInputValue(inputElement, from = null) {
    //get the value from the input
    const value = inputElement.value;
    // send to the apis request method
    if (from !== "photosPage") {
      urlRedirector.handleRedirection(value);
    }
  }

  //**
  /* check to see if the element passed as argument has value and return true otherwise return false;
   /* @param {HTMLElement} element 
   */
  handleIsTruthy(element) {
    const regex = /[a-bA-Z]/gi;
    return element.value.match(regex);
  }

  //**
  /* check to see if the element passed as argument is not false and return the element otherwise nothing will be returned.
   /* @param {String} element 
   */
  handleIsFalsy(str) {
    return str ? str : "";
  }

  //**
  /* Return the html element passed as second argument if the first argument (valueToTest) is evaluated to true
   /* @param {String} valueToTest 
   /* @param {HTMLElement} HTMLElement 
   */
  handleIfValidReturnHtml(valueToTest, classToAdd) {
    if (valueToTest) {
      // create the element
      return `<p class="${classToAdd}">${valueToTest}</p>`;
    } else {
      return "...";
    }
  }

  // capitalise
  handleCapitalize(str) {
    if (!str) return;
    return str[0].toUpperCase() + str.slice(1);
  }

  //**
  /* set the value of the first argument to the attribute value from the target element (second argument)
   /* @param {HTMLElement} inputElement 
   /* @param {HTMLElement} targetElement
   /* @param {String} attributeNameToGetValueFrom
   */
  handleFillInput(
    inputElement,
    targetElement,
    attributeNameToGetValueFrom,
    from = null
  ) {
    // return if the attribute is falsy
    if (!targetElement.dataset[attributeNameToGetValueFrom]) return;

    // input value
    const valueFromTheInput =
      targetElement.dataset[attributeNameToGetValueFrom];

    // set the input value if the attribute is truthy
    inputElement.value = valueFromTheInput;

    // hide the dropdown
    helpers.handleRemoveClass(searchDropDown, "active");

    // save the city has visited
    helpers.handleSaveVisitedCities(valueFromTheInput);

    // redirect the user to the photos page
    // if the search action came fromm the home page
    // if its came from the photo page do not redirect
    if (from !== "photosPage") {
      urlRedirector.handleRedirection(valueFromTheInput);
    }

    if (from === "photosPage") {
      // helps to identify the array list in the local storage
      const keywordName = "searchKeyWord";

      // build the new search key word (its the current city the user viewing the photos)
      const keyword = { name: valueFromTheInput };

      // update the search keyword in the local storage
      helpers.handleLocalStorage(keywordName, "set", keyword);
    }
  }

  //**
  /* hide the dropdown on the searchform
   /* @param {Event} e 
   */
  handleHideTheDropdown(e) {
    e.stopPropagation();
    e.preventDefault();

    // stop the function if the clicked element is the input
    if (e.target.classList.contains("search_input")) return;

    // if its not the input remove hide the dropdown
    searchDropDown.classList.remove("active");
  }

  //**
  /* Visit the clicked city from the Visited List UI and local storage
   /* @param {Event} e 
   */
  handleDeleteVisitedCity(e) {
    // keyname as idendifier in local storage
    const keyName = "visitedCities";

    // get the clicked city parent element
    const clickedCityParentNode = e.target.parentNode.parentNode;

    //get the clicked city name
    const clickedCity = clickedCityParentNode.dataset.location;

    // remove the clicked city from the UI
    clickedCityParentNode.remove();

    // call the visited list from the local storage
    const visitedCitiesFromLocalStorage = helpers.handleLocalStorage(
      keyName,
      "get"
    );

    // remove the clicked city from the local storage
    const newVisitedList = visitedCitiesFromLocalStorage.filter(
      city => city !== clickedCity
    );

    // save the new visited cities list
    helpers.handleLocalStorage(keyName, "set", newVisitedList);

    // get the new length of the visited cities array
    const newVisitedListLength = newVisitedList.length;

    // remove the visited container from the UI if the visited list is empty
    if (newVisitedListLength < 1) {
      visitedCitiesContainer.remove();
    }
  }

  //**
  /* 
   /* @param {String} keyName  a string value that identify the value to get, remove or retrieve from the local storage
   /* @param {String} action  a string value that determine what action to perform against he local storage
   /* @param {Object} arrayObject an Array Object holding values to save in the local storage
   */
  handleLocalStorage(keyName, action, arrayObject = null) {
    // if the action is equal to delete then delete the give key in local storage
    if (action === "remove") {
      localStorage.removeItem(keyName);
    }

    // if the action is equal to get then retrieve the data related to the
    // given key from the local storage
    if (action === "get") {
      return JSON.parse(localStorage.getItem(keyName));
    }

    // if the action is equal to set then save the objec that has been passed
    // as the agument with the keyName as identifier
    if (action === "set" && arrayObject !== null) {
      localStorage.setItem(keyName, JSON.stringify(arrayObject));
    }
  }

  //**
  /* remove any element from the UI
   /* @param {HTMLElement} element the HTML Element to be removed from the UI
   */
  handleRemoveElementFromUI(element) {
    element.remove();
  }

  //**
  /* transform the given string to a string array
   /* @param {String} str the Sring to be convert in an array
   /* @param {String} separator a Sring that determine where to make each split
   */
  handleSplitString(str, separator) {
    return str ? str.split(separator) : "";
  }

  //**
  /* The cities object from the Api
   /* @param {Object} citiesList an object that should contains the cities list.
   */
  valideTheCitiesList(citiesList) {
    if (
      citiesList.length > 0 &&
      citiesList[0] !== "%s" &&
      citiesList[0] !== ""
    ) {
      // if the object has at list one valid value
      //send the cities list to the method that is in charge to display them on UI
      uiHandler.handleDisplayCity(citiesList);
    } else {
      // show a not found message to the user
      uiHandler.handleDisplayMessageToTheUser(
        newSuggestionCitiesContainer,
        notFoundMessage
      );
    }
  }

  //**
  /* Save any city passed as argument in the visited listed
   /* @param {String} city a string value containing the city to save as visited
   */
  handleSaveVisitedCities(city) {
    const keyName = "visitedCities";

    // get the visited cities form the local storage if not exist set it to ans empty array
    let visitedCitiesFromLocalStorage =
      helpers.handleLocalStorage(keyName, "get") || [];

    // check to see if we have any value from the local storage
    if (visitedCitiesFromLocalStorage) {
      // add the new city to the cities list from local storage
      const isInTheArray = helpers.isInTheArray(
        city,
        visitedCitiesFromLocalStorage
      );

      if (!isInTheArray) {
        // the current city is not present in the cities list from the local storage
        // add it to the cities list
        visitedCitiesFromLocalStorage.push(city);

        // and then save the new cities list
        helpers.handleLocalStorage(
          keyName,
          "set",
          visitedCitiesFromLocalStorage
        );
      }
    } else {
      // if we have no value
      //save the first citiy
      visitedCitiesFromLocalStorage.push(city);

      // save the new list of visited cities
      helpers.handleLocalStorage(keyName, "set", visitedCitiesFromLocalStorage);
    }
  }

  //**
  /* Check to see if the value passed as first argument exist in the array passed as second argument
   /* return true if found otherwise false
   /* @param {String} valueToSearch 
   /* @param {Array} arrayObject 
   */
  isInTheArray(valueToSearch, arrayObject) {
    return arrayObject.some(items => items === valueToSearch);
  }

  //**
  /* This method append an event listener passed as the second argument
   /* to the first argument element or listNode and set the third 
   /* argument as the function to be called when the event (eventName) is triggered
   /* @param {*} elementOrNodeList 
   /* @param {*} eventName 
   /* @param {*} functionToBeCalled 
   */
  handleAddEventListener(HTMLelementOrNodeList, eventName, functionToBeCalled) {
    if (HTMLelementOrNodeList.length > 1) {
      HTMLelementOrNodeList.forEach(element =>
        element.addEventListener(eventName, functionToBeCalled)
      );
    } else {
      HTMLelementOrNodeList.addEventListener(eventName, functionToBeCalled);
    }
  }

  //**
  /* return the length of the array or object passed as argument
   /* @param {ArrayObject} arrayObject 
   */
  handleLength(arrayObject) {
    return arrayObject ? arrayObject.length : 0;
  }

  //**
  /* Check to see if a html element has tha class passed as second argument in its classList
   /* @param {HTMLElement} element 
   /* @param {String} className 
   */
  handleHasThisClass(element, className) {
    return element.classList.contains(className);
  }

  //**
  /* split an array by the number passed as second argument (columnNumber) and return the splitted array;
   /* @param {ArrayObjec} arrayObjecToSplit 
   /* @param {Integer} columnNumber 
   */
  handleSplitObject(arrayObjecToSplit, columnNumber) {
    // copy from the orginal
    const copyFromOrginalArray = arrayObjecToSplit
      .slice()
      .reverse()
      .filter(photo => photo !== null);

    // length of the copied array (before we extact that from)
    const copyFromOrginalArrayLength = helpers.handleLength(
      copyFromOrginalArray
    );

    // initialize an empty array to hold the split arrray
    const photosGroupList = [];

    // set length that the photoGroupList array will be
    // this is also the number of column on the page
    const numberOfcolumn = columnNumber;

    // get the reminder value when the original
    // array is round to an even value
    const restValue = copyFromOrginalArrayLength % numberOfcolumn;

    // set the number of items (photos in this case) to be displayed
    // in each column (numberOfcolumn)
    const photosPerColumn =
      (copyFromOrginalArrayLength - restValue) / numberOfcolumn || 1;

    // loop first to evenly distribute the data
    for (let e = 0; e < numberOfcolumn; e++) {
      photosGroupList.push(copyFromOrginalArray.splice(0, photosPerColumn));

      // get the array length after the data has been evenly extracted
      const arrayLengthAfterExtraction = helpers.handleLength(
        copyFromOrginalArray
      );

      // loop for the second time to distribute the rest of the orginal array
      // if its great than 0
      if (
        arrayLengthAfterExtraction === restValue &&
        arrayLengthAfterExtraction > 0
      ) {
        for (let e = restValue - 1; e >= 0; e--) {
          photosGroupList[e].push(copyFromOrginalArray.splice(e)[0]);
        }
      }
    }

    // return the splitted array list
    return photosGroupList;
  }

  //**
  /* Remove all falsy values from an object or array
 /* @param {ArrayObjec} objecToClear  : the object or arrray to be cleared
 */
  handleClearArrayObject(objectToClear) {
    return objectToClear.filter(item => item !== null);
  }

  //**
  /* Return the favorite icon inside the containers passed as second or third or fourth argument (divContainers)
   /* that match the id passed as first argument
   /* @param {String} idendifier 
   /* @param {HTMLElement} firstDivContainer
   /* @param {HTMLElement} secondDivContainer
   /* @param {HTMLElement} thirdDivContainer
   */
  handleSelectFavoriteIcons(
    idendifier,
    firstDivContainer,
    secondDivContainer,
    thirdDivContainer
  ) {
    const indentifier = `img[data-id="${idendifier}"]`;

    if (firstDivContainer !== null) {
      if (helpers.handleSelectHTMLElement(firstDivContainer, indentifier)) {
        return helpers.handleSelectHTMLElement(firstDivContainer, indentifier);
      } else {
        return helpers.handleSelectHTMLElement(document, indentifier);
      }
    } else if (secondDivContainer !== null) {
      if (helpers.handleSelectHTMLElement(secondDivContainer, indentifier)) {
        return helpers.handleSelectHTMLElement(secondDivContainer, indentifier);
      } else {
        return helpers.handleSelectHTMLElement(document, indentifier);
      }
    } else if (thirdDivContainer !== null) {
      if (helpers.handleSelectHTMLElement(thirdDivContainer, indentifier)) {
        return helpers.handleSelectHTMLElement(thirdDivContainer, indentifier);
      } else {
        return helpers.handleSelectHTMLElement(document, indentifier);
      }
    } else {
      return helpers.handleSelectHTMLElement(document, indentifier);
    }
  }

  //**
  /* Return the html element passed as first argument  that match the selector passed as second argument
   /* @param {HTMLElement} htmlElement 
   /* @param {String} selector 
   */
  handleSelectHTMLElement(htmlElement, selector) {
    return htmlElement.querySelector(selector);
  }

  //**
   /* Update the visited counter when the user delete them 
   */
  handleCountVisitedCities () {
    // local storage identifier
    const storageKeyName = "visitedCities";

    // get the cities listed from the local storage
    const visitedCitiesFromLocalStorage = helpers.handleLocalStorage(storageKeyName, "get") || []

    // get the length 
    const visitedCitiesLength = helpers.handleLength(visitedCitiesFromLocalStorage);

    // get the counter container 
    const counterContainer = searchDropDown.querySelector("span.visited_cities_counter");

    // display the count number
    if (visitedCitiesLength > 0)
       uiHandler.handleDisplayMessageToTheUser(counterContainer, visitedCitiesLength);
   
  }
}

const helpers = new Helpers();

export { helpers };
