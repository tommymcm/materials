const yourName = 'Tommy McMichen';

const syntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const rss = require("@11ty/eleventy-plugin-rss");
const nunjucks = require("nunjucks");
const { execSync } = require('child_process');

module.exports = function(eleventyConfig) {
  // Add syntax highlighting
  eleventyConfig.addPlugin(syntaxHighlight);

  // Add RSS feed
  eleventyConfig.addPlugin(rss);
  
  // Copy static assets
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("favicon.svg");
  eleventyConfig.addPassthroughCopy("files");  
  eleventyConfig.addPassthroughCopy("assets");
  eleventyConfig.addPassthroughCopy({
    // LaTeX.css
    "node_modules/@picocss/pico/css/pico.css": "assets/css/pico.css/style.css",
    // PrismJS
    "node_modules/prismjs/themes/prism.css": "assets/css/prismjs/prism.css",
    // "node_modules/prismjs/themes/prism.js": "assets/js/prismjs/prism.js"
  });

  // Merge tags.
  eleventyConfig.setDataDeepMerge(true);

  // Recipe fractions: rewrite plain-text fractions like "1/2" (and
  // mixed numbers like "1 1/2") into Unicode fraction characters ("½",
  // "1½") in the rendered recipe pages, so the Markdown can stay plain
  // ASCII. Only text between tags is touched (never attributes/URLs),
  // and <pre>, <code>, <script> and <style> contents are skipped.
  const VULGAR_FRACTIONS = {
    "1/2": "½", "1/3": "⅓", "2/3": "⅔", "1/4": "¼", "3/4": "¾",
    "1/5": "⅕", "2/5": "⅖", "3/5": "⅗", "4/5": "⅘", "1/6": "⅙",
    "5/6": "⅚", "1/7": "⅐", "1/8": "⅛", "3/8": "⅜", "5/8": "⅝",
    "7/8": "⅞", "1/9": "⅑", "1/10": "⅒",
  };
  const SUPERSCRIPT = "⁰¹²³⁴⁵⁶⁷⁸⁹";
  const SUBSCRIPT = "₀₁₂₃₄₅₆₇₈₉";
  const toFraction = (num, den) =>
    VULGAR_FRACTIONS[`${num}/${den}`] ??
    [...num].map(d => SUPERSCRIPT[d]).join("") + "⁄" +
    [...den].map(d => SUBSCRIPT[d]).join("");
  // Optional whole number, then num/den; not part of a date or path.
  const FRACTION_RE = /(?<![\d\/])(?:(\d+) )?(\d+)\/(\d+)(?![\d\/])/g;

  eleventyConfig.addTransform("recipe-fractions", function(content) {
    const { inputPath, outputPath } = this.page;
    if (!outputPath?.endsWith(".html") || !inputPath.includes("/misc/recipes/")) {
      return content;
    }
    let skipDepth = 0;
    return content
      .split(/(<[^>]*>)/)
      .map(part => {
        const tag = part.match(/^<(\/?)(pre|code|script|style)\b/i);
        if (tag) {
          skipDepth += tag[1] ? -1 : 1;
          return part;
        }
        if (part.startsWith("<") || skipDepth > 0) {
          return part;
        }
        return part.replace(FRACTION_RE, (match, whole, num, den) =>
          den === "0" ? match : (whole ?? "") + toFraction(num, den));
      })
      .join("");
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
    if (!array || !Array.isArray(array)) return [];
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
        day: 'numeric',
        timeZone: 'UTC'
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

  // Projects
  eleventyConfig.addCollection("projects", (api) => {
  return api.getFilteredByGlob("projects/*/index.njk");
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
  
  // Add filters to the tex environment
  eleventyConfig.addFilter("texEscape", function(text) {
    if (!text) return "";
    text = String(text);
    return text
      .replace(/\\/g, '\\textbackslash{}')
      .replace(/[&%$#_{}]/g, '\\$&')
      .replace(/~/g, '\\textasciitilde{}')
      .replace(/\^/g, '\\textasciicircum{}');
  });

  // Format authors with your name in bold
  eleventyConfig.addFilter("texFormatAuthors", function(authors) {
    if (!authors) return "";
    
    return authors.map(author => {
      if (author === yourName) {
        return `\\textbf{${author}}`;
      }
      return author;
    }).join(", ");
  });
  
  // Typst equivalents. Escapes markup-significant characters, and turns the
  // one LaTeX \textsc{...} left in the data into Typst small caps.
  const typstEscape = (text) => {
    if (!text) return "";
    const escaped = String(text).replace(/[\\#$*_`@<>\[\]~\/]/g, '\\$&');
    return escaped.replace(/\\\\textsc\{([^}]*)\}/g, '#smallcaps[$1]');
  };
  eleventyConfig.addFilter("typstEscape", typstEscape);

  eleventyConfig.addFilter("typstFormatAuthors", function(authors) {
    if (!authors) return "";

    return authors.map(author => {
      if (author === yourName) {
        return `*${typstEscape(author)}*`;
      }
      return typstEscape(author);
    }).join(", ");
  });

  eleventyConfig.addFilter("toWWW", function(url) {
    if (!url) return "";
    return url.replace("https://", "www.").replace("http://", "www.");
  });

  // Sidenotes
  const sidenoteCounters = new Map();
  eleventyConfig.on('eleventy.before', () => {
  sidenoteCounters.clear();
});
  eleventyConfig.addPairedShortcode("sidenote", (content) => {
    const key = this.page?.url ?? "default";
    const n = (sidenoteCounters.get(key) ?? 0) + 1;
    sidenoteCounters.set(key, n);
    return `<span class="sidenote-wrapper"><sup>${n}</sup><span class="sidenote"><sup>${n}</sup> ${content}</span></span>`;
});

  // After build: compile the Typst CV to PDF
  eleventyConfig.on('eleventy.after', async () => {
    try {
      console.log('Compiling CV to PDF...');

      // --root _site lets the template reference /assets/images/...
      execSync('typst compile --root _site _site/cv/cv.typ _site/cv/cv.pdf', {
        stdio: 'inherit'
      });

      console.log('CV compiled successfully!');
    } catch (error) {
      console.error('Typst compilation failed:', error.message);
      // Don't throw - let the build continue
    }
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
