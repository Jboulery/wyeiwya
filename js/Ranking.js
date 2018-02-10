// Inspirated by : 
	// http://bl.ocks.org/mbostock/3943967
	// https://bl.ocks.org/mbostock/1256572

	var margin = {top: 20, right: 20, bottom: 30, left: 10};
	var width = 960 - margin.left - margin.right;
	var height = 4000 - margin.top - margin.bottom;

	// Create svg canvas

/*	var svg = d3.select("#scatterplot")
	.append("svg")
	.attr("width",width+margin.left+margin.right)
	.attr("height",height+margin.bottom+margin.top)

	var g = svg.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
*/	
	// Data parameters :
	x_coord = "sugars_100g";
	y_coord = "fat_100g";
	
	//**************************//
	//		Data processing		//
	//**************************//		
	
	d3.csv("data/food_data.csv", function(error,data) {
			// Test
			if (error){console.log(error)}
			
			else{
				// Save data
				dataset = data;
				
				//******************************//
				//			Format data			//
				//******************************//
				
				data = data.filter(function(d) {
					// delete any absurd line
					ValuesPer100g = [+d.fat_100g,
									+d['saturated-fat_100g'],
									+d.cholesterol_100g,
									+d.carbohydrates_100g,
									+d.sugars_100g,
									+d.fiber_100g,
									+d.proteins_100g,
									+d.salt_100g,
									+d.sodium_100g,
									+d['vitamin-a_100g'],
									+d['vitamin-c_100g'],
									+d.calcium_100g,
									+d.iron_100g];
				
					return (d.code != "" && d.countries_tags != "") && (d3.max(ValuesPer100g) <= 100) && (d3.min(ValuesPer100g) >= 0);
				})
				
				// Duplicate products with two "coutry_tag"
				data.forEach(function(d){

					if (d.countries_tags.split(",").length>1){
						var tab = d.countries_tags.split(",") ;
						d.countries_tags = tab[0];
						for (var i=0;i<tab.length-1;i++){
							var element = d;
							element.countries_tags = tab[i+1];
							data.push(element);
							}
					}
				});

				// Nest data
				var ByCountry = d3.nest()
					.key(function(d) {return d.countries_tags})
					.entries(data);
				
				// Add max / min / mean
				ByCountry.forEach(function(country){
					// Maximums calculation
					var maxFat 		= d3.max(country.values, function(d) { return +d.fat_100g; });
					var maxSatFat 	= d3.max(country.values, function(d) { return +d['saturated-fat_100g']; });
					var maxChol 	= d3.max(country.values, function(d) { return +d.cholesterol_100g; });
					var maxCarb 	= d3.max(country.values, function(d) { return +d.carbohydrates_100g; });
					var maxFib 		= d3.max(country.values, function(d) { return +d.fiber_100g; });
					var maxSug 		= d3.max(country.values, function(d) { return +d.sugars_100g; });
					country.max 	= [maxFat, maxSatFat, maxChol, maxCarb, maxFib, maxSug];
					
					// Means calculation
					var meanFat 	= d3.mean(country.values, function(d) { return +d.fat_100g; });
					var meanSatFat 	= d3.mean(country.values, function(d) { return +d['saturated-fat_100g']; });
					var meanChol 	= d3.mean(country.values, function(d) { return +d.cholesterol_100g; });
					var meanCarb 	= d3.mean(country.values, function(d) { return +d.carbohydrates_100g; });
					var meanFib 	= d3.mean(country.values, function(d) { return +d.fiber_100g; });
					var meanSug 	= d3.mean(country.values, function(d) { return +d.sugars_100g; });
					country.means 	= [meanFat, meanSatFat, meanChol, meanCarb, meanFib, meanSug];
				});
				
				console.log(ByCountry);
				var nb_countries = ByCountry.length;
				
				//**************************//
				//			Data plot		//
				//**************************//
		
				// Extremums
				var Xmin = d3.min(data, function(d) {
											return +d[x_coord];});
				var Xmax = d3.max(data, function(d) {
											return +d[x_coord];});
				var Ymin = d3.min(data, function(d) {
											return +d[y_coord];});
				var Ymax = d3.max(data, function(d) {
											return +d[y_coord];});
				

				// Create scales
				var x = d3.scaleLinear()
					.domain([0,Xmax])
					.range([0,width]);
				var y = d3.scaleLinear()
					.domain([0,Ymax])
					.range([height,0]);
				
				// Create axis
				var xAxis = d3.axisBottom()
					.scale(x);
				
				var yAxis = d3.axisLeft()
					.scale(y);
			/*		
				var gX = svg.append("g")
					.attr("class","axis")
					.attr("transform", "translate(" + margin.left + "," + (height+margin.top) + ")")
					.call(xAxis);
					
				var gY = svg.append("g")
					.attr("class", "axis")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
					.call(yAxis);
			*/	
							
				//**********************//
				//		Data plots		//
				//**********************//
			/*
				// Create and display dots
				var dots = g.selectAll(".country")	
					.data(ByCountry)
					.enter()
					.append("g")	// added new group
					.attr("class","country")
					
					// Change color
					//.attr("d", function(d){return colorScale(d.key);})
					.selectAll("path")
					.data(function(d){return d.values;})
					.enter()
					.append("path")
					.attr("class", "symbol")
					
					// Change symbol
					.attr("d", d3.symbol().type(d3.symbolCircle).size(20)())
					.attr('fill',"rgb(31,119,180)")
					
					// (x,y) coordinates
					.attr("transform",function(d) {return "translate(" + x(+d[x_coord]) +","+ y(+d[y_coord]) +")" ;})
*/

				//******************************//
				//		Countries ranking		//
				//******************************//
				
				// References :
				// - http://bl.ocks.org/leondutoit/6436923

	
				var svg2 = d3.select("#ranking")
					.append("svg")
					.attr("width",width+margin.left+margin.right)
					.attr("height",height+margin.bottom+margin.top)
				
				var tooltip = d3.select("#ranking").append('div')
								.attr('class', 'hidden tooltip');
								
				// Scale creation
				var xScale = d3.scaleLinear()
							.range([0, width-150]);
				
				var yScale = d3.scaleBand()
							.rangeRound([0, height]);
				
				// Create ranking
				[gX,xAxis,numText,bars,countryNames,grid_on] = rankingInit(0, svg2)
				
			//**************************************//
			//		Ranking creation function		//
			//**************************************//
			
			function rankingInit(criteria, context){
				// Create the initial ranking, based on "criteria"
				// 0 : fat_100g
				// 1 : saturated-fat_100g
				// etc...
				
				// Sort countries according to "criteria"
				 var max=ByCountry
					.sort(function(a,b){return b.means[criteria]-a.means[criteria];})
					.map(function(d){return d.key;});

				ByCountry.sort(function(a,b){return max.indexOf(a.key)-max.indexOf(b.key);});
				
				// Scale update
				var xMax = d3.max(ByCountry, function(d) { return d.means[criteria]; } );
				
				xScale.domain([Xmin, xMax]);
				yScale.domain(ByCountry.map(function(d) {return d.key; }));
				
				// Axis creation
				var numTicks = 5;
				
				var xAxis = d3.axisBottom()
					.scale(xScale)
					.tickSize((-height))
					.ticks(numTicks);

				var gX = context.append("g")
					.attr("class","axis")
					.attr("id","xAxis")
					.attr("transform", "translate(150,10)")
					.call(xAxis);
				
				var barSvg = context
					.append("g")
					.attr("transform", "translate(150,20)")
					.attr("class", "bar-svg");
				
				var groups = barSvg.append("g").attr("class", "labels")
					.selectAll("text")
					.data(ByCountry)
					.enter()
					.append("g");
				
				// Country name
				var countryNames = groups.append("text")
					.attr("x", "0")
					.attr("y", function(d) { return yScale(d.key); })
					.text(function(d) { return d.key; })
					.attr("text-anchor", "end")
					.attr("dy", ".9em")
					.attr("dx", "-.50em")
					.attr("id", function(d,i) { return "label"+i; });

				var bars = groups
					.attr("class", "bars")
					.append("rect")
					.attr("width", function(d) {return xScale(d.means[criteria]); })
					.attr("height", height/nb_countries)
					.attr("x", xScale(Xmin))
					.attr("y", function(d) { return yScale(d.key); })
					.attr("id", function(d,i) { return "bar"+i; });

				var numText = groups.append("text")
					.attr("x", function(d) { return xScale(d.means[criteria]); })
					.attr("y", function(d) { return yScale(d.key); })
					.text(function(d) { return d.means[criteria].toPrecision(3); })
					.attr("text-anchor", "end")
					.attr("dy", "1.2em")
					.attr("dx", "-.32em")
					.attr("id", "precise-value");
					
				bars
					.on("mouseover", function() {
						var currentGroup = d3.select(this.parentNode);
						currentGroup.select("rect").style("fill", "brown");
						currentGroup.select("text").style("font-weight", "bold");
						
						var mouse = d3.mouse(context.node()).map(function(d) {
							return parseInt(d);
						});
						tooltip.classed('hidden', false)
							.attr('style', 'left:' + (mouse[0] + 15) +
									'px; top:' + (mouse[1] - 35) + 'px')
							.html("Propriétés du produit :");
					})
					
					.on("mouseout", function() {
						var currentGroup = d3.select(this.parentNode);
						currentGroup.select("rect").style("fill", "steelblue");
						currentGroup.select("text").style("font-weight", "normal");
						
						tooltip.classed('hidden', true);
					});
				
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
					
				return([gX, xAxis,numText,bars,countryNames,grid_on])
			}
					
			//**********************************//
			//		Ranking update function		//
			//**********************************//			
				
			function rankingUpdate(criteria,gX,xAxis,numText,bars,countryNames,grid_on){
				console.log("Update with "+criteria)
			
				var max=ByCountry
					.sort(function(a,b){return b.means[criteria]-a.means[criteria];})
					.map(function(d){return d.key;});

				ByCountry.sort(function(a,b){return max.indexOf(a.key)-max.indexOf(b.key);});
			
				// Scale update

				var xMax = d3.max(ByCountry, function(d) { return d.means[criteria]; } );
			
				xScale.domain([Xmin, xMax]);
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
				.attr("width", function(d) {return xScale(d.means[criteria]); })
				.attr("x", xScale(Xmin))
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
							
			d3.selectAll("input")
				.on("change", changed);
				
			function changed() {
				try{rankingUpdate(+this.value,gX,xAxis,numText,bars,countryNames,grid_on)
					}

				catch(error){
					console.log(error)
					rankingUpdate(0,gX,xAxis,numText,bars,countryNames,grid_on)}
					}
		// End of Data processing
		}});
	