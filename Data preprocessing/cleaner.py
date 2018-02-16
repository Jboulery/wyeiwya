import csv
import sys
import country
# Handle large ints
maxInt = sys.maxsize
decrement = True

while decrement:
    # decrease the maxInt value by factor 10 
    # as long as the OverflowError occurs.

    decrement = False
    try:
        csv.field_size_limit(maxInt)
    except OverflowError:
        maxInt = int(maxInt/10)
        decrement = True
        
# Opens the file downloaded directly from this link : https://world.openfoodfacts.org/data (csv file)
# Output is a file in the same folder named 'food_data.csv' with utf-8 encoding and selected data
# Change the paths if needed


with open('products.csv','r',encoding="utf-8") as tsvin:
    with open('food_data.csv', 'w',encoding='utf-8') as csvout:
        tsvin = csv.reader(tsvin, delimiter='\t')
        csvout = csv.writer(csvout,delimiter=',',lineterminator='\n')

        print('Les fichiers ont été correctement ouverts')
        count = 0
        # CSV Analysis
        for row in tsvin:
            count += 1
            if len(row) == 163:
            # Select all the desired elements and treat the country name, except for the first line
                countries = row[32].split(",")
                for e in countries:
                    data = [row[i] for i in [ 32, 42, 53, 159, 63, 65, 66, 100, 101, 102, 111, 112, 116, 117, 119, 124, 138, 140]]
                    CP = country.CountryProcessing(e)
                    data[0] = CP.correct()
                    #data[3] = e.split(":")[-1]


    
                    #data = [row[i] for i in [0, 7, 15, 32, 42, 53, 159, 63, 65, 66, 100, 101, 102, 111, 112, 116, 117, 119, 124, 138, 140]]
                   
                    # Relation table
                    # Row_nb : Attribute - % filled
                    ##########################
                    ### General Attributes
                    # 0   : Code - 100%
                    # 7   : Product Name - 97.22%
                    # 15  : Categories Tag - 28.11%
                    # 32  : Countries Tag - 99.95%
                    # 42  : Additives N - 86.57%
                    # 53  : Nutrition Grade FR - 77.75%
                    # 159 : Nutrition Score UK - 77.75
    
                    ## Per 100g Attributes
                    # Unit kJ ?
                    # 63  : Energy / 100g - 88.30%
                    # Unit g ?
                    # 65  : Fat / 100g - 85.13%
                    ### 66  : Saturated Fat / 100g - 80.12% (Part of Fat)
                    # 100 : Cholesterol / 100g - 40.42%
                    # 101 : Carbohydrates / 100g - 85.07%
                    ### 102 : Sugars / 100g - 84.37% (Part of Carbohydrates)
                    # 111 : Fiber / 100g - 62.83%
                    # 112 : Proteins / 100g - 88%
                    # 116 : Salt / 100g - 87.35%
                    ### 117 : Sodium / 100g - 87.35% (Part of Salt)
                    # 119 : Vitamin A / 100g - 38.59%
                    # 124 : Vitamin D / 100g - 39.48%
                    # 138 : Calcium / 100g - 39.52%
                    # 140 : Iron / 100g - 39.39%
    
                    # Show progression
                    if count % 10000 == 0:
                        print(count, ' lignes traitées')
    
                    attributes_100g_sum = 0
                    for attr in data[5:]:
                        if data.index(attr) in [6, 9, 13]:
                            continue
                        try:
                            attr = float(attr)
                            attributes_100g_sum += attr
                        except:
                            continue
    
                    if attributes_100g_sum > 100:
                        continue
    
                    # Add the row to the csv output file if not empty            
#                    if data[5:] != ['']*len(data[5:]):
#                        csvout.writerow(data)
                    #Check for percentage of emptyness
                    percentage = 0
                    for e in data:
                        if e == "":
                            percentage += 1
                    percentage = percentage/len(data)
                    if percentage < 0.5:
                        csvout.writerow(data)