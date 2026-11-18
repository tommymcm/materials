---
layout: layouts/page.njk
title: Recipes
eleventyExcludeFromCollections: true
---

I love cooking, but rarely do it from a recipe. Whenever I nail a difficult dish I *try* to write it down to use it later. This is most true for baking, since it is less forgiving. I have also collected some recipes from my Mom, Grandma, and Nonna to preserve and share.

{% for item in collections.recipes | reverse %}

[**{{ item.data.title }}**]({{ item.url }})

{% endfor %}
