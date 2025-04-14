
<!DOCTYPE html>
<html>
  <head>
    <script src="https://d3js.org/d3.v6.min.js"></script>
    <script src="https://d3js.org/topojson.v2.min.js"></script>
    <style>
      body { margin: 0; }
      svg { width: 100%; height: 100vh; }
    </style>
  </head>
  <body>
    <svg></svg>
    <script>
      const svg = d3.select("svg");
      const color = d3.scaleSequential(d3.interpolateOranges);
      let features = [];
      let path;

      fetch("https://yh-mdminae.github.io/mdg-boundary2/geoBoundaries-MDG-ADM2.topojson")
        .then(response => response.json())
        .then(topo => {
          features = topojson.feature(topo, topo.objects["MDGADM2gbOpen"]).features;

          const projection = d3.geoMercator().fitSize([window.innerWidth, window.innerHeight], {
            type: "FeatureCollection",
            features: features
          });

          path = d3.geoPath().projection(projection);

          drawMap({
            "Maintirano": 60,
            "Morondava": 45,
            "Toamasina I": 80
          });
        });

      function drawMap(data) {
        const values = Object.values(data);
        color.domain([Math.min(...values), Math.max(...values)]);

        svg.selectAll("path")
          .data(features)
          .enter().append("path")
          .attr("d", d => path(d))
          .attr("fill", d => {
            const name = d.properties.shapeName;
            return data[name] != null ? color(data[name]) : "#ccc";
          })
          .attr("stroke", "#fff");
      }
    </script>
  </body>
</html>
