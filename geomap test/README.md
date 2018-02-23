A d3 world map which shows the states of Canada and the USA on zoom. Also has rotation, but only when scale is set to 1 (zoomed out).

I combined a world topo.json file with a states topo.json file using something like this:

    node_modules/.bin/topojson --allow-empty -p name -o combined2.json -- data/countries.topo.json data/states_usa.topo.json
    