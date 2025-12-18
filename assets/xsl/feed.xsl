<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <html>
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title><xsl:value-of select="/rss/channel/title"/></title>
        <style>
          :root {
            --body-font: charter, "Bitstream Charter", Georgia, serif;
            --sans-font: Optima, Candara, "Noto Sans", source-sans-pro, sans-serif;
            --mono-font: "Cascadia Code", source-code-pro, monospace;
            --text-color: #333;
            --bg-color: #fffff8;
            --accent: #333;
          }

          * {
            margin: 0;
            padding: 0;
          }

          html {
            font-size: 14px;
          }

          body {
            font-family: var(--body-font);
            color: var(--text-color);
            background-color: var(--bg-color);
            line-height: 1.8;
            max-width: 800px;
            margin: 0 auto;
            padding: 2rem;
          }

          h1, h2, h3 {
            font-weight: normal;
            font-family: var(--sans-font);
            margin-top: 1.5rem;
            margin-bottom: 1rem;
          }

          h1 {
            font-size: 2rem;
            border-bottom: 1px solid var(--accent);
            padding-bottom: 1rem;
            margin-bottom: 2rem;
          }

          h2 {
            font-size: 1.5rem;
            margin-top: 0;
          }

          p {
            margin-bottom: 1rem;
          }

          a {
            color: red;
            text-decoration: none;
          }

          a:hover {
            text-decoration: underline;
          }

          .item {
            margin-bottom: 3rem;
            padding-bottom: 2rem;
            border-bottom: 1px solid #ddd;
          }

          .item:last-child {
            border-bottom: none;
          }

          .item-meta {
            color: #888;
            font-family: var(--sans-font);
            font-size: 0.9rem;
            margin-bottom: 0.5rem;
          }

          .item-description {
            line-height: 1.8;
          }
        </style>
      </head>
      <body>
        <h1><xsl:value-of select="/rss/channel/title"/></h1>
        <p><xsl:value-of select="/rss/channel/description"/></p>
        
        <xsl:for-each select="/rss/channel/item">
          <div class="item">
            <h2><xsl:value-of select="title"/></h2>
            <div class="item-meta">
              <xsl:value-of select="pubDate"/>
            </div>
            <div class="item-description">
              <xsl:value-of select="description" disable-output-escaping="yes"/>
            </div>
            <p>
              <a href="{link}">Read more →</a>
            </p>
          </div>
        </xsl:for-each>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
