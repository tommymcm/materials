const yourName = 'Tommy McMichen';

const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");

const rss = require("@11ty/eleventy-plugin-rss");

module.exports = function(eleventyConfig) {
  // Add syntax highlighting
  eleventyConfig.addPlugin(syntaxHighlight);

  // Add RSS feed
  eleventyConfig.addPlugin(rss);
  
  // Copy static assets
  eleventyConfig.addPassthroughCopy("files");  
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy({
    "node_modules/latex.css/style.css": "assets/css/latex.css/style.css",
    "node_modules/prismjs/themes/prism.css": "assets/css/prismjs/prism.css"
    // "node_modules/prismjs/themes/prism.js": "assets/js/prismjs/prism.js"
  });
  
  // Map filter - gets array of values from array of objects
  eleventyConfig.addFilter("map", function(array, key) {
    return array.map(item => item[key]);
  });

  // Head filter - get the first n items
  eleventyConfig.addFilter("head", function(array, n) {
    if(!Array.isArray(array)) {
      return array;
    }
    if(n < 0) {
      return array.slice(n);
    }
    return array.slice(0, n);
  });

  // Flatten filter - flattens nested arrays
  eleventyConfig.addFilter("flatten", function(array) {
    return array.flat();
  });

  // Unique filter - removes duplicates
  eleventyConfig.addFilter("unique", function(array) {
    return [...new Set(array)];
  });

  // Sort filter - sorts array by property
  eleventyConfig.addFilter("sort", function(array, key) {
    return [...array].sort((a, b) => {
      if (a[key] < b[key]) return -1;
      if (a[key] > b[key]) return 1;
      return 0;
    });
  });

  // Reverse filter - reverses array
  eleventyConfig.addFilter("reverse", function(array) {
    return [...array].reverse();
  });

  // Join filter - joins array into string
  eleventyConfig.addFilter("join", function(array, separator = ",") {
    return array.join(separator);
  });

  // Split filter - splits string into array
  eleventyConfig.addFilter("split", function(string, separator = ",") {
    return string.split(separator).map(s => s.trim());
  });

  eleventyConfig.addFilter("dateFormat", function(date, format) {
    const d = new Date(date);
    
    const formats = {
      "yyyy-MM-dd": d.toISOString().split('T')[0],
      "MMMM d, yyyy": d.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };
    
    return formats[format] || d.toString();
  });

  eleventyConfig.addFilter("asDate", function(dateStr) {
    return new Date(dateStr);
  });

  eleventyConfig.addFilter("striptags", function(html) {
    return html.replace(/<[^>]*>/g, "");
  });

  eleventyConfig.addFilter("truncate", function(string, length) {
    if (string.length > length) {
      return string.substring(0, length) + "...";
    }
    return string;
  });
  
  // Published blog posts
  eleventyConfig.addCollection("publishedPosts", function(collectionApi) {
    return collectionApi.getFilteredByTag("posts")
      .filter(post => post.data.published === true)
      .reverse();
  });  
  
  // Sort publications by year
  eleventyConfig.addFilter("sortByYear", function(array) {
    return array.sort((a, b) => b.year - a.year);
  });

 // Format authors with your name in bold
  eleventyConfig.addFilter("formatAuthors", function(authors) {
    if (!authors) return "";
    
    return authors.map(author => {
      if (author === yourName) {
        return `<b>${author}</b>`;
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
