"use strict";

const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");

const TVMAZE_SINGLE_SEARCH_ENDPOINT = "https://api.tvmaze.com/singlesearch/shows";
const DEFAULT_IMAGE = "https://tinyurl.com/tv-missing";

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */

async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const showInfo = await axios.get(TVMAZE_SINGLE_SEARCH_ENDPOINT, {
    params: {
      q: term,
    },
  });

  console.log('showInfo response = ', showInfo);

  const showId = showInfo.data.id;

  const episodes = await axios.get(`http://api.tvmaze.com/shows/${showId}/episodes`, {
  });

  console.log('episodes response = ', episodes);

  let showObjects = [];

  for (let show of episodes.data) {
    let showCurr = {
      id: show.id,
      name: show.name,
      summary: show.summary
    };
    let showImageUrl = show.image.original || DEFAULT_IMAGE;
    showCurr.image = showImageUrl;
    showObjects.push(showCurr);
  }

  console.log('showObjects', showObjects)
  return showObjects;
}


/** Given list of shows, create markup for each and append to DOM.
 *
 * A show is {id, name, summary, image}
 * */

function displayShows(shows) {
  $showsList.empty();

  for (const show of shows) {
    const $show = $(`
        <div data-show-id="${show.id}" class="Show col-md-12 col-lg-6 mb-4">
         <div class="media">
           <img
              src=${show.image}
              alt=This is the cover image for the show ${show.name}
              class="w-25 me-3">
           <div class="media-body">
             <h5 class="text-primary">${show.name}</h5>
             <div><small>${show.summary}</small></div>
             <button class="btn btn-outline-light btn-sm Show-getEpisodes">
               Episodes
             </button>
           </div>
         </div>
       </div>
      `);

    $showsList.append($show);
  }
}


/** Handle search form submission: get shows from API and display.
 *    Hide episodes area (that only gets shown if they ask for episodes)
 */

async function searchShowsAndDisplay() {
  const term = $("#searchForm-term").val();
  const shows = await getShowsByTerm(term);

  $episodesArea.hide();
  displayShows(shows);
}

$searchForm.on("submit", async function handleSearchForm(evt) {
  evt.preventDefault();
  await searchShowsAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

// async function getEpisodesOfShow(id) { }

/** Write a clear docstring for this function... */

// function displayEpisodes(episodes) { }

// add other functions that will be useful / match our structure & design
