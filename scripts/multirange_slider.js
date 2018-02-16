function sliderInit(){
	var init = 0
	var width = 900;
	var height = 50;
	var pad = 50, radius = 20, radius2 = 10;
	 
	var holder = d3.select("#slider")
	      .append("svg")
	      .attr("width", width)    
	      .attr("height", height)
	      .attr('id', 'back');

	var x = d3.scaleLinear()
		.domain([0, 100])
		.range([0, width - 20])
		.clamp(true);

	var slider = holder.append('g')
		.attr('call', 'slider')
		.attr('transform', 'translate(10, ' + height / 2 + ')');

	slider.append('line')
			.attr('x1', x.range()[0])
			.attr('x2', x.range()[1])
		.select(function(){
			return this.parentNode.appendChild(this.cloneNode(true));
		})
			.attr('class', 'track-inset')
		.select(function(){
			return this.parentNode.appendChild(this.cloneNode(true));
		})
			.attr('class', 'track-overlay')
			.call(d3.drag()
				.on('start.interrupt', function() {
					slider.interrupt();
				})
				.on('start drag', function(){ 
					hue(d3.event.x); 
				}));

	slider.insert('g', '.track-overlay')
			.attr('class', 'ticks')
			.attr('transform', 'translate(0, ' + 18 + ')')
		.selectAll('text')
		.data(x.ticks(10))
		.enter().append('text')
			.attr('x', x)
			.attr('text-anchor', 'middle')
			.text(function(d){
				return d;
			});

	for (var i = 0; i < 12; i++){
		slider.insert('circle', '.track-overlay')
			.attr('class', 'handle')
			.attr('cx', width * (i+1) / 13)
			.attr('id', 'circle_' + i)
			.attr('r', 9);
	}

	d3.select('#slider3').insert('h2', ':first-child').text(init);

	function hue(h) {
		var min_dist = width;
		var circle_id = '';
		d3.selectAll('.handle')._groups[0].forEach(function(d){
			if (Math.abs(parseFloat(d.attributes.cx.value) - h) < min_dist){
				min_dist = Math.abs(parseFloat(d.attributes.cx.value) - h);
				circle_id = d.attributes.id.value;
			}
		});
		var handle = d3.select('#' + circle_id);
		handle.attr("cx", x(x.invert(h)));

		var cx_values = [];
		d3.selectAll('.handle')._groups[0].forEach(function(d){
			cx_values.push(parseFloat(d.attributes.cx.value));
		});
		var zones = [];
		zones.push(cx_values[0])
		for(var i = 0; i < 11; i++){
			zones.push(cx_values[i+1] - cx_values[i]);
		}
		zones.push(width - cx_values[11]);
	}
};