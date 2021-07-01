const Cache = require("@11ty/eleventy-cache-assets");
const { DateTime } = require("luxon");
const fetch = require("node-fetch");

async function fetchGitHubUser(githubHandle) {
  console.log(`Fetching GitHub data... ${githubHandle}`);
  let github = await fetch(`https://api.github.com/users/${githubHandle}`)
    .then(res => res.json()) // node-fetch option to transform to json
    .then(json => {
      return {
        avatar_url: json.avatar_url,
        twitter: json.twitter_username,
        followers: json.followers,
        name: json.name,
        company: json.company,
        blog: json.blog,
        location: json.location
      };
    })

    return `
      <div class="p-5"><img class="rounded-circle img-fluid" src="${ github.avatar_url }" /></div>
                          <h3 class="h5">Dieser Job wird empfohlen von:</h3>
      <h4>${ github.name }</h4>
      <p class="lead">Aus ${ github.location },<br/> arbeitet bei ${ github.company }</p>
      <p>Du kannst ihn hier finden: <a href="https://github.com/${ githubHandle }" target="_blank" class="link-fancy">${ githubHandle }</a>.</p>
    `;
};



module.exports = function(eleventyConfig) {
  // Add a filter using the Config API
  eleventyConfig.addNunjucksAsyncShortcode("githubProfile", fetchGitHubUser);
  eleventyConfig.addWatchTarget("./src/scss/");
  eleventyConfig.setBrowserSyncConfig({
    reloadDelay: 400
  });
  eleventyConfig.addFilter("readableDate", dateObj => {
    return DateTime.fromJSDate(dateObj, {
      zone: 'utc'
    }).toFormat("dd LLL yyyy");
  });
  // limit filter
  eleventyConfig.addFilter("limit", function(array, limit) {
    return array.slice(0, limit)
    .reverse();
  });
  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', (dateObj) => {
    return DateTime.fromJSDate(dateObj, {
      zone: 'utc'
    }).toFormat('yyyy-LL-dd');
  });
  return {
    dir: {
      input: "src",
      output: "dev"
    }
  };

};
