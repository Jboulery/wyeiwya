// Inspirated by : 
// http://bl.ocks.org/mbostock/3943967
// https://bl.ocks.org/mbostock/1256572


//**************************************//
//		Ranking creation function		//
//**************************************//

function rankingInit(ByCountry,field,height,margin,hmax,spiderChart){
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

	// color scale 

	// Define color scale for countries based on criteria
    var colorMin = d3.min(ByCountry, function(d) { return d.criteria; } );
    var colorMax = d3.max(ByCountry, function(d) { return d.criteria; } );
    var pas = (colorMax-colorMin)/9

	var color = d3.scaleThreshold()
	.domain([colorMin,colorMin+pas*1.5,colorMin+pas*2,colorMin+pas*3,colorMin+pas*4,colorMin+pas*4.5,colorMin+pas*5,colorMin+pas*5.5,colorMin+pas*9])
	.range(['#fff7fb','#ece7f2','#d0d1e6','#a6bddb','#74a9cf','#3690c0','#0570b0','#045a8d','#023858'])
	

	// Sort countries according to "criteria"
	 var max=ByCountry
		.sort(function(a,b){return b.criteria-a.criteria;})
		.map(function(d){return d.key;});
	
	ByCountry.sort(function(a,b){return max.indexOf(a.key)-max.indexOf(b.key);});
	
	// Get initial rank
	ByCountry.forEach(function(country,i){
		country.currentRank = i+1
		country.formerRank = "Undefined"
	});
	
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
		.ticks(numTicks)
		.tickSize(-3);
	
	// Initialize axis drawing
	var gX = context.append("g")
		.attr("class","axis")
        .attr("dy", ".15em")
		.attr("transform", "translate(0,15)")
	
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
		.attr("fill",function(d){
			if (d.selected == false) {return color(d.criteria);}
			else {return "green"}})
		.attr("id", function(d,i) { return d.key; });
		
	// Values at the bars end
	var numText = groups
		.append("text")
		.text(function(d) { return d.criteria.toPrecision(3); })
		.attr("text-anchor", "end")
		.attr("id", "precise-value");
		
	// Create grid
	var grid = xScale.ticks(numTicks);
	
	var grid_on = barSvg.append("g")
		.attr("class", "grid")
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
				.attr('style', 'left:'+(context.node().getBoundingClientRect().width/1.2)+'px; top:' + (context.node().getBoundingClientRect().height)/7.5 + 'px') // .attr('style', 'left:'+(mouse[0]+100)+'px; top:' + (mouse[1]) + 'px')
				.html("<em>"+d.key+":</em>"
				+"<p>- Current rank : "+d.currentRank+"</p>"
				+"<p>- Former rank : "+d.formerRank+"</p>"
				+"<p>- Products nb : "+d.values.length+"</p>"
				+"<p>- Energy : " + d.means[13].toPrecision(2) + "kJ </p>");
		})
		
		.on("mouseout", function() {
			var currentGroup = d3.select(this.parentNode);
			currentGroup.select(".bars").style("fill",function(d){
			if (d.selected == false) {return color(d.criteria);}
			else {return "green"}});
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
			var scatterplotSVG = document.getElementById('ScatterplotSVG');
			scatterplotSVG.remove();
			scatterplotInit(ByCountry, '#ScatterplotDiv');
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
		gX.call(xAxis)
			.selectAll("text")
			//.attr("dy", ".5em")		
			.attr("transform", "translate(0,-15)");
		
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
			.attr("y", function(d) { return yScale(d.key); })
			.attr("fill", function(d){return color(d.criteria);});

		
		// Update progress bar
		gauge	
			.attr("height",0.8*bar_h)
			.attr("width",0.9*bar_padding)
			.attr("x",text_padding+margin.left+0.05*bar_padding)
			.attr("y",function(d) { return yScale(d.key)+0.1*bar_h; })
			.attr("fill",function(d,i){return jaugeColor(d);})
		
		// Update numbers position
		numText
			.attr("x", function(d) { return xScale(d.criteria); })
			.attr("dx", "-.5em")
			.attr("y", function(d) { return yScale(d.key)+0.5*bar_h+4; })

		// Update grid
		grid_on
		.attr("y1", 16)
		.attr("y2", height+margin.bottom)
		.attr("x1", function(d) { return xScale(d); })
		.attr("x2", function(d) { return xScale(d); })
	  }

	function updateDimensions(winWidth) {
		// width and margins
		margin.right = 0.05*winWidth;
		margin.left = 0.01*winWidth;
		width = winWidth - margin.left - margin.right;
		// Graphical parameters
		bar_padding 	= 0.05*width;
		text_padding 	= 0.15*width;
	  }
	
	//**********************************//
	//		Ranking update function		//
	//**********************************//			
	
	function rankingUpdate(ByCountry){
		console.log("Updated bars")

		// color update 

	    var colorMin = d3.min(ByCountry, function(d) { return d.criteria; } );
	    var colorMax = d3.max(ByCountry, function(d) { return d.criteria; } );
	    var pas = (colorMax-colorMin)/9

		color.domain([colorMin,colorMin+pas*1.5,colorMin+pas*2,colorMin+pas*3,colorMin+pas*4,colorMin+pas*4.5,colorMin+pas*5,colorMin+pas*5.5,colorMin+pas*9])		


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
		.attr("fill",function(d){
			if (d.selected == false) {return color(d.criteria);}
			else {return "green"}})
		// Update progress bars
		gauge
			.transition()
			.duration(500)
			.attr("width",function(d,i){return jaugeSize(d,bar_padding);})
			.attr("fill",function(d,i){return jaugeColor(d);})
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
	
	return {render : render,rankingUpdate}
}

function jaugeColor(country){
	// Return a color depending on the country's current and former ranks
	if (country.currentRank < country.formerRank){return "green"}
	else if (country.currentRank > country.formerRank){return "red"}
	else{return "grey"}
}
	
function jaugeSize(country,bar_padding){
	// Return a size depending on the country's current and former ranks
	DeltaRank = Math.abs(country.currentRank-country.formerRank);
	max = 0.9*bar_padding;
	if (DeltaRank == 0){return max;}
	else if (DeltaRank > 10){return max;}
	else {return DeltaRank/10*max;}
}