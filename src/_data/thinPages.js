// { "research/<slug>": ["de", ...] }: thin translated locales (see lib/thin-pages.js).
const { thinLocalesBySlug } = require("../../lib/thin-pages.js");

module.exports = function () {
  return thinLocalesBySlug(require("./articles.js")());
};
