// Language switcher for the /research hubs. Every locale in langs.js has a hub,
// so the list is derived instead of being pasted into each hub template.
const langs = require("./langs.js");

// Order the five long-standing hubs first so the switcher does not shuffle.
const first = ["en", "es", "fr", "de", "pt", "ja"];
const ordered = [...first, ...langs.filter((l) => !first.includes(l))];

module.exports = ordered.map((code) => ({
  code,
  url: code === "en" ? "/research" : `/${code}/research`,
}));
