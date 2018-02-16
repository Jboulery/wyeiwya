function GeoInit(ByCountry, CritInit, field,width){
		

		var context = field.append("svg")
				.attr("width","100%")
				.attr("height","150%")


		var criteria = CritInit;
		var countries
	    // Define svg canvas dimensions

	    // ranks is the country ordered by the criteria
		var ranks; 
	    // define projection
	    var projection = d3.geoMercator()
	        .scale(80)
	        .translate([width/3,width/6]);

	    // Create svg canvas
	    // var svg = context.append("svg")
	    // .attr("width", width)
	    // .attr("height", height);

	    // define geoPath function 
	    var path = d3.geoPath()
	        .projection(projection);

	    // define tooltip variable
	    var tooltip = field
	         .append("div")
	         .attr("class", "tooltip hidden");


	    //need this for correct panning
	    var g = context.append("g");


	    // Define color scale for countries based on criteria
	    var colorMin = d3.min(ByCountry, function(d) { return d.means[criteria]; } );
	    var colorMax = d3.max(ByCountry, function(d) { return d.means[criteria]; } );

	    var color = d3.scaleLinear()
	    .domain([colorMin, colorMax])
	    .range([d3.rgb(0,0,25),d3.rgb(0,0,240)])

	    //Get json data and draw it
	    d3.json("data/world.json", function(error, world) {
	      if(error) return console.error(error);

	    // draw countries
	      countries = g.append("g")
	          .attr("class", "boundary")
	          .selectAll("boundary")
	          .data(topojson.feature(world, world.objects.countries).features)
	          .enter()
	          .append("path");


	      countries
	          .attr("name", function(d) {return d.properties.name;})
	          .attr("id", function(d) { return d.id;})
	          .style("fill",function(geomap){
	          	var coloring;
	          	ByCountry.forEach(function(country){
	          		if (country.key == geomap.properties.name){
	          			coloring = color(country.means[criteria]);
	          		}
	          	});
	          	return coloring;
	          })
	          .on("mousemove", showTooltip)
	          .on("mouseout",  function(d,i) {
	              tooltip.classed("hidden", true);
	           })
	          .attr("d", path);
	    });


	   // Sort countries according to criteria for tooltip ranking
		ranks = ByCountry
			.sort(function(a,b){return b.means[criteria]-a.means[criteria];})
			.map(function(d){return d.key;});



		// function to display tooltip, shows value of criteria, rank (defined by the table above), and country name
	    function showTooltip(d) {
	      name = d.properties.name;
	      var value;
	      var rank = ranks.indexOf(d.properties.name);
	      var flag =0;
	      ByCountry.forEach(function(country){
      		    if (country.key == d.properties.name){
          			value = country.means[criteria].toPrecision(3);
          			flag = 1;
          		}
	      })
	      if (flag==0) {
	      	value = "No Data";
	      	rank = "No Data";
	      }
	      var mouse = d3.mouse(context.node())
	        .map( function(d) { return parseInt(d); } );
	      tooltip.classed("hidden", false)
	        .attr("style", "left:"+(mouse[0]+20)+"px;top:"+(mouse[1]+20)+"px")
	        .html("<em>" + name + "</em> </br> Value :" + value + "</br> Rank : " + rank);
	    }


	    function GeoUpdate(NewCrit){

	    	criteria = NewCrit;
	    	console.log("Update with " + criteria);

		   	// Redefine color scale for countries based on criteria
		    var colorMin = d3.min(ByCountry, function(d) { return d.means[criteria]; } );
		    var colorMax = d3.max(ByCountry, function(d) { return d.means[criteria]; } );

		    color.domain([colorMin, colorMax]);

		   	ranks = ByCountry
			.sort(function(a,b){return b.means[criteria]-a.means[criteria];})
			.map(function(d){return d.key;});

			var value;


	        d3.json("data/world.json", function(error, world) {
	        if(error) return console.error(error);

		    // draw countries
			countries
			  .transition()
			  .duration(4000)
		      .style("fill",function(geomap){
		      	var coloring;
		      	ByCountry.forEach(function(country){
			      	if (country.key == geomap.properties.name){
			      			coloring = color(country.means[criteria]);
			      		}
			      	});
			      	return coloring;
		      })
	    })
	    }
	    return {GeoUpdate : GeoUpdate}
}

