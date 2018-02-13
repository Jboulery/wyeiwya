// Inspirated by : 
// http://bl.ocks.org/mbostock/3943967
// https://bl.ocks.org/mbostock/1256572

// Graphical parameters
var margin = {top: 20, right: 20, bottom: 30, left: 20};
var width = 960 - margin.left - margin.right;
var height = 4000 - margin.top - margin.bottom;
var bar_padding = 38;
var text_padding = 120;
var boxStrokeWidth = 2;



//**************************************//
//		Ranking creation function		//
//**************************************//

function rankingInit(ByCountry, criteria, context,width,height){
	// Create the initial ranking, based on "criteria"
	// 0 : fat_100g
	// 1 : saturated-fat_100g
	// etc...
	
	// Sort countries according to "criteria"
	 var max=ByCountry
		.sort(function(a,b){return b.means[criteria]-a.means[criteria];})
		.map(function(d){return d.key;});

	ByCountry.sort(function(a,b){return max.indexOf(a.key)-max.indexOf(b.key);});
	
	var nb_countries = ByCountry.length;
	var bar_h = height/nb_countries;
	
	// Scale creation
	var xScale = d3.scaleLinear()
				.range([margin.left+text_padding+bar_padding, width-margin.right]);
	
	var yScale = d3.scaleBand()
				.rangeRound([0, height]);
	
	// Scale update
	var xMax = d3.max(ByCountry, function(d) { return d.means[criteria]; } );
	
	xScale.domain([0, xMax]);
	yScale.domain(ByCountry.map(function(d) {return d.key; }));
	
	// Axis creation
	var numTicks = 5;
	
	var xAxis = d3.axisBottom()
		.scale(xScale)
		//.tickSize((-height))
		.ticks(numTicks);

	var gX = context.append("g")
		.attr("class","axis")
		.attr("transform", "translate(0,10)")
		.call(xAxis);
	
	// Create place for drawing
	var barSvg = context
		.append("g")
		.attr("transform", "translate(0,0)")
		.attr("class", "bar-svg");
	
	var groups = barSvg.append("g").attr("class", "labels")
		.selectAll("text")
		.data(ByCountry)
		.enter()
		.append("g");
	
	// Countries names
	var countryNames = groups.append("text")
		.attr("x", margin.left+text_padding)
		.attr("y", function(d) { return yScale(d.key)+0.5*bar_h+5; })
		.text(function(d) { return d.key; })
		.attr("text-anchor", "end")
		.attr("dx", "-.50em")
		.attr("id", function(d,i) { return "label"+i; });

	// Rectangles
	var bars = groups
		.attr("class", "bars")
		.append("rect")
		.attr("width", function(d) {return xScale(d.means[criteria])-xScale(0); })
		.attr("height", bar_h)
		.attr("x", xScale(0))
		.attr("y", function(d) { return yScale(d.key); })
		.attr("id", function(d,i) { return "bar"+i; });
		
	// Values at the bars end
	var numText = groups
		.append("text")
		.attr("x", function(d) { return xScale(d.means[criteria]); })
		.attr("y", function(d) { return yScale(d.key)+0.5*bar_h+4; })
		.text(function(d) { return d.means[criteria].toPrecision(3); })
		.attr("text-anchor", "end")
		.attr("dx", "-.5em")
		.attr("id", "precise-value");
	
	// Add checkBoxes
	ByCountry.forEach(function(country_i){
		// Parameters
		var box_size = 0.6*height/nb_countries;
		var padding = 0.2*height/nb_countries;
		var box_y_pos = padding+yScale(country_i.key);
		var box_x_pos = margin.left+text_padding+padding;
		
		// Checkboxes
		 var checkBox = new d3CheckBox();

		// Text displayed when checked
		var txt = context.append("text").attr("x", box_x_pos+1.1*box_size).attr("y", box_y_pos+2*padding);
	
		// Update function
		var	update = function () {
			var checked = checkBox.checked();
			if(checked){txt.text(country_i.key);}
			else{txt.text("");}
		};
		// Setting up each check box
		var box_i = checkBox
			.size(box_size)
			.x(box_x_pos)
			.y(box_y_pos)
			.markStrokeWidth(boxStrokeWidth)
			.boxStrokeWidth(1)
			.checked(false)
			.clickEvent(update);
		
		// Display checkbox
		context.call(checkBox);
	});// End of forEach
	
	// Tooltip creation
	var tooltip = d3.select("#ranking").append('div')
					.attr('class', 'hidden tooltip');
	
	// Rectangles effects (highlight + tootip)
	bars
		.on("mouseover", function(d) {
			var currentGroup = d3.select(this.parentNode);
			currentGroup.select("rect").style("fill", "brown");
			currentGroup.select("text").style("font-weight", "bold");
			
			var mouse = d3.mouse(context.node()).map(function(d) {
				return parseInt(d);
			});
			tooltip.classed('hidden', false)
				.attr('style', 'left:' + (mouse[0] + 15) +
						'px; top:' + (mouse[1] - 35) + 'px')
				.html("<em>"+d.key+":</em>"
				+"<p>- Products nb : "+d.values.length+"</p>"
				+"<p>- Mean fat rate : "+d.means[0].toPrecision(3)+"</p>"
				+"<p>- Mean cholesterol : "+d.means[2].toPrecision(3)+"</p>"
				+"<p>- Mean sugars rate : "+d.means[5].toPrecision(3)+"</p>");
		})
		
		.on("mouseout", function() {
			var currentGroup = d3.select(this.parentNode);
			currentGroup.select("rect").style("fill", "steelblue");
			currentGroup.select("text").style("font-weight", "normal");
			
			tooltip.classed('hidden', true);
		});
	
	// Create grid
	var grid = xScale.ticks(numTicks);
	
	var grid_on = barSvg.append("g").attr("class", "grid")
		.selectAll("line")
		.data(grid, function(d) { return d; })
		.enter().append("line")
		.attr("y1", 0)
		.attr("y2", height+margin.bottom)
		.attr("x1", function(d) { return xScale(d); })
		.attr("x2", function(d) { return xScale(d); })
		.attr("stroke", "white");
	//----------------------------------------------------//
	//----------------------------------------------------//
	// Scale visu
	context.append("rect")
		.attr("width", margin.left)
		.attr("height", 2)
		.attr("x", 0)
		.attr("y", 2)
		.attr("fill", "red");
		
	context.append("rect")
		.attr("width", text_padding)
		.attr("height", 2)
		.attr("x", margin.left)
		.attr("y", 2)
		.attr("fill", "blue");
		
	context.append("rect")
		.attr("width", bar_padding)
		.attr("height", 2)
		.attr("x", text_padding+margin.left)
		.attr("y", 2)
		.attr("fill", "red");
		
	context.append("rect")
		.attr("width", xScale(49)-xScale(0))
		.attr("height", 2)
		.attr("x", xScale(0))
		.attr("y", 2)
		.attr("fill", "blue");
		
	context.append("rect")
		.attr("width", margin.right)
		.attr("height", 2)
		.attr("x", xScale(49))
		.attr("y", 2)
		.attr("fill", "red");
	
	// End of function RankingInit
	return([xScale,yScale,gX, xAxis,numText,bars,countryNames,grid_on,tooltip])
}
		
