// Reference :
// - http://bl.ocks.org/nbremer/6506614

function radarChartInit(ByCountry,context){
	// Geometrical params
	var w = 0.65*d3.select(context).node().getBoundingClientRect().width, // Get parent width
		h = w;

	var colorscale = d3.scaleOrdinal(d3.schemeCategory10);

	//Data
	var spiderVar = [];
	var spiderLegendVar = [];
	
	//Options for the Radar chart, other than default
	var mycfg = {
	  radius: 2,
	  w: w-100,
	  h: h-100,
	  factor: 1,
	  factorLegend: 0.60,
	  maxValue: 0.6,
	  levels: 6,
	//radians: 2 * Math.PI,
	//opacityArea: 0.5,
	//ToRight: 5,
	  TranslateX: 0.40*w,
	  TranslateY: 0.05*h,
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
	// var max = [100, 100, 0.01, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 4000,1]; Use the max extracted from data preprocessing
	var max = [34.072500000000005, 11.5275, 0.019411164821286984, 69.3, 4.1, 41.64, 13.242, 6.2700000000000005, 2.468503937007872, 0.005416666666666667, 0.026729411764705883, 0.1888, 0.00364, 3069.7153846153847]; 
	for (var i=0;i<14;i++){temp_c.push({axis:labels[i],value:1});};
	spiderVar.push(temp_c);
	var RadarChart = radarChart();
	RadarChart.init(context, spiderVar, mycfg);
	spiderVar = [];
	
	////////////////////////////////////////////////////
	/////////// Initiate country legend ////////////////
	////////////////////////////////////////////////////
/*
	var svg = d3.select(context)
		.selectAll('svg')
		.append('svg')
		.attr("id","Legend svg")
		.attr("width", w)
		.attr("height", "100%")
*/
	function spiderUpdate(){
		/* Update radar chart with new countries */
		// Define new spiderVar
		spiderVar = [];
		spiderLegendVar = [];
		// Fill them
		ByCountry.forEach(function(country, country_i){
			if(country.selected == 1){
				// ~ if country is selected
				// Add country on spiderGraph
				var c = []
				country.means.forEach(function(crit,i){
					c.push({axis:labels[i],value:crit/max[i], color:colorscale(country_i)});
				});
				spiderLegendVar.push(country.key);
				spiderVar.push(c);}
			});
		// Draw new graph
		//Will expect that data is in %'s
		RadarChart.draw(context, spiderVar, mycfg,ByCountry);
		}
	
	return {spiderUpdate : spiderUpdate}
// End of init function
}
