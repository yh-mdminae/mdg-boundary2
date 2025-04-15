const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
svg.setAttribute("width", "100%");
svg.setAttribute("height", "100%");
document.body.appendChild(svg);

const color = d3.scaleSequential(d3.interpolateOranges);
let features = [];
let path;

function drawMap(data) {
  const values = Object.values(data);
  color.domain([Math.min(...values), Math.max(...values)]);

  d3.select("svg").selectAll("path")
    .data(features)
    .enter().append("path")
    .attr("d", d => path(d))
    .attr("fill", d => {
      const name = d.properties.shapeName;
      return data[name] != null ? color(data[name]) : "#ccc";
    })
    .attr("stroke", "#fff");
}

fetch("https://yh-mdminae.github.io/mdg-boundary2/geoBoundaries-MDG-ADM2.topojson")
  .then(response => response.json())
  .then(topo => {
    features = topojson.feature(topo, topo.objects["MDGADM2gbOpen"]).features;

    const projection = d3.geoMercator().fitSize([window.innerWidth, window.innerHeight], {
      type: "FeatureCollection",
      features: features
    });

    path = d3.geoPath().projection(projection);

    if (typeof google !== 'undefined' && google.visualization) {
      google.visualization.events.addListener(window, 'onData', (dsResponse) => {
        const rows = dsResponse.tables.DEFAULT.rows;
        const data = {};
        rows.forEach(row => {
          const name = row.c[0].v;
          const value = row.c[1].v;
          data[name] = value;
        });
        drawMap(data);
      });
    } else {
      drawMap({
        "Maintirano": 60,
        "Morondava": 45,
        "Toamasina I": 80
      });
    }
  });
