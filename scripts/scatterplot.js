// Reference :
// - http://bl.ocks.org/nbremer/6506614

function scatterplotInit(ByCountry,context){
	// Geometrical params
	var parentwidth = d3.select(context).node().getBoundingClientRect().width;
	var parentheight = d3.select(context).node().getBoundingClientRect().height;
	var w = 0.90 * parentwidth;
		h = 0.90 * parentheight;
	var margin = {right: 0.05*parentwidth, left: 0.05*parentwidth, top: 0.03*parentheight, bottom: 0.07*parentheight}

	var colorscale = d3.scaleOrdinal(d3.schemeCategory10);

	// // Data parameters :
	x_coord_list = document.getElementById("x_axis_selection");
	x_coord = x_coord_list.options[x_coord_list.selectedIndex].value;
	y_coord_list = document.getElementById("y_axis_selection");
	y_coord = y_coord_list.options[y_coord_list.selectedIndex].value;

	// Create svg canvas

	var svg = d3.select(context)
		.append("svg")
			.attr('id', 'ScatterplotSVG')
			.attr("width", w)
			.attr("height", h);

	var g = svg.append("g");
		// .attr("transform", "translate(,)")

	// Extremums
	var Xmin = 0;
	var Xmax = 100;
	var Ymin = 0;
	var Ymax = 100;

	// Create scales
	var x = d3.scaleLinear()
		.domain([0, Xmax])
		.range([0, w]);
	var y = d3.scaleLinear()
		.domain([0, Ymax])
		.range([h, 0]);

	// Create axis
	var xAxis = d3.axisBottom()
		.scale(x);
	
	var yAxis = d3.axisLeft()
		.scale(y);

	var gX = svg.append("g")
		.attr("class","axis")
		.attr("transform", "translate(" + margin.left + ", " + (h + margin.top) + ")")
		.call(xAxis);
		
	var gY = svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
		.call(yAxis);

	//**********************//
	//		Data plots		//
	//**********************//

	// Create and display dots
	var dots = g.selectAll(".country")	
		.data(ByCountry)
		.enter()
		.filter(function(d){ return d.selected; })
		.append("g")
		.attr("fill", function(d){return colorscale(d.key);})
		.attr("class","country")

		// Change color
		.selectAll("path")
		.data(function(d){return d.normalizedvalues;})
		.enter()
		.append("path")
		.attr("class", "symbol")
		.attr("d", d3.symbol().type(d3.symbolCircle).size(20)())
		.attr("transform",function(d) { return "translate(" + (margin.left + x(+d[x_coord])) +","+ (margin.top + y(+d[y_coord])) +")" ;});

	//**************************//
	//			Legend			//
	//**************************//
	
	//Initiate Legend	
	var legend = svg.append("g")
		.attr("class", "legend")
		.attr("height", 100)
		.attr("width", 200)
		;
		
	/*
		// Remove legend
		legend.selectAll('rect').remove();
		legend.selectAll('text').remove();
		*/
	legend.selectAll("rect")
		.data(ByCountry)
		.enter()
		.filter(function(d){ return d.selected; })
		.append("rect")
		.attr("x", function(d, i){return margin.left + w - 120;})
		.attr("y", function(d, i){return margin.top + i * 20;})
		.attr("width", 10)
		.attr("height", 10)
		.style("fill", function(d, i){ return colorscale(d.key);})
		.attr("id","Legend squares")
		  ;
		  
		//Create text next to squares
	legend.selectAll('text')
		  .data(ByCountry)
		  .enter()
		  .filter(function(d){ return d.selected; })
		  .append("text")
		  .attr("x", function(d, i){return margin.left + w - 100;})
		  .attr("y", function(d, i){return  margin.top + i * 20+9;})
		  .attr("font-size", "11px")
		  .attr("fill", "#737373")
		  .text(function(d) { return d.key; })
		  .attr("id","legend text")
		  ;	
}