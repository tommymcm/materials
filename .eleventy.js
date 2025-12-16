const yourName = 'Tommy McMichen';

const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

module.exports = function(eleventyConfig) {
  // Copy static assets
  eleventyConfig.addPassthroughCopy("files");  
  eleventyConfig.addPassthroughCopy("assets");

  // Add syntax highlighting
  eleventyConfig.addPlugin(syntaxHighlight);
  
  // Blog collection
  // eleventyConfig.addCollection("blog", function(collectionApi) {
  //   return collectionApi.getFilteredByGlob("blog/*.md").reverse();
  // });
  
  // Sort publications by year
  eleventyConfig.addFilter("sortByYear", function(array) {
    return array.sort((a, b) => b.year - a.year);
  });

 // Format authors with your name in bold
  eleventyConfig.addFilter("formatAuthors", function(authors) {
    if (!authors) return "";
    
    return authors.map(author => {
      if (author === yourName) {
        return `**${author}**`;
      }
      return author;
    }).join(", ");
  });
  
  return {
    dir: {
      input: ".",
      output: "_site",
      includes: "_includes",
      data: "_data"
    }
  };
};
