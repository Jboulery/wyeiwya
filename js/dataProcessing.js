function dataProcessing(data){
			
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
	
	return ByCountry
}