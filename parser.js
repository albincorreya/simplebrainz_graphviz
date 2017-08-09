

/* TODO : Since d3sparql library is not sufficient for our needs, we have to write custom
			json response parsors' for meaningfully visualize linked-data using d3.js

*/


function responseParser(json){
	var myJSON = json.results.bindings
	var nodes = [];
	var edges = [];
	for(var i=0; i<myJSON.length; i++){
		if(myJSON[i].s.value){nodes[i] = myJSON[i].s.value;}
		if(myJSON.[i].o.value){edges[i] = myJSON[i].o.value;}
		//window.alert(myJSON[i].o.value);
	}
	return nodes,edges;
}












/*

Some sparql queries for future reference


select ?s ?p ?o WHERE {{?s <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> ?o} UNION {<http://simplebrainz.org/artist/a2933a40-a8dc-4a3a-aa15-820b504350ac#_> ?p ?o} UNION {?s ?p <http://purl.org/ontology/mo/MusicArtist>}}

select ?s ?p ?o WHERE {{<http://musicbrainz.org/release-group/c833f060-25a2-4fa8-9ae8-9f927e6142ed> ?p ?o} UNION {?s <http://musicbrainz.org/release-group/c833f060-25a2-4fa8-9ae8-9f927e6142ed> ?o} UNION {?s ?p <http://musicbrainz.org/release-group/c833f060-25a2-4fa8-9ae8-9f927e6142ed>}}

select ?s ?p ?o WHERE {
 {<http://simplebrainz.org/album/26b06d23-1910-4d71-a2a2-fdb64ab1fab6#_> ?p ?o}
UNION
 {?s ?p <http://simplebrainz.org/album/26b06d23-1910-4d71-a2a2-fdb64ab1fab6#_>}
}
*/
