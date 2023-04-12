"use strict";

/** declare const for DOM elements and API links */
const $showsList = $("#showsList");
const $episodesArea = $("#episodesArea");
const $searchForm = $("#searchForm");

const TVMAZE_SHOW_SEARCH_ENDPOINT = "https://api.tvmaze.com/search/shows";
const DEFAULT_IMAGE = "https://tinyurl.com/tv-missing";

/** Given a search term, search for tv shows that match that query.
 *
 *  Returns (promise) array of show objects: [show, show, ...].
 *    Each show object should contain exactly: {id, name, summary, image}
 *    (if no image URL given by API, put in a default image URL)
 */
async function getShowsByTerm(term) {
  // ADD: Remove placeholder & make request to TVMaze search shows API.
  const showInfo = await axios.get(TVMAZE_SHOW_SEARCH_ENDPOINT, {
    params: {
      q: term,
    },
  });

  console.log('showInfo data = ', showInfo.data);

  let allShows = [];

  for (let show of showInfo.data) {
    let showCurr = {
      id: show.show.id,
      name: show.show.name,
      summary: show.show.summary
    };
    let showImageUrl = show.show.image.original || DEFAULT_IMAGE;
    showCurr.image = showImageUrl;
    allShows.push(showCurr);
  }

  return allShows;
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

/** Add event listener to submit button */
$searchForm.on("submit", async function handleSearchForm(evt) {
  evt.preventDefault();
  await searchShowsAndDisplay();
});


/** Given a show ID, get from API and return (promise) array of episodes:
 *      { id, name, season, number }
 */

async function getEpisodesOfShow(id) {
  const episodes = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`, {
  });

  console.log('episodes response = ', episodes);

  let allEpisodes = [];

  for (let show of episodes.data) {
    let showCurr = {
      id: show.id,
      name: show.name,
      season: show.season,
      number: show.number
    };
    let showImageUrl = show.image.original || DEFAULT_IMAGE;
    showCurr.image = showImageUrl;
    allEpisodes.push(showCurr);
  }

  console.log('allEpisodes', allEpisodes);
  return allEpisodes;
}

/** Write a clear docstring for this function... */

function displayEpisodes(episodes) {
  for (let episode of episodes) {
    let singleEpisode = $("<li>", {
      text: `${episode.name} (season ${episode.season}, number ${episode.number})`
    });
    $("#episodesList").append(singleEpisode);
  }
  $("#episodesArea").attr('style', 'display: inline');
}

// add other functions that will be useful / match our structure & design

function getAndDisplayEpisodes(id) {
  console.log("id", id)
  const episodes = getEpisodesOfShow(id);
  displayEpisodes(episodes);
}

$("#showsList").on("click", ".Show-getEpisodes", function (event) {
  const targetShowDiv = event.target.closest(".Show");
  console.log("target show div", targetShowDiv)

  const targetShowID = targetShowDiv.attr("data-value")
  console.log("target show id", targetShowID)

  getAndDisplayEpisodes(targetShowID);
});