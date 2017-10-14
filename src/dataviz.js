/* TODO : Since d3sparql library is not sufficient for our needs, we have to write custom
			json response parsors' for meaningfully visualize linked-data using d3.js

*/

// some utility functions
parseQuery = function(entity,mbid){
	var eQuery = 'SELECT ?s ?p ?o WHERE {{<http://musicbrainz.org/'+entity+'/'+mbid+"> ?p ?o} UNION {?s <http://musicbrainz.org/"+entity+'/'+mbid+'> ?o} UNION {?s ?p <http://musicbrainz.org/'+entity+'/'+mbid+'>}}';
	return eQuery;
}

parseInnerQuery = function(entity,mbid){
	var iQuery = 'select ?s ?p ?o WHERE {{<http://simplebrainz.org/'+ entity + '/' + mbid + '#_> ?p ?o} UNION {?s ?p <http://simplebrainz.org/' + entity + '/' + mbid + '#_>}}';
	return iQuery;
}

urlParse = function(str){
	return /[^/]*$/.exec(str)[0];
}

entityParse = function(str){
	return str.split('/')[3];
}

formatUri = function(){
	//var mbid = d3.select("#mbid").property("value");
	var mbid = "83d91898-7763-47d7-b03b-b92132375c47";
	//var entity = d3.select("#entity").property("value");
	var entity = "artist";
	return "http://musicbrainz.org/"+entity+"/"+mbid
}


function delete_null_properties(test, recurse) {
    for (var i in test) {
        if (test[i] === null) {
            delete test[i];
        } else if (recurse && typeof test[i] === 'object') {
            delete_null_properties(test[i], recurse);
        }
    }
}

function parseSearch(){
	var format = "application/sparql-results+json";
	var mbid = d3.select("#mbid").property("value");
	var entity = d3.select("#entity").property("value");
	var query = parseQuery(entity,mbid);
	var url = endpoint + "?query=" + encodeURIComponent(query);
	d3.xhr(url, format, function(request) {
		outputJSON = JSON.parse(request.responseText);
		sampleGraph();
		window.alert("Successful request!");
	})
	return outputJSON;
}

var response = [];
function getEntityName(entity,mbid){
	var format = "application/sparql-results+json";
	if(entity=='release-group'){entity="album"}
	var query = parseInnerQuery(entity,mbid);
	var url = endpoint + "?query=" + encodeURIComponent(query);
	d3.xhr(url, format, function(request) {
		response = JSON.parse(request.responseText);
	});
	var out = response.results;
	return out;
}

function outputParser(json){
	var graph = {"nodes":[],"links":[]}; //
	var myJSON = json.results.bindings;

	//var queryMbid = d3.select("#mbid").property("value");
	//var queryMbid = document.getElementById('mbid').value;
	var queryMbid = "83d91898-7763-47d7-b03b-b92132375c47";
	var queriedNode = {"mbid":queryMbid,"uri":formatUri(),"type":entityParse(formatUri()),"name":"Pink Floyd"}
	graph.nodes.push(queriedNode);

	var j = 1;
	for(var i=3; i<myJSON.length; i++){
		var nodeDict = {};
		var linkDict = {};
		if(Object.keys(myJSON[i]).includes("s")){
			nodeDict.mbid = urlParse(myJSON[i].s.value);
			nodeDict.uri = myJSON[i].s.value;
			nodeDict.type = entityParse(myJSON[i].s.value);
			nodeDict.name = "name"
			linkDict.type = urlParse(myJSON[i].p.value);
			linkDict.source = j;
			linkDict.target = 0;
			linkDict.value = 0;
			graph.nodes.push(nodeDict);
			graph.links.push(linkDict);
		}else if (Object.keys(myJSON[i]).includes("o")){
			nodeDict.mbid = urlParse(myJSON[i].o.value);
			nodeDict.uri = myJSON[i].o.value;
			nodeDict.type = entityParse(myJSON[i].o.value);
			nodeDict.name = "name";
			linkDict.type = urlParse(myJSON[i].p.value);
			linkDict.source = 0;
			linkDict.target = j;
			linkDict.value = 1;
			graph.nodes.push(nodeDict);
			graph.links.push(linkDict);
		}
		j++;
	}
	delete_null_properties(graph, recurse=true);
	return graph;
}

var graph = outputParser(parseJsonTest);

