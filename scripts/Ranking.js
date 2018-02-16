// Inspirated by : 
// http://bl.ocks.org/mbostock/3943967
// https://bl.ocks.org/mbostock/1256572


//**************************************//
//		Ranking creation function		//
//**************************************//

function rankingInit(ByCountry, criteria, field,width,height,margin,hmax){
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
	var rec1 = context.append("rect");
	var rec2 = context.append("rect");	
	var rec3 = context.append("rect");	
	var rec4 = context.append("rect");	
	var rec5 = context.append("rect");
	
	// Graphical parameters
	var boxStrokeWidth 	= 2;	
	var numTicks = 5;	// Nb of ticks on xaxis
	
	// Sort countries according to "criteria"
	 var max=ByCountry
		.sort(function(a,b){return b.means[criteria]-a.means[criteria];})
		.map(function(d){return d.key;});

	ByCountry.sort(function(a,b){return max.indexOf(a.key)-max.indexOf(b.key);});
	
	var nb_countries = ByCountry.length;
	var bar_h = height/nb_countries;
	
	// Scale creation
	var xMax = d3.max(ByCountry, function(d) { return d.means[criteria]; } );
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

	// Rectangles definition
	var bars = groups
		.attr("class", "bars")
		.append("rect")
		.attr("id", function(d,i) { return d.key; });
		
	// Values at the bars end
	var numText = groups
		.append("text")
		.text(function(d) { return d.means[criteria].toPrecision(3); })
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
	
	// Add checkboxes
	var box_size = 0.6*height/nb_countries;
	var padding = 0.2*height/nb_countries;
	var boxesList = [];
/*	
	// Add checkBoxes
	ByCountry.forEach(function(country_i){
		// Parameters
		var box_y_pos = padding+yScale(country_i.key);
		var box_x_pos = margin.left+text_padding+padding;
		
		// Checkboxes
		var checkBox = new d3CheckBox();
		var gBox_i = context.append("g").attr("class","checkBox")
		
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
		gBox_i.call(checkBox);	
		
		// Save box
		boxesList.push([box_i,country_i.key,gBox_i]);
	});// End of forEach
*/	
	// Tooltip creation
	    var tooltip = field
	         .append("div")
	         .attr("class", "tooltip hidden");
	
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
				.attr('style', 'left:'+width+'; top:' + (mouse[1]) + 'px')
				.html("<em>"+d.key+":</em>"
				+"<p>- Products nb : "+d.values.length+"</p>"
				+"<p>- Mean fat rate : "+d.means[0].toPrecision(3)+"</p>"
				+"<p>- Mean cholesterol : "+d.means[2].toPrecision(3)+"</p>"
				+"<p>- Mean sugars rate : "+d.means[5].toPrecision(3)+"</p>");
		})
		
		.on("mouseout", function() {
			var currentGroup = d3.select(this.parentNode);
			currentGroup.select("rect").style("fill",function(d){return colorScale(d)})
			currentGroup.select("text").style("font-weight", "normal");
			tooltip.classed('hidden', true);
		})
	
		.on("click", function() {
			var currentGroup = d3.select(this.parentNode);
			var toFind = currentGroup.select("rect").attr("id");
			ByCountry.forEach(function(d){
				if(d.key == toFind){d.selected = !d.selected}
				});	
			//	.style("fill",function(d){return colorScale(d)});
			currentGroup.select("text").style("font-weight", "normal");
		});
	
	//******************************//
	//		Rendering function		//
	//******************************//
	
	function render() {
		//get dimensions based on window size
		updateDimensions(window.innerWidth);
		
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
			.attr("width", function(d) {return xScale(d.means[criteria])-xScale(0); })
			.attr("height", bar_h)
			.attr("x", xScale(0))
			.attr("y", function(d) { return yScale(d.key); })
			
		// Update numbers position
		numText
			.attr("x", function(d) { return xScale(d.means[criteria]); })
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
		margin.left = 0.05*winWidth;
		width = winWidth - margin.left - margin.right;
		// Graphical parameters
		bar_padding 	= 0.02*width;
		text_padding 	= 0.15*width;
	  }
	
	//**********************************//
	//		Ranking update function		//
	//**********************************//			
	
	function rankingUpdate(criteria){
		console.log("Update with "+criteria)

		// Geometrical parameters
		var nb_countries = ByCountry.length;
		var bar_h = height/nb_countries;
		var box_size = 0.6*height/nb_countries;
		var padding = 0.2*height/nb_countries;

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
		.attr("y", function(d) { return yScale(d.key)+0.5*bar_h+4; })
		
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
		.attr("y", function(d) { return yScale(d.key)+0.5*bar_h+5; });
	/*	
		boxesList.forEach(function(d){
			// Get parameters
			box_i = d[0];
			country_i = d[1];
			gBox_i = d[2];
			
			// New Update fct
			var txt = context.append("text").attr("x", box_x_pos+1.1*box_size).attr("y", box_y_pos+2*padding);
			var	update = function (){
				var checked = checkBox.checked();
				if(checked){txt.text(country_i);}
				else{txt.text("");}
			}
			// Update checkbox
			var box_y_pos = padding+yScale(country_i);
			var box_x_pos = margin.left+text_padding+padding;
			box_i.y(box_y_pos)
			//.clickEvent(update);
			
			gBox_i//.transition()
			//.duration(2000)
			.call(box_i)
		})
*/
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
			.attr("width", xScale(49)-xScale(0))
			.attr("height", 2)
			.attr("x", xScale(0))
			.attr("y", 2)
			.attr("fill", "blue");
		
		rec5
			.attr("width", margin.right)
			.attr("height", 2)
			.attr("x", xScale(49))
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