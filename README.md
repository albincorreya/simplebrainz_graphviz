# simplebrainz_demo_front-end-viz 

(under development)

[Simplebrainz](https://github.com/andrebola/simplebrainz) is a music knowledge base created from [musicbrainz](https://musicbrainz.org/). This is a demo project of visualizing sparql query response from the simplebrainz REST service.

## Visualization examples


D3-forcegraph viz for the artist [NIck Murphy](https://musicbrainz.org/artist/0fb267e2-7175-4537-a9f2-e835ecc81ff7)

![alt text](https://user-images.githubusercontent.com/14850001/31806625-6a4bcb4e-b569-11e7-92d3-c86144aca561.png)

D3-forcegraph viz for the release-group [Division Bell](https://beta.musicbrainz.org/release-group/90878b63-f639-3c8b-aefb-190bdf3d1790) by Pink Floyd

![alt text](https://user-images.githubusercontent.com/14850001/31863215-001b5260-b74b-11e7-95ea-ed7aca80dd17.png)

## Response-layout examples

 Virtuoso service response format "application/sparql-results+json"


``` json
{ "head": { "link": [], "vars": [] },
  "results": { "distinct": false, "ordered": true, "bindings": 
		[
	    	{ "s": { "type": "typed-literal", "datatype": "", "value": "" }},
			{ "p": { "type": "typed-literal", "datatype": "", "value": "" }},
			{ "o": { "type": "typed-literal", "datatype": "", "value": "" }}
		] 
	} 
}

```

d3 forcegraph format

``` json
{
	"nodes":[
		{"mbid": "0fb267e2-7175-4537-a9f2-e835ecc81ff7", "uri": "http://musicbrainz.org/artist/0fb267e2-7175-4537-a9f2-e835ecc81ff7", "type": "artist", "name": "Nick Murphy"},
		{"mbid": "13", "uri": "http://musicbrainz.org/area/13", "type": "area", "name": "Australia"}
	], 
	"links":[
		{"source":0,"target":1,"value":1,"type":"based_near"},
		{"source":1,"target":2,"value":0,"type":"_members"}
	] 
}
```
