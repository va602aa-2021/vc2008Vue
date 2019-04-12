/**
 *
 *  This module will display a map with a symbol encoding for a set of geographical elements
 */

const d3 = require('d3');

export default function MapWithLayers() {
  let projection = d3.geoMercator();
  let scale = 100; // default value for scale
  let center = [0, 0]; // default value for centering the map
  let path;
  let featureClass = 'name'; // define a property whose value is used as class

  function me(selection) {
    const boundaries = selection.node().parentNode.getBoundingClientRect();
    projection = d3.geoMercator()
      .scale(scale)
      .center(center)
      .translate([boundaries.width / 2, boundaries.height / 2]);

    path = d3.geoPath().projection(projection);

    // create a group container for map
    const paths = selection.selectAll('path')
      .data(selection.datum().features);

    paths.exit().remove();

    paths.enter()
      .append('path')
      .attr('class', (d) => {
        if (d[featureClass]) {
          return d[featureClass];
        }
        return 'none';
      });

    selection.selectAll('path').attr('d', path);
  }


  // getter and setter for variable scale
  me.scale = function _scale(_) {
    if (!arguments.length) return scale;
    scale = _;
    projection.scale(scale);

    return me;
  };

  // getter and setter for variable center
  me.center = function _center(_) {
    if (!arguments.length) return center;
    center = _;
    projection.center(center);

    return me;
  };

  // getter and setter for variable center
  me.featureClass = function _featureClass(_) {
    if (!arguments.length) return featureClass;
    featureClass = _;

    return me;
  };

  return me;
}
