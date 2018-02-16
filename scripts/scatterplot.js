// Graphical parameters
var margin = {top: 20, right: 20, bottom: 30, left: 10};
var width = 960 - margin.left - margin.right;
var height = 4000 - margin.top - margin.bottom;

// Data parameters :
x_coord = "sugars_100g";
y_coord = "fat_100g";

// Create svg canvas

var svg = d3.select("#scatterplot")
.append("svg")
.attr("width",width+margin.left+margin.right)
.attr("height",height+margin.bottom+margin.top)

var g = svg.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
					
				var gX = svg.append("g")
					.attr("class","axis")
					.attr("transform", "translate(" + margin.left + "," + (height+margin.top) + ")")
					.call(xAxis);
					
				var gY = svg.append("g")
					.attr("class", "axis")
					.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
					.call(yAxis);
					
												
				//**********************//
				//		Data plots		//
				//**********************//
			
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
