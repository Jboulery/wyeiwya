import csv 

# Opens the file downloaded directly from this link : https://world.openfoodfacts.org/data (csv file)
# Output is a file in the same folder named 'food_data.csv' with utf-8 encoding and selected data
# Change the paths if needed
with open('D:/ECL/S9/MOS 5.5 Dataviz/en.openfoodfacts.org.products.csv','r',encoding="utf-8") as tsvin, open('food_data.csv', 'w',encoding='utf-8') as csvout:
    tsvin = csv.reader(tsvin, delimiter='\t')
    csvout = csv.writer(csvout,delimiter=',',lineterminator='\n')
    # i is to debug the iterations and see the progression of the cleaning (approx 350000 rows)
    i=0
    for row in tsvin:
        if len(row)==163:
            # select all the desired elements
            code = row[0]  #100% filled
            product_name=row[7] #97.22% filled
            categories_tag = row[15] #28.11% filled
            countries_tag=row[32] #99.95% filled
            additives_n=row[42] #86.57% filled
            nutrition_grade_fr=row[53] #77.75% filled
            energy_100g=row[63] #88.30% filled
            fat_100g=row[65] #85.13% filled
            saturated_fat_100g=row[66] #80.12% filled
            cholesterol_100g=row[100] #40.42% filled 
            carbohydrates_100g=row[101] #85.07% filled
            sugars_100g=row[102] #84.37% filled
            fiber_100g=row[111] #62.83% filled
            proteins_100g =row[112] #88% filled
            salt_100g=row[116] #87.35% filled
            sodium_100g=row[117] #87.35% filled 
            vitamin_a_100g =row[119] #38.59% filled 
            vitamin_c_100g=row[124] #39.48% filled 
            calcium_100g=row[138] #39.52% filled
            iron_100g=row[140] #39.39% filled
            nutrition_score_uk_100g=row[159] #77.75%
            # Testing the presence of data in some columns

            # Add them to an array that will be written into the csv output file 
            data = [code,product_name,categories_tag,countries_tag,additives_n,nutrition_grade_fr,energy_100g,fat_100g,saturated_fat_100g]
            data += [cholesterol_100g,carbohydrates_100g,sugars_100g,fiber_100g,proteins_100g,salt_100g,sodium_100g]
            data += [vitamin_a_100g,vitamin_c_100g,calcium_100g,iron_100g,nutrition_score_uk_100g]
            # show the number of the current iteration 
            print(i)
            i+=1
            # add the row to the csv output file 
            csvout.writerow(data)
        
