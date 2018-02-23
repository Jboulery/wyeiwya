function sliderInit(){
	var init = 0
	var width = 900;
	var height = 50;
	var pad = 50, radius = 20, radius2 = 10;
	var color = d3.scaleOrdinal(d3.schemeCategory10);
	 
	var holder = d3.select("#slider")
	      .append("svg")
	      .attr("width", width)    
	      .attr("height", height)
	      .attr('id', 'back');

	var x = d3.scaleLinear()
		.domain([0, 100])
		.range([0, width])
		.clamp(true);

	var slider = holder.append('g')
		.attr('call', 'slider')
		.attr('transform', 'translate(0, ' + height / 2 + ')');


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

	for (var i = 0; i < 13; i++){
		slider.insert('rect', '.track-overlay')
			.attr('class', 'handle')
			.attr('id', 'rect_' + i)
			.attr('x', width * i / 13)
			.attr('width', x.range()[1] / 13 + 2)
			.attr('height', height)
			.attr('transform', 'translate(0, ' + (-height)/2 + ')')
			.attr('fill', color(i));
	};

	function hue(h) {
		var min_dist = width;
		var rect_id = '';
		d3.selectAll('.handle')._groups[0].forEach(function(d){
			if (Math.abs(parseFloat(d.attributes.x.value) - h) < min_dist){
				min_dist = Math.abs(parseFloat(d.attributes.x.value) - h);
				rect_id = d.attributes.id.value;
				var rect_id_nb = parseInt(rect_id.split('_')[1]);
				prev_rect_id = 'rect_' + (rect_id_nb - 1);
				next_rect_id = 'rect_' + (rect_id_nb + 1);
			}
		});
		var handle = d3.select('#' + rect_id);
		var prev_handle = d3.select('#' + prev_rect_id);
		var next_handle = d3.select('#' + next_rect_id);

		if(rect_id === 'rect_12'){
			var new_handle_x_value = x(x.invert(h));
			var prev_handle_x = parseFloat(prev_handle.attr('x'));

			handle.attr("x", new_handle_x_value);
			prev_handle.attr('width', Math.abs(new_handle_x_value - prev_handle_x));
			handle.attr('width', Math.abs(width - new_handle_x_value));
		}
		else if (rect_id === 'rect_0') {
			console.log('Les extremites sont fixes !');
		}
		else{
			var new_handle_x_value = x(x.invert(h));
			var prev_handle_x = parseFloat(prev_handle.attr('x'));
			var next_handle_x = parseFloat(next_handle.attr('x'));

			handle.attr("x", new_handle_x_value);
			prev_handle.attr('width', Math.abs(new_handle_x_value - prev_handle_x));
			handle.attr('width', Math.abs(next_handle_x - new_handle_x_value));
		}
	}
};

function get_sliders_distribution(){
	var width_percentage_values = [];
	var width = parseFloat(d3.select('#slider').select('svg').attr('width'));
	d3.selectAll('.handle')._groups[0].forEach(function(d){
		width_percentage_values.push(parseFloat(d.attributes.width.value) / width);
	});
	return width_percentage_values;
}