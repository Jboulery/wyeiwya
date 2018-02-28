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


		var globalmaxFat 		= 100 //d3.max(data, function(d) { return +d.fat_100g;  });
		var globalmaxSatFat 	= 100 //d3.max(data, function(d) { return +d['saturated-fat_100g'];  });
		var globalmaxChol 		=  0.04//d3.max(data, function(d) { return +d.cholesterol_100g; });
		var globalmaxCarb 		= 100 //d3.max(data, function(d) { return +d.carbohydrates_100g; });
		var globalmaxFib 		= 100 //d3.max(data, function(d) { return +d.fiber_100g; });
		var globalmaxSug 		= 100 //d3.max(data, function(d) { return +d.sugars_100g;  });
		var globalmaxProt	    = 100 //d3.max(data, function(d) { return +d.proteins_100g;  });
		var globalmaxSalt	    = 100 //d3.max(data, function(d) { return +d.salt_100g; });
		var globalmaxSod 	    = d3.max(data, function(d) { return +d.sodium_100g;});
		var globalmaxVitA	    = d3.max(data, function(d) { return +d['vitamin-a_100g'];  });
		var globalmaxVitC	    = d3.max(data, function(d) { return +d['vitamin-c_100g']; });
		var globalmaxCal    	= d3.max(data, function(d) { return +d.calcium_100g;});
		var globalmaxIron	    = d3.max(data, function(d) { return +d.iron_100g; });
		var globalmaxEner       = 2500 //d3.max(data, function(d) { return +d.energy_100g; });

		var ValMax = [globalmaxFat, globalmaxSatFat, globalmaxChol, globalmaxCarb, globalmaxFib, globalmaxSug, globalmaxProt, globalmaxSalt, globalmaxSod, globalmaxVitA, globalmaxVitC, globalmaxCal, globalmaxIron, globalmaxEner];

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
			var meanFat 	= d3.mean(country.values, function(d) { return +d.fat_100g; });
			var meanSatFat 	= d3.mean(country.values, function(d) { return +d['saturated-fat_100g']; });
			var meanChol 	= d3.mean(country.values, function(d) { return +d.cholesterol_100g; });
			var meanCarb 	= d3.mean(country.values, function(d) { return +d.carbohydrates_100g; });
			var meanFib 	= d3.mean(country.values, function(d) { return +d.fiber_100g; });
			var meanSug 	= d3.mean(country.values, function(d) { return +d.sugars_100g; });
			var meanProt	= d3.mean(country.values, function(d) { return +d.proteins_100g; });
			var meanSalt	= d3.mean(country.values, function(d) { return +d.salt_100g; });
			var meanSod 	= d3.mean(country.values, function(d) { return +d.sodium_100g; });
			var meanVitA	= d3.mean(country.values, function(d) { return +d['vitamin-a_100g']; });
			var meanVitC	= d3.mean(country.values, function(d) { return +d['vitamin-c_100g']; });
			var meanCal 	= d3.mean(country.values, function(d) { return +d.calcium_100g; });
			var meanIron	= d3.mean(country.values, function(d) { return +d.iron_100g; });
			var meanEner	= d3.mean(country.values, function(d) { return +d.energy_100g; });
			country.means 	= [meanFat, meanSatFat, meanChol, meanCarb, meanFib, meanSug, meanProt,
								meanSalt, meanSod, meanVitA, meanVitC, meanCal, meanIron, meanEner];


							
			// Additional attributes
			country.selected = false;	// Set to True if country is selected in ranking div
			country.currentRank = 0; 	// Used to save current position in ranking
			country.formerRank = 0; 	// Used to get former position in ranking
			country.criteria = 0;
		});


		var ValMaxMoy;

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
		ValMaxMoy 	= [maxFat, maxSatFat, maxChol, maxCarb, maxFib, maxSug, maxProt, maxSalt, maxSod, maxVitA, maxVitC, maxCal, maxIron, maxEner];

		ByCountry.forEach(function(country){
			// normalized means
			var normalized = []
			for (var i=0;i<country.means.length;i++){
				normalized.push((country.means[i]/ValMaxMoy[i]*100).toPrecision(4));
			}
			country.normalized = normalized;
			// normalized products
			var normvalues = []
			for (var j=0;j<country.values.length;j++){
				var newval = {};
				newval.fat_100g = (country.values[j].fat_100g/globalmaxFat)*100;
				newval['saturated-fat_100g'] = (country.values[j]['saturated-fat_100g']/globalmaxSatFat)*100;
				newval.cholesterol_100g = (country.values[j].cholesterol_100g/globalmaxChol)*100;
				newval.carbohydrates_100g = (country.values[j].carbohydrates_100g/globalmaxCarb)*100;
				newval.fiber_100g = (country.values[j].fiber_100g/globalmaxFib)*100;
				newval.sugars_100g = (country.values[j].sugars_100g/globalmaxSug)*100;
				newval.proteins_100g = (country.values[j].proteins_100g/globalmaxProt)*100;
				newval.salt_100g = (country.values[j].salt_100g/globalmaxSalt)*100;
				newval.sodium_100g = (country.values[j].sodium_100g/globalmaxSod)*100;
				newval['vitamin-a_100g'] = (country.values[j]['vitamin-a_100g']/globalmaxVitA)*100;
				newval['vitamin-c_100g'] = (country.values[j]['vitamin-c_100g']/globalmaxVitC)*100;
				newval.calcium_100g = (country.values[j].calcium_100g/globalmaxCal)*100;
				newval.iron_100g = (country.values[j].iron_100g/globalmaxIron)*100;
				newval.energy_100g = (country.values[j].energy_100g/globalmaxEner)*100;
				
				if (Math.max(...Object.values(newval)) <= 100) {
					normvalues.push(newval);
				}
				
			}
			country.normalizedvalues = normvalues;
			})

	return ByCountry
}