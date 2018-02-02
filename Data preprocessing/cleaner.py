import csv 

# Opens the file downloaded directly from this link : https://world.openfoodfacts.org/data (csv file)
# Output is a file in the same folder named 'food_data.csv' with utf-8 encoding and selected data
# Change the paths if needed
with open('en.openfoodfacts.org.products.csv','r',encoding="utf-8") as tsvin, open('food_data.csv', 'w',encoding='utf-8') as csvout:
    tsvin = csv.reader(tsvin, delimiter='\t')
    csvout = csv.writer(csvout,delimiter=',')
    # i is to debug the iterations and see the progression of the cleaning (approx 350000 rows)
    i=0
    for row in tsvin:
        if len(row)==163:
            # select all the desired elements
            code = row[0] 
            product_name=row[7]
            categories_tag = row[15]
            origins_tag=row[18]
            #labels_tags=row[22]
            countries_tag=row[32]
            #ingredients_text=row[34]
            #traces_tag=row[38]
            #serving_size=row[40]
            additives_n=row[42]
            #additives=row[43]
            #ingredients_from_palm_oil_n =row[46]
            #ingredients_that_may_be_from_palm_oil_n=row[49]
            #nutrition_grade_uk=row[52]
            nutrition_grade_fr=row[53]
            #main_category=row[59]
            energy_100g=row[63]
            fat_100g=row[65]
            saturated_fat_100g=row[66]
            monounsaturated_fat_100g=row[81]
            polyunsaturated_fat_100g=row[82]
            cholesterol_100g=row[100]
            carbohydrates_100g=row[101]
            sugars_100g=row[102]
            fiber_100g=row[111]
            proteins_100g =row[112]
            salt_100g=row[116]
            sodium_100g=row[117]
            #alcohol_100g=row[118]
            vitamin_a_100g =row[119]
            vitamin_d_100g=row[121]
            vitamin_c_100g=row[124]
            potassium_100g=row[136]
            calcium_100g=row[138]
            iron_100g=row[140]
            magnesium_100g=row[141]
            #zinc_100g =row[142]
            #copper_100g=row[143]
            #manganese_100g=row[144]
            #caffeine_100g=row[150]
            #taurine_100g=row[151]
            nutrition_score_uk_100g=row[159]
            # Add them to an array that will be written into the csv output file 
            data = [code,product_name,categories_tag,origins_tag,countries_tag,additives_n]
            data += [nutrition_grade_fr]
            data += [energy_100g,fat_100g,saturated_fat_100g,monounsaturated_fat_100g,polyunsaturated_fat_100g,cholesterol_100g,carbohydrates_100g]
            data += [sugars_100g,fiber_100g,proteins_100g,salt_100g,sodium_100g,vitamin_a_100g,vitamin_d_100g,vitamin_c_100g,potassium_100g]
            data += [calcium_100g,iron_100g,magnesium_100g,nutrition_score_uk_100g]
            # show the number of the current iteration 
            print(i)
            i+=1
            # add the row to the csv output file 
            csvout.writerow(data)
