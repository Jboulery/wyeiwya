# Data Pre-processing

The Data used for this project is extracted from this <a href="https://www.kaggle.com/openfoodfacts/world-food-facts"> Kaggle topic </a>.

The Data is provided by Open Food Facts, the free food products database :

"Open Food Facts is a free, open, collaborative database of food products from around the world, with ingredients, allergens, nutrition facts and all the tidbits of information we can find on product labels. "

Originally, the data is organised in a single table with 163 columns. The script __cleaner.py__ allows us to separate the columns of interest from the rest in order to reduce the size of the data file (1.24Go). 

To do so, we create another csv file chosing only the columns based on the following criterias : 

- A column musn't be empty or lacking too much data
- A column should have data that's well formed for treatment (raw text doesn't fit our study for example)
- A column should contain a field that is of interest to our study

The original data is extracted from this <a href="https://world.openfoodfacts.org/data"> website </a>.

After cleaning and selection of the columns, the file created is only 60Mo (compression rate is about 21).



