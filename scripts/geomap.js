function GeoInit(ByCountry,field,width,spiderChart){
		
		// necessary to get he right proportions
		var w = 960;
		var h = 500;

		var height = width * h/w;
		var context = field.append("svg")
				.attr("width", field.node().getBoundingClientRect().width)
				.attr("height",field.node().getBoundingClientRect().height)
				.attr("class","map-context")


		var countries;
	    // Define svg canvas dimensions

	    // ranks is the country ordered by the criteria
		var ranks;
		var projection;
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


	    var zoom = d3.zoom()
		.on("zoom",function(){
			g.attr("transform",d3.event.transform);
		})

		context.call(zoom);

	    var color = d3.scaleThreshold()
	    .domain([colorMin,colorMin+pas*1.5,colorMin+pas*2,colorMin+pas*3,colorMin+pas*4,colorMin+pas*4.5,colorMin+pas*5,colorMin+pas*5.5,colorMin+pas*9])
	    .range(['#fff7fb','#ece7f2','#d0d1e6','#a6bddb','#74a9cf','#3690c0','#0570b0','#045a8d','#023858'])

	    //Get json data and draw it
	    d3.json("data/world.json", function(error, world) {
	      if(error) return console.error(error);


	    var worlddata = topojson.feature(world, world.objects.countries);
	    // draw countries
	      countries = g.append("g")
	          .attr("class", "boundary")
	          .selectAll("boundary")
	          .data(worlddata.features)
	          .enter()
	          .append("path");


	    // define projection
	    projection = d3.geoMercator()
	    .scale(1)
	    .fitSize([context.node().getBoundingClientRect().width,context.node().getBoundingClientRect().height],worlddata)

	    /*
	        .scale(150)
	        .translate([width/2,height/1.5]);*/

	    // define geoPath function 
	    	var path = d3.geoPath()
	        .projection(projection);


	      countries
	          .attr("name", function(d) {return d.properties.name;})
	          .attr("id", function(d) { return d.id;})
	          .style("fill",function(geomap){
	          	var coloring = '#fff7fb';
	          		ByCountry.forEach(function(country){	
						if (country.key == geomap.properties.name){
							// Test if hovereded
							if (country.hovered == 1){coloring = "brown";}
							// Else : use criteria
							else{coloring = color(country.criteria);}
						}
					});
	          	return coloring;
	          })
	          .on("mouseover",function(d,i) {
					console.log(d)
					var CurrentCountry = this;
					d3.select(this).style("fill","brown");
					// Update ByCountry
					ByCountry.forEach(function(country,j){
						if(d.properties.name == country.key){
							country.hovered = !country.hovered;
							}							
					});
					console.log(ByCountry);
					
					showTooltip(d);
			  })
	          //.on("mouseenter", )
	          .on("mouseout",  function(d,i) {
	          		var CurrentCountry = this;
					d3.select(CurrentCountry)
					.style("fill",function(geomap){
						var coloring = '#fff7fb';
	          			ByCountry.forEach(function(country){
	          			if (country.key == geomap.properties.name){
	          				if (country.selected == false) {coloring = color(country.criteria);}
							else {coloring = "green"};
							country.hovered = false;
						}
						});
	              	tooltip.classed("hidden", true);
	                return coloring;
	           		})
				})
	          .on("click",function(d,i){
	          		var CurrentCountry = this;
	          		var countryname;
					d3.select(CurrentCountry)
					.style("fill",function(geomap){
						var coloring = '#fff7fb';
	          			ByCountry.forEach(function(country){
	          			if (country.key == geomap.properties.name){
	          				countryname = '#' + geomap.properties.name.replace(" ","-").replace(" ","-");
	          				if (country.selected == false) {
	          					country.selected = !country.selected;
								country.hovered=true;
	          					coloring = "green";
	          				}
							else {
								coloring = color(country.criteria);
								country.selected = !country.selected;
							};
						}
					});
	          		return coloring
	          })
			     	spiderChart.spiderUpdate();
					var scatterplotSVG = document.getElementById('ScatterplotSVG');
					scatterplotSVG.remove();
					scatterplotInit(ByCountry, '#ScatterplotDiv');
					console.log(countryname);
					var updatedbar = d3.select(countryname);
					updatedbar.style("fill",function(country){
						var barcolor = '#fff7fb';
						if (country.selected == false){barcolor = color(country.criteria)}
						else {barcolor = "green"}
						return barcolor ;});
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
	      rank = rank + 1;
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
	        .attr("style", "left:"+(mouse[0]+100)+"px;top:"+(mouse[1]+400)+"px")
	        .html("<em>" + name + "</em> </br> Value : " + value + "</br> Rank : " + (rank));
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

	        d3.json("data/world.json", function(error, world) {
	        if(error) return console.error(error);

		    // draw countries
			countries
			  .style("fill",function(geomap){
					var coloring = '#fff7fb';
	      			ByCountry.forEach(function(country){
						if (country.key == geomap.properties.name){
							if (country.selected == false) {coloring = color(country.criteria);}
							else {coloring = "green"}
							if (country.hovered == 1){coloring = "brown";}
						};
					})
					tooltip.classed("hidden", true);
					return coloring;
				})
;
			})
		}


	    return {GeoUpdate : GeoUpdate}
}

