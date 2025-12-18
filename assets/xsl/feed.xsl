<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <html>
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title><xsl:value-of select="/rss/channel/title"/></title>

        <link rel="stylesheet" href="https://latex.vercel.app/style.css" />
        <link rel="stylesheet" type="text/css" href="/assets/css/custom.css"/>
      </head>
      <body>
        <h1><xsl:value-of select="/rss/channel/title"/></h1>
        
        <xsl:for-each select="/rss/channel/item">
          <div class="post-item">
            <a href="{link}" class="post-title"><xsl:value-of select="title"/></a>
            <span class="post-date">
              <xsl:value-of select="pubDate"/>
            </span>
          </div>
        </xsl:for-each>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
