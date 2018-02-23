function UpdateByCountry(ByCountry,proportions){


	ByCountry.forEach(function(country){
		var value = 0;
		for (var i =0; i< 13; i++) {
			value += proportions[i]*country.means[i]
		}
		country.criteria = value;

	})

}