myForceGraph = function (graph,config) {

	var nodes = graph.nodes;
	var links = graph.links;
	var m = 4;

	var svg = d3.select(config.selector)
	.append("div")
	.classed("svg-container",true)
	.append("svg")
	.attr("width",config.width)
	.attr("height",config.height);

	function update(nodes,links){

		//var color = d3.scale.category10().domain(d3.range(m));
		var color = d3.scale.category20();

		var node = svg.selectAll(".node")
		.data(nodes)
		.enter()
		.append("g");

		var circle = node.append("circle")
		.attr("class","node")
		.attr("r",config.radius);

		var link = svg.selectAll(".link")
		.data(links).enter().append("line")
		.attr("class", "link");
		//.attr("marker-end", "url(#end)");

		// add arrow links
		svg.append("svg:defs").selectAll("marker")
    				.data(["end"])
  					.enter().append("svg:marker")
    				.attr("id", String)
    				.attr("viewBox", "0 -5 10 10")
    				.attr("refX", 30)
    				.attr("refY", -0)
    				.attr("markerWidth", 4)
    				.attr("markerHeight", 4)
    				.attr("orient", "auto")
  					.append("svg:path")
    				.attr("d", "M0,-5L10,0L0,5");

		var text = node.append("text")
	    .text(function(d) { return d[config.label] })
	    .attr("class", "node")

		force = d3.layout.force()
			.size([config.width,config.height])
			.nodes(nodes)
			.links(links)
			.linkDistance(config.distance)
			.charge(config.charge)
			.gravity(config.gravity)
			.friction(config.friction)
			.start();

			force.on("tick", function() {
		    link.attr("x1", function(d) { return d.source.x })
		        .attr("y1", function(d) { return d.source.y })
		        .attr("x2", function(d) { return d.target.x })
		        .attr("y2", function(d) { return d.target.y });
		    text.attr("x", function(d) { return d.x })
		        .attr("y", function(d) { return d.y });
		    circle.attr("cx", function(d) { return d.x })
		          .attr("cy", function(d) { return d.y });
		  });

			node.style("fill", function(d) { return color(d.type); });
			node.call(force.drag);

			document.addEventListener( 'keydown', function( event ) {
  			var caps = event.getModifierState && event.getModifierState( 'CapsLock' );
  			console.log( caps );
				if(caps){svg.call(d3.behavior.zoom().on("zoom", rescale));}
				else{svg.call(d3.behaviour.zoom.off())};// true when you press the keyboard CapsLock key
			});

			function rescale() {
        var trans = d3.event.translate;
        var scale = d3.event.scale;

        svg.attr("transform",
            "translate(" + trans + ")"
                + " scale(" + scale + ")");
    		}

				// add custom CSS here
				/*
				text.attr().shadow({
  				"stroke": "#fff",
  				"stroke-width": "4px",
				})

				link.attr().shadow({
  				"stroke": "#fff",
  				"stroke-width": "4px",
				})


			link.attr({
			  "stroke": "black",
			})
			circle.attr({
			  "stroke": "black",
			  "stroke-width": "1px",
			  "fill": "lightblue",
			  "opacity": 1,
			})

			text.attr({
				"stroke":"black",
			  "font-size": "8px",
			  "font-family": "sans-serif",
			})*/
		}
	return update(nodes,links);
}


/*
var graph = outputParser(parseJsonTest);
var nodes = graph.nodes;
var links = graph.links;

var svg = d3.select("body")
.append("svg")
.attr("width",config.width)
.attr("height",config.width);

var force = d3.layout.force()
.size([config.width, config.height])
.nodes(nodes)
.links(links)
.on('tick', tick)
.linkDistance(100)
.gravity(.15)
.friction(.8)
.linkStrength(1)
.charge(-425)
.chargeDistance(600)
.start();

var link = svg.selectAll('.link')
.data(links)
.enter().append('line')
.attr('class', 'link');

var node = svg.selectAll('.node')
	.data(force.nodes())
	.enter().append('circle')
	.attr('class', 'node')
	.attr('r', config.width * 0.01)

function tick(e) {

	node.attr('cx', function(d) { return d.x; })
			.attr('cy', function(d) { return d.y; })
			.call(force.drag);

	link.attr('x1', function(d) { return d.source.x; })
			.attr('y1', function(d) { return d.source.y; })
			.attr('x2', function(d) { return d.target.x; })
			.attr('y2', function(d) { return d.target.y; });
};

/*

//select ?s ?p ?o WHERE {{<http://musicbrainz.org/release-group/c833f060-25a2-4fa8-9ae8-9f927e6142ed> ?p ?o} UNION {?s <http://musicbrainz.org/release-group/c833f060-25a2-4fa8-9ae8-9f927e6142ed> ?o} UNION {?s ?p <http://musicbrainz.org/release-group/c833f060-25a2-4fa8-9ae8-9f927e6142ed>}}

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
