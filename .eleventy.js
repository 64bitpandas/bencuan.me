module.exports = function (eleventyConfig) {
  eleventyConfig.setLiquidOptions({
    dynamicPartials: true,
    strict_filters: true,
  });

  eleventyConfig.addLiquidFilter("modulo", function (
    num, mod
  ) {
    return num % mod;
  });

  // Copy static files
  let filesToCopy = {
    "src/js": "js",
    "archives": ".",
    "static/img": "img",
    "static/fontcustom": "fontcustom",
    "static/resources": "resources",
    "static/meta/*": ".",
    "static/css/*": "css/.",
  }
  Object.keys(filesToCopy).map(file => {eleventyConfig.addPassthroughCopy({[file]: filesToCopy[file]})});

  // Base Config
  return {
    dir: {
      input: "src",
      output: "public",
      includes: "includes",
      layouts: "layouts",
      data: "data",
    },
    templateFormats: ["liquid"],
    htmlTemplateEngine: "liquid",
    markdownTemplateEngine: "liquid",
  };
};
