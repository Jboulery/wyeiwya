// Reference :
// - http://bl.ocks.org/nbremer/6506614

function radarChartInit(ByCountry,context){
	// Geometrical params
	var w = d3.select(context).node().getBoundingClientRect().width, // Get parent width
		h = w;

	var colorscale = d3.scaleOrdinal(d3.schemeCategory10);

	//Legend titles
	var LegendOptions = ['Smartphone','Tablet'];

	//Data
	var spiderVar = [];
	
	//Options for the Radar chart, other than default
	var mycfg = {
	  radius: 4,
	  w: w-100,
	  h: h-100,
	  factor: 0.9,
	//factorLegend: .85,
	  maxValue: 0.6,
	  levels: 6,
	//radians: 2 * Math.PI,
	//opacityArea: 0.5,
	//ToRight: 5,
	  TranslateX: 0.15*w,
	  TranslateY: 0.13*h,
	  ExtraWidthX: 100,	
	  ExtraWidthY: 100,
	//color: d3.scaleOrdinal(d3.schemeCategory10)
	}

	////////////////////////////////////////////
	//////// Initiate drawing area /////////////
	////////////////////////////////////////////
	var temp_c = [];
	var labels = ["Fat", "S. Fat", "Cholesterol", "Carbohydrates", "Fibers", "Sugars", "Proteins",
				"Salt", "Sodium", "Vit. A", "Vit. C", "Calcium", "Iron", "Energy"];
	var max = [100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 4000,1];
	for (var i=0;i<14;i++){temp_c.push({axis:labels[i],value:1});};
	spiderVar.push(temp_c);
	var RadarChart = radarChart();
	RadarChart.init(context, spiderVar, mycfg);
	spiderVar = [];
	
	////////////////////////////////////////////
	/////////// Initiate legend ////////////////
	////////////////////////////////////////////

	var svg = d3.select(context)
		.selectAll('svg')
		.append('svg')
		.attr("id","Legend svg")
		.attr("width", w)
		.attr("height", h)

	//Create the title for the legend
	var text = svg.append("text")
		.attr("class", "title")
		.attr('transform', 'translate(90,0)') 
		.attr("x", w - 70)
		.attr("y", 10)
		.attr("font-size", "12px")
		.attr("fill", "#404040")
		.text("What % of owners use a specific service in a week");
			
	//Initiate Legend	
	var legend = svg.append("g")
		.attr("class", "legend")
		.attr("height", 100)
		.attr("width", 200)
		.attr('transform', 'translate(90,20)') 
		;
		//Create colour squares
		legend.selectAll('rect')
		  .data(LegendOptions)
		  .enter()
		  .append("rect")
		  .attr("x", w - 65)
		  .attr("y", function(d, i){ return i * 20;})
		  .attr("width", 10)
		  .attr("height", 10)
		  .style("fill", function(d, i){ return colorscale(i);})
		  ;
		//Create text next to squares
		legend.selectAll('text')
		  .data(LegendOptions)
		  .enter()
		  .append("text")
		  .attr("x", w - 52)
		  .attr("y", function(d, i){ return i * 20 + 9;})
		  .attr("font-size", "11px")
		  .attr("fill", "#737373")
		  .text(function(d) { return d; })
		  ;	
	
	function spiderUpdate(toDiplay){
		/* Update radar chart with new countries */
		// Define new spiderVar
		console.log("Update for spider chart")
		spiderVar = [];
		ByCountry.forEach(function(country){
			if(country.selected == 1){
				// ~ if country is selected
				// Add country on spiderGraph
				var c = []
				country.means.forEach(function(crit,i){
					console.log(i)
					console.log(crit)
					c.push({axis:labels[i],value:crit/max[i]});
				});
				spiderVar.push(c);}
			});
		// Draw new graph
		//Will expect that data is in %'s
		RadarChart.draw(context, spiderVar, mycfg);
		}
	
	return {spiderUpdate : spiderUpdate}
// End of init function
}
