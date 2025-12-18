---
layout: layouts/home.njk
---

# <center>Tommy M<sup>c</sup>Michen</center>
I am a PhD candidate at Northwestern University with a B.S. in Computer Engineering and Computer Science from Rose-Hulman Institute of Technology. I study compilers, specifically looking into new intermediate representations and abstractions. My research aims to broaden the optimization space of compilers through intermediate representations that grant empowering degrees of freedom through strong guarantees. I am broadly interested in static analysis, runtime system co-design, programming languages, and memory models. 



## Selected Publications
{% for pub in publications | sortByYear | reverse %}

{% if pub.selected %}

### <a href={{ pub.pdf }} download>{{pub.title}}</a>
{{pub.authors | formatAuthors}}

{% if pub.abstract %}{{pub.abstract}}{% endif %}

{% endif %}

{% endfor %}

