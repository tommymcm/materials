---
layout: layouts/home.njk
---

<center>
<h1>Tommy M<sup>c</sup>Michen</h1>
<img src="/assets/images/personal_photo.jpg" class="home-photo"/>
</center>

I am a Ph.D. candidate at Northwestern University with a B.S. in Computer Engineering and Computer Science from Rose-Hulman Institute of Technology. I study compilers, specifically the design of intermediate representations. My research aims to broaden the optimization space of compilers through intermediate representations that grant empowering degrees of freedom through strong guarantees. Currently, I focus on doing this for data collections (lists, sets, maps) using <span class="sc">MemOIR</span>. I am broadly interested in static analysis, runtime system co-design, programming languages, and memory models.


## Selected Publications
{% for pub in publications | sortByYear | reverse %}

{% if pub.selected %}

### <a href={{ pub.pdf }} download>{{pub.title}}</a>
{{pub.authors | formatAuthors}}

{% if pub.abstract %}{{pub.abstract}}{% endif %}

{% endif %}

{% endfor %}

