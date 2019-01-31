// GLOBAL HTML CALL
const inputs = document.querySelector("input"),
  searchDropDown = document.querySelector(".search_result_dropdown"),
  navBar = document.querySelector(".home_nav_bar"),
  searchIcon = document.querySelector(".search_icon"),
  searchInput = document.querySelector(".search_input"),
  heroHeader = document.querySelector(".header_hero"),
  visitedCitiesContainer = document.querySelector(".visited_cities_suggestion"),
  newSuggestionCitiesContainer = document.querySelector(
    ".new_cities_container"
  ),
  lastVisitedCitiesContaienr = document.querySelector(
    ".visited_cities_suggestion"
  ),
  suggestionDestinationContainer = document.querySelectorAll(
    ".destination_suggestion_block"
  ),
  favoriteCounter = document.querySelector(".favorite_counter"),
  destinationSuggestionContainer =
    document.querySelector(".destination_suggestion_container") || document,
  destinationSuggestionIcon = destinationSuggestionContainer.querySelectorAll(
    "img"
  ),
  favoriteDestinationContainer = document.querySelector(
    ".favorite_destination_blocks"
  ),
  arrows = document.querySelectorAll(".destination_fav_arrows"),
  getPhotoCurrentLocation = document.querySelector(".current_location_button"),
  photosPageMainContainer = document.querySelector(".photos_main_container"),
  photosLocationTitle = document.querySelector(".photos_location_text"),
  photosCounter = document.querySelector(".photo_counter_text"),
  firstPhotosBlock = document.querySelector(".first_block"),
  secondPhotosBlock = document.querySelector(".middle_block"),
  lastPhotosBlock = document.querySelector(".third_block"),
  loaderContainer = document.querySelector(".loader_container"),
  tagsContainer = document.querySelector(".photos_filter_container"),
  $map = document.querySelector("#map"),
  switchButton = document.querySelector(".switch_the_map_button"),
  togglerSwitchMap = document.querySelector(".switch_the_map_toggler"),
  switchButtonText = document.querySelector(".switch_the_map_text"),
  photosAndMapContainer = document.querySelector(".photos_map_container"),
  photosBlocksContainer = document.querySelector(
    ".main_photos_grid_blocks_container"
  ),
  singlePhotoDetailsContainer = document.querySelector(
    ".show_single_photo_details_container"
  ),
  singlePhotoDetailsContent = document.querySelector(
    ".show_single_photo_details_content"
  ),
  allPhotosDestinationsContainer = document.querySelector(
    ".display_favorite_photos_container"
  ),
  showHideAllFavoritesButton = document.querySelectorAll(
    ".handle_all_fav_container"
  ),
  photosDestinationsContent = document.querySelector(
    ".photos_destinations_favorite_container"
  ),
  switchAllFavoritesButton = document.querySelectorAll(".switch_button"),
  indiVidualPhotoCounter = document.querySelector(
    ".individual_fav_counter_photo"
  ),
  indiVidualDestinationCounter = document.querySelector(
    ".individual_fav_counter_destination"
  );

// GLOBAL VARIABLES
const notFoundMessage = `
    <div class="error_message">
        <p class="mesage_main_text">Oops ! seems like this city does not exist</p>
        <p class="message_sub_text">That's okay if you do not look for a city photos</p>
        <p class="message_go_ahead">Go ahead !</p>
    </div>
`;

const loader = `
    <div id="loader"></div>
`;

const favoriteEmptyMessage = `
      <div class="error_message_favorites">
          <p class="fav_mesage_main_text">Oops ! seems like your favorite list is empty</p>
      </div>
`;

const showLoader = "loader_container_show";
const hideLoader = "loader_container_hide";

const fullHeart = "full_heart_icon.58bd4568.svg";
const emptyHeart = "heart_single_photo.981e654d.svg";

//favorite  local storage key
const favoritePhotosKeyName = "favoritePhotos";
const favoriteDestinationKeyName = "favoriteDestinations";

// EXPORT ELEMENTS
export {
  inputs,
  searchDropDown,
  navBar,
  searchIcon,
  searchInput,
  heroHeader,
  visitedCitiesContainer,
  notFoundMessage,
  newSuggestionCitiesContainer,
  loader,
  lastVisitedCitiesContaienr,
  suggestionDestinationContainer,
  favoriteCounter,
  destinationSuggestionIcon,
  favoriteDestinationContainer,
  favoriteEmptyMessage,
  arrows,
  getPhotoCurrentLocation,
  photosPageMainContainer,
  photosLocationTitle,
  photosCounter,
  firstPhotosBlock,
  secondPhotosBlock,
  lastPhotosBlock,
  loaderContainer,
  showLoader,
  hideLoader,
  tagsContainer,
  $map,
  switchButton,
  togglerSwitchMap,
  switchButtonText,
  photosAndMapContainer,
  photosBlocksContainer,
  fullHeart,
  emptyHeart,
  singlePhotoDetailsContainer,
  singlePhotoDetailsContent,
  allPhotosDestinationsContainer,
  showHideAllFavoritesButton,
  photosDestinationsContent,
  switchAllFavoritesButton,
  indiVidualPhotoCounter,
  indiVidualDestinationCounter,
  favoritePhotosKeyName,
  favoriteDestinationKeyName
};