//**********************************//
//		Ranking update function		//
//**********************************//			
	
function rankingUpdate(ByCountry, criteria,xScale,yScale,gX,xAxis,numText,bars,countryNames,grid_on,tooltip){
	console.log("Update with "+criteria)

	var max=ByCountry
		.sort(function(a,b){return b.means[criteria]-a.means[criteria];})
		.map(function(d){return d.key;});

	ByCountry.sort(function(a,b){return max.indexOf(a.key)-max.indexOf(b.key);});

	// Scale update

	var xMax = d3.max(ByCountry, function(d) { return d.means[criteria]; } );

	xScale.domain([0, xMax]);
	yScale.domain(ByCountry.map(function(d) {return d.key; }));
	
	// Update axis
	xAxis.scale(xScale)
	
	gX.transition()
	.duration(2000)
	.call(xAxis)
	
	// Update grid
	grid_on
		.transition()
		.duration(2000)
		.attr("x1", function(d) { return xScale(d); })
		.attr("x2", function(d) { return xScale(d); })
	
	// Update bars
	numText
	.transition()
	.duration(2000)
	.attr("x", function(d) { return xScale(d.means[criteria]); })
	.text(function(d) { return d.means[criteria].toPrecision(3); })
	.transition()
	.duration(2000)
	.attr("y", function(d) { return yScale(d.key); })
	
	bars
	.transition()
	.duration(2000)
	.attr("width", function(d) {return xScale(d.means[criteria])-xScale(0); })
	.attr("x", xScale(0))
	.transition()
	.duration(2000)
	.attr("y", function(d) { return yScale(d.key); })
	
	countryNames
	.transition()
	.duration(2000)
	.transition()
	.duration(2000)
	.attr("y", function(d) { return yScale(d.key); });
	
	}