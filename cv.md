---
layout: layouts/page.njk
---
# <center>Tommy McMichen</center>

I am a PhD candidate at Northwestern University with a B.S. in Computer Engineering and Computer Science from Rose-Hulman Institute of Technology. I study compilers, specifically looking into new intermediate representations and abstractions. My research aims to broaden the optimization space of compilers through intermediate representations that grant empowering degrees of freedom through strong guarantees. I am broadly interested in static analysis, runtime system co-design, programming languages, and memory models. 


```cpp
class Test {
  void foo();
};
```


```python
def hello():
    print("Hello, world!")
```

## Education
{% for edu in education %}

#### **{{edu.institution}}**, *{{edu.location}}*.

{% for degree in edu.degrees %}

{{degree.degree}} in {{degree.major}}{% if degree.advisor %}, *Advised by {{degree.advisor}}*{% endif %}. {{degree.date}}.

{% endfor %}

{% endfor %}


## Publications
{% for pub in publications | sortByYear | reverse %}
### {{pub.title}}
{{pub.authors | formatAuthors}}

*{{pub.venue-abbr}}*, {{pub.year}}.

{% if pub.pdf %}<a href="{{ pub.pdf }}" download>[PDF]</a>{% endif %}
{% if pub.doi %}[[DOI]](https://doi.org/{{pub.doi}}){% endif %}
{% if pub.artifact %}[[Artifact]](https://doi.org/{{pub.artifact}}){% endif %}
{% endfor %}

## Talks
{% for talk in talks | sortByYear | reverse %}
### {{talk.title}}

{% if talk.pdf %}<a href="{{ talk.pdf }}" download>[PDF]</a>{% endif %}

{% for venue in talk.venues | sortByYear | reverse %}
*{{venue.venue}}*, {{venue.date}}.
{% endfor %}

{% endfor %}



## Posters
{% for poster in posters | sortByYear | reverse %}
### {{poster.title}}

{% if poster.pdf %}<a href="{{ poster.pdf }}" download>[PDF]</a>{% endif %}

{% for venue in poster.venues | sortByYear | reverse %}
*{{venue.venue}}*, {{venue.date}}.
{% endfor %}

{% endfor %}



## Service
{% for serve in service %}

**{{serve.role}}**, *{{serve.org}}*. {{serve.date}}{% if serve.end %}—{{serve.end}}{% endif %}.



{% endfor %}