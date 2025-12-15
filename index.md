# Tommy McMichen

**Abstract**

I am a PhD candidate at Northwestern University with a B.S. in Computer Engineering and Computer Science from Rose-Hulman Institute of Technology. I study compilers, specifically looking into new intermediate representations and abstractions. My research aims to broaden the optimization space of compilers through intermediate representations that grant empowering degrees of freedom through strong guarantees. I am broadly interested in static analysis, runtime system co-design, programming languages, and memory models. 

## Publications
{% for pub in publications | sortByYear | reverse %}
### {{pub.title}}
{{pub.authors | formatAuthors}}

*{{pub.venue}} ({{pub.venue-abbr}})*, {{pub.year}}.

{% if pub.pdf %}<a href="{{ pub.pdf }}" download>[PDF]</a>{% endif %}
{% if pub.doi %}[[DOI]](https://doi.org/{{pub.doi}}){% endif %}
{% if pub.artifact %}[[Artifact]](https://doi.org/{{pub.artifact}}){% endif %}
{% endfor %}