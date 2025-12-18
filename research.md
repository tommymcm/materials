---
layout: layouts/base.njk
title: Research
---
# Publications

{% for pub in publications | sortByYear | reverse %}

<font size=4em><b>{{pub.title}}</b></font>

<div class="badge-container">
<a href="{{pub.venue-link}}"><i>{{pub.venue-abbr}} {{pub.year}}</i></a>
{% if pub.pdf %} | <a href="{{ pub.pdf }}" download>PDF</a>{% endif %}
{% if pub.doi %} | <a href="https://doi.org/{{pub.doi}}">DOI</a>{% endif %}
{% if pub.artifact %} | <a href="https://doi.org/{{pub.artifact}}">Artifact</a>{% endif %}
{%- if pub.badges -%}
|
{%- for badge in pub.badges -%}
<img src="/assets/images/{{ badge }}.svg" alt="{{ badge }}" class="badge">
{%-endfor -%}
{%- endif -%}
</div>
{{pub.authors | formatAuthors}}.
<br>


{% endfor %}
