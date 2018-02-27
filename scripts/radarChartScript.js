// Reference :
// - http://bl.ocks.org/nbremer/6506614

function radarChartInit(ByCountry,context){
	// Geometrical params
	var w = 0.95*d3.select(context).node().getBoundingClientRect().width, // Get parent width
		h = w;

	var colorscale = d3.scaleOrdinal(d3.schemeCategory10);

	//Data
	var spiderVar = [];
	var spiderLegendVar = [];
	
	//Options for the Radar chart, other than default
	var mycfg = {
	  radius: 4,
	  w: w-100,
	  h: h-100,
	  factor: 1,
	  factorLegend: 0.60,
	  maxValue: 0.6,
	  levels: 6,
	//radians: 2 * Math.PI,
	//opacityArea: 0.5,
	//ToRight: 5,
	  TranslateX: 0.20*w,
	  TranslateY: 0.22*h,
	  ExtraWidthX: 100,	
	  ExtraWidthY: 100,
	//color: d3.scaleOrdinal(d3.schemeCategory10)
	}

	////////////////////////////////////////////
	//////// Initiate drawing area /////////////
	////////////////////////////////////////////
	var temp_c = [];
	var labels = ["Fat", "S. Fats", "Chol.", "Carb.", "Fibers", "Sugars", "Proteins",
				"Salt", "Sod.", "Vit. A", "Vit. C", "Calc.", "Iron", "Energy"];
	var max = [100, 100, 0.01, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 4000,1];
	for (var i=0;i<14;i++){temp_c.push({axis:labels[i],value:1});};
	spiderVar.push(temp_c);
	var RadarChart = radarChart();
	RadarChart.init(context, spiderVar, mycfg);
	spiderVar = [];
	
	////////////////////////////////////////////////////
	/////////// Initiate country legend ////////////////
	////////////////////////////////////////////////////

	var svg = d3.select(context)
		.selectAll('svg')
		.append('svg')
		.attr("id","Legend svg")
		.attr("width", w)
		.attr("height", "100%")

	//Create the title for the legend
	var text = svg.append("text")
		.attr("class", "title")
		.attr('transform', 'translate(90,0)') 
		.attr("x", 25)
		.attr("y", 15)
		.attr("text-anchor","middle")
		.attr("font-size", "12px")
		.attr("fill", "#404040")
		.text("Mean values comparison");
			
	//Initiate Legend	
	var legend = svg.append("g")
		.attr("class", "legend")
		.attr("height", 100)
		.attr("width", 200)
		.attr('transform', 'translate('+(-0.65*w)+','+h*1+')') 
		;

	function spiderUpdate(toDiplay){
		/* Update radar chart with new countries */
		console.log("Update for spider chart")
		// Remove legend
		legend.selectAll('rect').remove();
		legend.selectAll('text').remove();
		// Define new spiderVar
		spiderVar = [];
		spiderLegendVar = [];
		// Fill them
		ByCountry.forEach(function(country){
			if(country.selected == 1){
				// ~ if country is selected
				// Add country on spiderGraph
				var c = []
				country.means.forEach(function(crit,i){
					c.push({axis:labels[i],value:crit/max[i]});
				});
				spiderLegendVar.push(country.key);
				spiderVar.push(c);}
			});
		// Draw new graph
		//Will expect that data is in %'s
		RadarChart.draw(context, spiderVar, mycfg);
		
		//Create colour squares
		legend.selectAll('rect')
		  .data(spiderLegendVar)
		  .enter()
		  .append("rect")
		  .attr("x", function(d, i){ 
				if (i<5){return w - 65;}
				else 	{return 1.5*w - 65;}})
		  .attr("y", function(d, i){ 
				if(i<5)	{return i * 20;}
				else	{return (i-5)*20}})
		  .attr("width", 10)
		  .attr("height", 10)
		  .style("fill", function(d, i){ return colorscale(i);})
		  .attr("id","Legend squares")
		  ;
		//Create text next to squares
		legend.selectAll('text')
		  .data(spiderLegendVar)
		  .enter()
		  .append("text")
		  .attr("x", function(d, i){ 
				if (i<5){return w - 52}
				else {return 1.5*w - 52}})
		  .attr("y", function(d, i){ 
				if(i<5)	{return i * 20+9;}
				else	{return (i-5)*20+9}})
		  .attr("font-size", "11px")
		  .attr("fill", "#737373")
		  .text(function(d) { return d; })
		  .attr("id","legend text")
		  ;	
	
		}
	
	return {spiderUpdate : spiderUpdate}
// End of init function
}
