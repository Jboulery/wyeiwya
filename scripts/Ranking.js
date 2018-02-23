// Inspirated by : 
// http://bl.ocks.org/mbostock/3943967
// https://bl.ocks.org/mbostock/1256572


//**************************************//
//		Ranking creation function		//
//**************************************//

function rankingInit(ByCountry, field,height,margin,hmax,spiderChart){
	// Create the initial ranking, based on "criteria"
	// 0 : fat_100g
	// 1 : saturated-fat_100g
	// etc...
	//
	// Variables definition
	var text_padding, bar_padding;
	var context = field
			.append("svg")
			.attr("width","100%")
			.attr("height",1200);
	var width = context.node().getBoundingClientRect().width;
	var rec1 = context.append("rect");
	var rec2 = context.append("rect");	
	var rec3 = context.append("rect");	
	var rec4 = context.append("rect");	
	var rec5 = context.append("rect");
	
	// Graphical parameters
	var boxStrokeWidth 	= 2;	
	var numTicks = 5;	// Nb of ticks on xaxis
	
	updateDimensions(context.node().getBoundingClientRect().width);
	
	// Sort countries according to "criteria"
	 var max=ByCountry
		.sort(function(a,b){return b.criteria-a.criteria;})
		.map(function(d){return d.key;});

	ByCountry.sort(function(a,b){return max.indexOf(a.key)-max.indexOf(b.key);});
	
	var nb_countries = ByCountry.length;
	var bar_h = height/nb_countries;
	
	// Scale creation
	var xMax = d3.max(ByCountry, function(d) { return d.criteria; } );
	var xScale = d3.scaleLinear()
				.domain([0, xMax]);	
		
	var yScale = d3.scaleBand()
				.domain(ByCountry.map(function(d) {return d.key; }));
	
	// Axis creation
	var xAxis = d3.axisBottom()
		.ticks(numTicks);
	
	// Initialize axis drawing
	var gX = context.append("g")
		.attr("class","axis")
		.attr("transform", "translate(0,10)")
	
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
			
	// Countries names definition
	var countryNames = groups.append("text")
		.text(function(d) { return d.key; })
		.attr("text-anchor", "end")
		.attr("id", function(d,i) { return "label"+i; });

	
	// Red/Green progress bar definition
	var gauge = groups
		.append("rect")
		.attr("class", "gauge");
		
	// Rectangles definition
	var bars = groups
		.append("rect")
		.attr("class", "bars")
		.attr("id", function(d,i) { return d.key; });
		
	// Values at the bars end
	var numText = groups
		.append("text")
		.text(function(d) { return d.criteria.toPrecision(3); })
		.attr("text-anchor", "end")
		.attr("id", "precise-value");
		
	// Create grid
	var grid = xScale.ticks(numTicks);
	
	var grid_on = barSvg.append("g").attr("class", "grid")
		.selectAll("line")
		.data(grid, function(d) { return d; })
		.enter().append("line")
		.attr("stroke", "white");
		
	// Render everything
	render()

	// Tooltip creation
	    var tooltip = field
	         .append("div")
	         .attr("class", "tooltip hidden");
	
	// Rectangles effects (highlight + tootip)
	bars
		.on("mouseover", function(d) {
			var currentGroup = d3.select(this.parentNode);
			currentGroup.select(".bars").style("fill", "brown");
			currentGroup.select("text").style("font-weight", "bold");
			
			var mouse = d3.mouse(context.node()).map(function(d) {
				return parseInt(d);
			});
			tooltip.classed('hidden', false)
				.attr('style', 'left:'+(mouse[0]+100)+'px; top:' + (mouse[1]) + 'px')
				.html("<em>"+d.key+":</em>"
				+"<p>- Current rank : "+d.currentRank+"</p>"
				+"<p>- Former rank : "+d.formerRank+"</p>"
				+"<p>- Products nb : "+d.values.length+"</p>"
				+"<p>- Energy : " + d.means[13].toPrecision(2) + "kJ </p>");
		})
		
		.on("mouseout", function() {
			var currentGroup = d3.select(this.parentNode);
			currentGroup.select(".bars").style("fill",function(d){return colorScale(d)})
			currentGroup.select("text").style("font-weight", "normal");
			tooltip.classed('hidden', true);
		})
	
		.on("click", function() {
			var currentGroup = d3.select(this.parentNode);
			var toFind = currentGroup.select(".bars").attr("id");
			ByCountry.forEach(function(d){
				if(d.key == toFind){d.selected = !d.selected}
				});	
			//	.style("fill",function(d){return colorScale(d)});
			currentGroup.select("text").style("font-weight", "normal");
			// Update radar chart
			spiderChart.spiderUpdate();
		});
	
	//******************************//
	//		Rendering function		//
	//******************************//
	
	function render() {
		//get dimensions based on window size
		updateDimensions(context.node().getBoundingClientRect().width);
		
		//update x and y scales to new dimensions
		xScale.range([margin.left+text_padding+bar_padding,width+margin.left]);
		yScale.rangeRound([0, height]);
		
		//update the axis
		xAxis.scale(xScale);
		gX.call(xAxis);
		
		//update svg elements to new dimensions
		context
		  .attr('width', "100%")
		  .attr('height', hmax);
		
		//Update country names
		countryNames
			.attr("x", margin.left+text_padding)
			.attr("y", function(d) { return yScale(d.key)+0.5*bar_h+5; })
			.attr("dx", "-.50em");
			
		// Update rectangles
		bars
			.attr("width", function(d) {return xScale(d.criteria)-xScale(0); })
			.attr("height", bar_h)
			.attr("x", xScale(0))
			.attr("y", function(d) { return yScale(d.key); });
		
		// Update progress bar
		gauge	
			.attr("height",0.8*bar_h)
			.attr("width",0.9*bar_padding)
			.attr("x",text_padding+margin.left+0.05*bar_padding)
			.attr("y",function(d) { return yScale(d.key)+0.1*bar_h; })
			.attr("fill","red")
		
		// Update numbers position
		numText
			.attr("x", function(d) { return xScale(d.criteria); })
			.attr("dx", "-.5em")
			.attr("y", function(d) { return yScale(d.key)+0.5*bar_h+4; })
		
		// Update grid
		grid_on
		.attr("y1", 0)
		.attr("y2", height+margin.bottom)
		.attr("x1", function(d) { return xScale(d); })
		.attr("x2", function(d) { return xScale(d); })
		
		// Update scale visu
		scaleVisualization()
	  }

	function updateDimensions(winWidth) {
		// width and margins
		margin.right = 0.05*winWidth;
		margin.left = 0.01*winWidth;
		width = winWidth - margin.left - margin.right;
		// Graphical parameters
		bar_padding 	= 0.02*width;
		text_padding 	= 0.15*width;
	  }
	
	//**********************************//
	//		Ranking update function		//
	//**********************************//			
	
	function rankingUpdate(ByCountry){
		console.log("Updated bars")

		// Geometrical parameters
		var nb_countries = ByCountry.length;
		var bar_h = height/nb_countries;
		var box_size = 0.6*height/nb_countries;
		var padding = 0.2*height/nb_countries;


		var max=ByCountry
			.sort(function(a,b){return b.criteria-a.criteria;})
			.map(function(d){return d.key;});

		ByCountry.sort(function(a,b){return max.indexOf(a.key)-max.indexOf(b.key);});
		
		// Save rank
		ByCountry.forEach(function(country,i){
			country.formerRank = country.currentRank;
			country.currentRank = i+1;
		});
		
		// Scale update

		var xMax = d3.max(ByCountry, function(d) { return d.criteria; } );

		xScale.domain([0, xMax]);
		yScale.domain(ByCountry.map(function(d) {return d.key; }));
		
		// Update axis
		xAxis.scale(xScale)
		
		gX.transition()
		.duration(1000)
		.call(xAxis)
		
		// Update grid
		grid_on
			.transition()
			.duration(1000)
			.attr("x1", function(d) { return xScale(d); })
			.attr("x2", function(d) { return xScale(d); })
		
		// Update numbers
		numText
		.transition()
		.duration(1000)
		.attr("x", function(d) { return xScale(d.criteria); })
		.text(function(d) { return d.criteria.toPrecision(3); })
		.transition()
		.duration(1000)
		.attr("y", function(d) { return yScale(d.key)+0.5*bar_h+4; })
		
		// Update bars
		bars
		.transition()
		.duration(1000)
		.attr("width", function(d) {return xScale(d.criteria)-xScale(0); })
		.attr("x", xScale(0))
		.transition()
		.duration(1000)
		.attr("y", function(d) { return yScale(d.key); })
		
		// Update progress bars
		gauge
			.transition()
			.duration(500)
			.attr("width",0.9*bar_padding)
			.transition()
			.duration(500)
			.transition()
			.duration(1000)
			.attr("y",function(d) { return yScale(d.key)+0.1*bar_h; });
			
		// Update country names
		countryNames
		.transition()
		.duration(1000)
		.transition()
		.duration(1000)
		.attr("y", function(d) { return yScale(d.key)+0.5*bar_h+5; });
	}

	function scaleVisualization(){
		rec1
			.attr("width", margin.left)
			.attr("height", 2)
			.attr("x", 0)
			.attr("y", 2)
			.attr("fill", "red");
			
		rec2
			.attr("width", text_padding)
			.attr("height", 2)
			.attr("x", margin.left)
			.attr("y", 2)
			.attr("fill", "blue");
		
		rec3
			.attr("width", bar_padding)
			.attr("height", 2)
			.attr("x", text_padding+margin.left)
			.attr("y", 2)
			.attr("fill", "red");
		
		rec4
			.attr("width", xScale(xMax)-xScale(0))
			.attr("height", 2)
			.attr("x", xScale(0))
			.attr("y", 2)
			.attr("fill", "blue");
		
		rec5
			.attr("width", margin.right)
			.attr("height", 2)
			.attr("x", xScale(xMax))
			.attr("y", 2)
			.attr("fill", "red");
	}
	
	return {render : render,rankingUpdate}
}

function colorScale(country){
	// Return a color depending on the country status (selected or not)
	if (country.selected == false){return "steelblue"}
	else{return "green"}
}