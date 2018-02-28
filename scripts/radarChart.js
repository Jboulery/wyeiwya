// Reference :
// - http://bl.ocks.org/nbremer/6506614

function radarChart(){
	
	// Default parameters
	var cfg = {
			radius: 5,
			w: 600,
			h: 600,
			factor: 1,
			factorLegend: .85,
			levels: 3,
			maxValue: 0,
			radians: 2 * Math.PI,
			opacityArea: 0.5,
			ToRight: 5,
			TranslateX: 80,
			TranslateY: 30,
			ExtraWidthX: 100,
			ExtraWidthY: 100,
			color: d3.scaleOrdinal(d3.schemeCategory10)
		};
		
	//Define "global" variables
	var g;
	var axis;
	var allAxis;
	var total;
	var radius;
	var Format;
	var colorscale = d3.scaleOrdinal(d3.schemeCategory10);
	
	// Labels
	var labels = ["Fat", "Saturated Fats", "Cholesterol", "Carbohydrates", "Fibers", "Sugars", "Proteins",
				"Salt", "Sodium", "Vitamin A", "Vitamin C", "Calcium", "Iron", "Energy"];
	var max = [34.072500000000005, 11.5275, 0.019411164821286984, 69.3, 4.1, 41.64, 13.242, 6.2700000000000005, 2.468503937007872, 0.005416666666666667, 0.026729411764705883, 0.1888, 0.00364, 3069.7153846153847]; 
	
	// Initialization function
	function init(id, d, options){
		// Update configuration	
		if('undefined' !== typeof options){
		  for(var i in options){
			if('undefined' !== typeof options[i]){
			  cfg[i] = options[i];
			}
		  }
		}
		cfg.maxValue = Math.max(cfg.maxValue, d3.max(d, function(i){return d3.max(i.map(function(o){return o.value;}))}));
		allAxis = (d[0].map(function(i, j){return i.axis}));
		total = allAxis.length;
		radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
		Format = d3.format('.0%');
		d3.select(id).select("svg").remove();
		
		g = d3.select(id)
				.append("svg")
				.attr("width", cfg.w+cfg.ExtraWidthX)
				.attr("height", "90%")
				.style("transform", "translateY(5%)") 	// Adjust here for vertical centering
				.append("g")
				.attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")")
		
		//Circular segments
		for(var j=0; j<cfg.levels-1; j++){
		  var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
		  g.selectAll(".levels")
		   .data(allAxis)
		   .enter()
		   .append("svg:line")
		   .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
		   .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
		   .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
		   .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
		   .attr("class", "line")
		   .style("stroke", "grey")
		   .style("stroke-opacity", "0.85")
		   .style("stroke-width", "0.35px")
		   .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
		}

		//Text indicating at what % each level is
		for(var j=0; j<cfg.levels; j++){
		  var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
		  g.selectAll(".levels")
		   .data([1]) //dummy data
		   .enter()
		   .append("svg:text")
		   .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
		   .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
		   .attr("class", "legend")
		   .style("font-family", "sans-serif")
		   .style("font-size", "10px")
		   .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
		   .attr("fill", "#737373")
		   .text(Format((j+1)*cfg.maxValue/cfg.levels));
		}
		
		series = 0;

		axis = g.selectAll(".axis")
				.data(allAxis)
				.enter()
				.append("g")
				.attr("class", "axis");

		axis.append("line")
			.attr("x1", cfg.w/2)
			.attr("y1", cfg.h/2)
			.attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
			.attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
			.attr("class", "line")
			.style("stroke", "grey")
			.style("stroke-width", "1px");

		axis.append("text")
			.attr("class", "legend")
			.text(function(d){return d})
			.style("font-family", "sans-serif")
			.style("font-size", "11px")
			.attr("text-anchor", "middle")
			.attr("dy", "1.5em")
			.attr("transform", function(d, i){return "translate(0, -10)"})
			.attr("x", function(d, i){return 0.5*cfg.w*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
			.attr("y", function(d, i){return 0.5*cfg.h*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});
	}
	
	function draw(id, countryList, options,ByCountry){
		// Remove everything
		g.selectAll(".nodes").remove()
		g.selectAll("polygon").remove()
		g.selectAll("circle").remove()
		
		var toDisplay = g
			.selectAll(".nodes")
			.data(ByCountry)
			.enter()
			.filter(function(d){ return d.selected; })
			.append("g")
			.attr("fill", function(d){return cfg.color(d.key);})
			.attr("class","country")
			
		var polygons = toDisplay
			.selectAll("polygon")
			.data(function(d,i_1){
				var dataValues = [];
				d.means.forEach(function(j, i){
					dataValues.push([
						cfg.w/2*(1-(parseFloat(Math.max(j/max[i], 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
						cfg.h/2*(1-(parseFloat(Math.max(j/max[i], 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total)),
						colorscale(i_1),
						i_1
						]);
				});
				dataValues.push(dataValues[0]);
				return [dataValues];})
			.enter()
			.append("polygon")
			.attr("class", function(d,i){return "Polygon_nb_"+d[0][3]})
			.style("stroke-width", "2px")
			.style("stroke", function(d,i){return d[0][2];})
			.attr("points",function(d) {
				 var str="";
				 for(var pti=0;pti<d.length;pti++){
					 str=str+d[pti][0]+","+d[pti][1]+" ";
				 }
				 return str;
			 })
			.style("fill", function(d,i){return d[0][2];})
			.style("fill-opacity", cfg.opacityArea)
			.on('mouseover', function (d){
								z = "polygon."+d3.select(this).attr("class");
								g.selectAll("polygon")
								 .transition(200)
								 .style("fill-opacity", 0.1); 
								g.selectAll(z)
								 .transition(200)
								 .style("fill-opacity", .7);
							  })
			 .on('mouseout', function(){
								g.selectAll("polygon")
								 .transition(200)
								 .style("fill-opacity", cfg.opacityArea);
							})
		
		var edges = toDisplay
			.selectAll("g")
			.data(function(d,i_1){
				var dataValues = [];
				d.means.forEach(function(j, i){
					dataValues.push([
						cfg.w/2*(1-(parseFloat(Math.max(j/max[i], 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
						cfg.h/2*(1-(parseFloat(Math.max(j/max[i], 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total)),
						colorscale(i_1),
						i_1,
						Math.max(j, 0)
						]);
				});
				return [dataValues];})
			.enter()
			.append("g")
			.selectAll("circles")
			.data(function(d){return d;})
			.enter()
			.append("svg:circle")
			.attr("class", function(d,i){return "Circles_polygon_nb_"+d[3];})
			.attr('r', cfg.radius)
			.attr("alt", function(d,i){return d[4]})
			.attr("cx", function(d, i){return d[0];
			})
			.attr("cy", function(d, i){
				return d[1];
			})
			.attr("data-id", function(d,i){return labels[i]})// labels[i]= j.axis
			.style("fill", function(d,i){return d[2]})
			.style("fill-opacity", .9)
			.on('mouseover', function (d){
						z = "polygon."+d3.select(this).attr("class");
						g.selectAll("polygon")
							.transition(200)
							.style("fill-opacity", 0.1); 
						g.selectAll(z)
							.transition(200)
							.style("fill-opacity", .7);
					  })
			.on('mouseout', function(){
						g.selectAll("polygon")
							.transition(200)
							.style("fill-opacity", cfg.opacityArea);
					  })
			.append("svg:title")
			.text(function(d,i){return d[4];});					
		

	}

	return {init : init,draw}
};