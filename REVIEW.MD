# Project review

Group to review : [911Vis](https://github.com/RenonDis/911Vis)

## Problem identification

The problem seems to be clearly identified. This group aims to highlight the repartition of Emergency 911 calls between December 2015 and March 2017.

They chose to illustrate three kinds of repartition :
- A time repartition (hour/day/month) 
- A geographical repartition (State)
- A category repartition (Fire, EMS, Traffic)

This project seems relevant with the available dataset. It will indeed use each column of the dataset, without losing information.
 
## Visualization choices

### Main charts

- __Heatmap__ to choose the focus day and visualize the number of calls seems interesting, information on the day of the week could also be relevant to display. 
- __Pie Chart__ with ranking on the most occurring incidents might be overkill. Where do you display it ? Focuses on one day ? multiple days ? 
- __Stacked bar chart__ might allow to visualize the subcategories for each day, but is that really necessary ? Don’t you think that’s too much, and the pie chart is self-sufficient ?

### Filter

Nothing to say

### Interactions

- __Zoom__ : Zoom on the heatmap for the month or the day (divide by hour ?) 
	To me the heatmap will be too big if it has to display the whole year

- __Reset__ : Seems essential so that the user can easily come back to the original visualization. However, a filtering action might not be appropriate here.

Overall, the project seems doable, even if the preprocessing phase might be time-consuming and the number of charts is important. Consider getting rid of one of them.

## Additional comments

- It isn't clear if all your charts are displayed at the same time, on a same view. Perhaps it would be useful to create a general template to see where your charts will be placed on a screen and how they will interact. Do some charts hide when an other one is clicked for example ? Do they all have the same size ? 

- Be careful when you create the second level of your pie chart : if there are spelling mistakes in the subcategory, you might get too many pie arcs.

- There’s a spelling mistake in "Readme.MD - Visualisations proposées - Base" : "moye" instead of "moyen"
