# Data Pre-processing

The Data used for this project is extracted from this <a href="https://www.kaggle.com/openfoodfacts/world-food-facts"> Kaggle topic </a>.

The Data is provided by Open Food Facts, the free food products database :

"Open Food Facts is a free, open, collaborative database of food products from around the world, with ingredients, allergens, nutrition facts and all the tidbits of information we can find on product labels. "

Originally, the data is organised in a single table with 163 columns. The script __cleaner.py__ allows us to separate the columns of interest from the rest in order to reduce the size of the data file (originally 1.24Go). 

To do so, we create another csv file chosing only the columns based on the following criterias : 

- A column musn't be empty or lacking too much data : we computed the percentage of data presence within every column of interest and only kept the column that add at least 20% completion. 
- A column should have data that's well formed for treatment (raw text doesn't fit our study for example whereas data per 100g of food is very convenient)
- A column should contain a field that is of interest to our study (some nutrition factors may be irrelevant, and the list of ingredients adds too much weight to the data file for no gain)
- A product should have at least 50% of the columns filled to be eligible for the dataset 

The original data is extracted from this <a href="https://world.openfoodfacts.org/data"> website </a>.

After cleaning and selection of the columns, the file created is only 48.2Mo. We selected the following columns : 

<table>
	<tr>
		<td> Column name </td> 
		<td> Description </td>
		<td> Example </td> 
		<td> Relevant information </td> 
		<td> Filling percentage </td> 
	</tr>
	<tr>
		<td> countries_tag </td>
		<td> Country of the product as a tag </td> 
		<td> en:france </td> 
		<td> Tag normalizes the category </td> 
		<td> 99.95% </td>
	</tr>
	<tr>
		<td> energy_100g </td>
		<td> Energy value for 100g </td> 
		<td> 2243 </td> 
		<td> Value in Kj (1Kj = 0.239 Kcal) </td> 
		<td> 88.30% </td>
	</tr>
	<tr>
		<td> fat_100g </td>
		<td> Fat value for 100g </td> 
		<td> 28.57 </td> 
		<td> Value in grams </td> 
		<td> 85.13% </td>
	</tr>
	<tr>
		<td> saturated_fat_100g </td>
		<td> Saturated fat value for 100g </td> 
		<td> 10 </td> 
		<td> Value in grams </td> 
		<td> 80.12% </td>
	</tr>
	<tr>
		<td> cholesterol_100g </td>
		<td> Cholesterol value for 100g </td> 
		<td> 0.02 </td> 
		<td> Value in grams </td> 
		<td> 40.42% </td>
	</tr>
	<tr>
		<td> carbohydrates_100g </td>
		<td> Carbohydrates value for 100g </td> 
		<td> 53.33 </td> 
		<td> Value in grams </td> 
		<td> 85.07% </td>
	</tr>
	<tr>
		<td> sugars_100g </td>
		<td> Sugar value for 100g </td> 
		<td> 36.67 </td> 
		<td> Value in grams </td> 
		<td> 84.37% </td>
	</tr>
	<tr>
		<td> fiber_100g </td>
		<td> Fiber value for 100g </td> 
		<td> 6.7 </td> 
		<td> Value in grams </td> 
		<td> 62.83% </td>
	</tr>
	<tr>
		<td> proteins_100g </td>
		<td> Proteins value for 100g </td> 
		<td> 10 </td> 
		<td> Value in grams </td> 
		<td> 88% </td>
	</tr>
	<tr>
		<td> salt_100g </td>
		<td> Salt value for 100g </td> 
		<td> 0.21082 </td> 
		<td> Value in grams </td> 
		<td> 84.37% </td>
	</tr>
	<tr>
		<td> sodium_100g </td>
		<td> Sodium value for 100g </td> 
		<td> 0.083 </td> 
		<td> Value in grams </td> 
		<td> 87.35% </td>
	</tr>
	<tr>
		<td> vitamin_a_100g </td>
		<td> Vitamin A value for 100g </td> 
		<td> 0.007 </td> 
		<td> Value in grams </td> 
		<td> 38.59% </td>
	</tr>
	<tr>
		<td> vitamin_c_100g  </td>
		<td> Vitamin C value for 100g </td> 
		<td> 0.004 </td> 
		<td> Value in grams </td> 
		<td> 39.48% </td>
	</tr>
	<tr>
		<td> calcium_100g </td>
		<td> Calcium value for 100g </td> 
		<td> 0.058 </td> 
		<td> Value in grams </td> 
		<td> 39.52% </td>
	</tr>
	<tr>
		<td> iron_100g </td>
		<td> Iron value for 100g </td> 
		<td> 0.00935 </td> 
		<td> Value in grams </td> 
		<td> 39.39% </td>
	</tr>
</table>


