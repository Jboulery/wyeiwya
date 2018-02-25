function GeoInit(ByCountry,field,width){
		
		var w = 960;
		var h = 500;

		var height = width * h/w;
		var context = field.append("svg")
				.attr("width",width)
				.attr("height",height)


		var countries;
	    // Define svg canvas dimensions

	    // ranks is the country ordered by the criteria
		var ranks; 
	    // define projection
	    var projection = d3.geoMercator()
	        .scale(150)
	        .translate([width/2,height/1.5]);

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
	    var colorMin = d3.min(ByCountry, function(d) { return d.criteria; } );
	    var colorMax = d3.max(ByCountry, function(d) { return d.criteria; } );
	    var pas = (colorMax-colorMin)/9

	    var color = d3.scaleThreshold()
	    .domain([colorMin,colorMin+pas*1.5,colorMin+pas*2,colorMin+pas*3,colorMin+pas*4,colorMin+pas*4.5,colorMin+pas*5,colorMin+pas*5.5,colorMin+pas*9])
	    .range(['#fff7fb','#ece7f2','#d0d1e6','#a6bddb','#74a9cf','#3690c0','#0570b0','#045a8d','#023858'])

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
	          	var coloring = '#fff7fb';
	          		ByCountry.forEach(function(country){
	          		if (country.key == geomap.properties.name){
	          			coloring = color(country.criteria);
	          		}
	          	});
	          	return coloring;
	          })
	          .on("mouseenter", showTooltip)
	          .on("mouseout",  function(d,i) {
	              tooltip.classed("hidden", true);
	           })
	          .attr("d", path);
	    });

	   // Sort countries according to criteria for tooltip ranking
		ranks = ByCountry
			.sort(function(a,b){return b.criteria-a.criteria;})
			.map(function(d){return d.key;});



		// function to display tooltip, shows value of criteria, rank (defined by the table above), and country name
	    function showTooltip(d) {
	      name = d.properties.name;
	      var value;
	      var rank = ranks.indexOf(d.properties.name);
	      var flag =0;
	      ByCountry.forEach(function(country){
      		    if (country.key == d.properties.name){
          			value = country.criteria.toPrecision(3);
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
	        .attr("style", "left:"+(mouse[0])+"px;top:"+(mouse[1]+400)+"px")
	        .html("<em>" + name + "</em> </br> Value : " + value + "</br> Rank : " + (rank+1));
	    }


	    function GeoUpdate(ByCountry){


		   	// Redefine color scale for countries based on criteria
		    var colorMin = d3.min(ByCountry,function(d) { return d.criteria; } );
		    var colorMax = d3.max(ByCountry, function(d) { return d.criteria; } );
	    	var pas = (colorMax-colorMin)/9

	    	color.domain([colorMin,colorMin+pas*1.5,colorMin+pas*2,colorMin+pas*3,colorMin+pas*4,colorMin+pas*4.5,colorMin+pas*5,colorMin+pas*5.5,colorMin+pas*9])

		   	ranks = ByCountry
			.sort(function(a,b){return b.criteria-a.criteria;})
			.map(function(d){return d.key;});

			var value;
			console.log("Updated Map");

	        d3.json("data/world.json", function(error, world) {
	        if(error) return console.error(error);

		    // draw countries
			countries
			  .transition()
			  .duration(2000)
		      .style("fill",function(geomap){
		      	var coloring='#fff7fb';
		      	ByCountry.forEach(function(country){
			      	if (country.key == geomap.properties.name){
			      			coloring = color(country.criteria);
			      		}
			      	});
			      	return coloring;
		      })
	    })
	    }
	    return {GeoUpdate : GeoUpdate}
}

