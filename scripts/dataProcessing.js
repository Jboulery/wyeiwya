function dataProcessing(data,MinProducts){
			
		//******************************//
		//			Format data			//
		//******************************//

		
		data = data.filter(function(d) {
			// Conversion to numbers
			d.fat_100g = +d.fat_100g;
			d['saturated-fat_100g'] = +d['saturated-fat_100g'];
			d.cholesterol_100g 		= +d.cholesterol_100g;
			d.carbohydrates_100g 	= +d.carbohydrates_100g;
			d.sugars_100g 			= +d.sugars_100g;
			d.fiber_100g 			= +d.fiber_100g;
			d.proteins_100g 		= +d.proteins_100g;
			d.salt_100g 			= +d.salt_100g;
			d.sodium_100g 			= +d.sodium_100g;
			d['vitamin-a_100g'] 	= +d['vitamin-a_100g'];
			d['vitamin-c_100g'] 	= +d['vitamin-c_100g'];
			d.calcium_100g 			= +d.calcium_100g;
			d.iron_100g 			= +d.iron_100g;
			d.energy_100g			= +d.energy_100g;
			d.additives_n 			= +d.additives_n;
			
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
		
			return (d.countries_tags != "") && (d3.max(ValuesPer100g) <= 100) && (d3.min(ValuesPer100g) >= 0);
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
		

		ByCountry = ByCountry.filter(function(d) {
			return (d.values.length > MinProducts)
		});

		// Add max / min / mean
		ByCountry.forEach(function(country){

			
			// Means calculation
			var meanFat 	= d3.mean(country.values, function(d) { return +d.fat_100g; }).toPrecision(4);
			var meanSatFat 	= d3.mean(country.values, function(d) { return +d['saturated-fat_100g']; }).toPrecision(4);
			var meanChol 	= d3.mean(country.values, function(d) { return +d.cholesterol_100g; }).toPrecision(4);
			var meanCarb 	= d3.mean(country.values, function(d) { return +d.carbohydrates_100g; }).toPrecision(4);
			var meanFib 	= d3.mean(country.values, function(d) { return +d.fiber_100g; }).toPrecision(4);
			var meanSug 	= d3.mean(country.values, function(d) { return +d.sugars_100g; }).toPrecision(4);
			var meanProt	= d3.mean(country.values, function(d) { return +d.proteins_100g; }).toPrecision(4);
			var meanSalt	= d3.mean(country.values, function(d) { return +d.salt_100g; }).toPrecision(4);
			var meanSod 	= d3.mean(country.values, function(d) { return +d.sodium_100g; }).toPrecision(4);
			var meanVitA	= d3.mean(country.values, function(d) { return +d['vitamin-a_100g']; }).toPrecision(4);
			var meanVitC	= d3.mean(country.values, function(d) { return +d['vitamin-c_100g']; }).toPrecision(4);
			var meanCal 	= d3.mean(country.values, function(d) { return +d.calcium_100g; }).toPrecision(4);
			var meanIron	= d3.mean(country.values, function(d) { return +d.iron_100g; }).toPrecision(4);
			var meanEner	= d3.mean(country.values, function(d) { return +d.energy_100g; }).toPrecision(4);
			country.means 	= [meanFat, meanSatFat, meanChol, meanCarb, meanFib, meanSug, meanProt,
								meanSalt, meanSod, meanVitA, meanVitC, meanCal, meanIron, meanEner];


							
			// Additional attributes
			country.selected = false;	// Set to True if country is selected in ranking div
			country.currentRank = 0; 	// Used to save current position in ranking
			country.formerRank = 0; 	// Used to get former position in ranking
			country.criteria = 0;
		});


		var maxFat 		= d3.max(ByCountry, function(d) { return +d.means[0]; });
		var maxSatFat 	= d3.max(ByCountry, function(d) { return +d.means[1]; });
		var maxChol 	= d3.max(ByCountry, function(d) { return +d.means[2]; });
		var maxCarb 	= d3.max(ByCountry, function(d) { return +d.means[3]; });
		var maxFib 		= d3.max(ByCountry, function(d) { return +d.means[4]; });
		var maxSug 		= d3.max(ByCountry, function(d) { return +d.means[5]; });
		var maxProt	    = d3.max(ByCountry, function(d) { return +d.means[6]; });
		var maxSalt	    = d3.max(ByCountry, function(d) { return +d.means[7]; });
		var maxSod 	    = d3.max(ByCountry, function(d) { return +d.means[8]; });
		var maxVitA	    = d3.max(ByCountry, function(d) { return +d.means[9]; });
		var maxVitC	    = d3.max(ByCountry, function(d) { return +d.means[10]; });
		var maxCal    	= d3.max(ByCountry, function(d) { return +d.means[11]; });
		var maxIron	    = d3.max(ByCountry, function(d) { return +d.means[12]; });
		var maxEner     = d3.max(ByCountry, function(d) { return +d.means[13]; });
		var ValMax 	= [maxFat, maxSatFat, maxChol, maxCarb, maxFib, maxSug, maxProt, maxSalt, maxSod, maxVitA, maxVitC, maxCal, maxIron, maxEner];


		ByCountry.forEach(function(country){
			for (var i=0;i<country.means.length;i++){
				country.means[i] = (country.means[i]/ValMax[i]*100).toPrecision(4);
			}
		})


	return ByCountry
}