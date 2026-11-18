---
layout: layouts/page.njk
title: Games
eleventyExcludeFromCollections: true
---

<center>♥️ ♠️ ♦️ ♣️</center>
<br>

I like playing solitaire card games. I am slowly building online versions of each one so that I can play when I don't have a deck of cards on hand. All of these games are [open-source](https://github.com/tommymcm/solitaire).

***

{% for game in collections.games %}

## [{{ game.data.title }}](game.url)

{{ game.data.desc }}

***

{% endfor %}
