const {
  DateTime
} = require("luxon");
const fetch = require("node-fetch");

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

async function fetchGitHubUser(githubHandle) {
  console.log(`Fetching GitHub data... ${githubHandle}`);
  const github = await fetch(`https://api.github.com/users/${githubHandle}`)
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
    });

    return `
      <div class="p-5"><img class="rounded-circle img-fluid" src="${ github.avatar_url }" /></div>
      <h4>${ github.name }</h4>
      <p class="lead">From ${ github.location }<br/> working at ${ github.company }</p>
      <p>You can find me on GitHub here: <a href="https://github.com/${ githubHandle }" target="_blank">${ githubHandle }</a>.</p>
    `;
};
