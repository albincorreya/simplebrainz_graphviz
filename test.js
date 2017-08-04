




function responseParser(json){
	var myJSON = json.results.bindings
	var myArray = [];
	for(var i=0; i<myJSON.length; i++){
		myArray[i] = myJSON[i].o.value;
		window.alert(myJSON[i].o.value);
	}
	return myArray;
}


/*
select ?s ?p ?o WHERE {
 {<http://simplebrainz.org/album/26b06d23-1910-4d71-a2a2-fdb64ab1fab6#_> ?p ?o}
UNION
 {?s ?p <http://simplebrainz.org/album/26b06d23-1910-4d71-a2a2-fdb64ab1fab6#_>}
}
*/