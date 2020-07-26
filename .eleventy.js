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

  // Base Config
  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "includes",
      layouts: "layouts",
      data: "data",
    },
    templateFormats: ["liquid"],
    htmlTemplateEngine: "liquid",
    markdownTemplateEngine: "liquid",
  };
};
