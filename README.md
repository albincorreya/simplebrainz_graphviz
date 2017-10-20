# smb_browser_front-end





## Layout response examples

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
		{"source":0,"target":1,"value":1},
		{"source":1,"target":3,"value":0}
	] 
}
```
