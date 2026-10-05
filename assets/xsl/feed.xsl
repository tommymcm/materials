<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title><xsl:value-of select="/rss/channel/title"/></title>

        <link rel="stylesheet" href="/assets/css/pico.css/style.css"/>
        <link rel="stylesheet" href="/assets/css/style.css"/>
      </head>
      <body>
        <main>
          <article>
            <center>
              <h1><xsl:value-of select="/rss/channel/title"/></h1>
            </center>

            <div class="posts-list">
              <xsl:for-each select="/rss/channel/item">
                <div class="post-item">
                  <span class="post-title">
                    <a href="{link}" class="post-title">
                      <b><xsl:value-of select="title"/></b>
                    </a>
                  </span>
                  <span class="post-date">
                    <small><xsl:value-of select="pubDate"/></small>
                  </span>
                </div>
                <xsl:if test="position() != last()"><hr/></xsl:if>
              </xsl:for-each>
            </div>
          </article>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
