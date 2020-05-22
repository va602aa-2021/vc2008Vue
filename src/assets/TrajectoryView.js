const d3 = require('d3');

export default function Trajectories() {
  let container;
  let paths;
  let cellSize = 7.5;

  const dispatch = d3.dispatch('interval');

  const x = d3.scaleLinear()
    .domain([0, 91])
    .range([cellSize * 0.5, (91 * cellSize) + (cellSize * 0.5)]);

  const y = d3.scaleLinear()
    .domain([0, 60])
    .range([(60 * cellSize) + (cellSize * 0.5), cellSize * 0.5]);

  const path = d3.line()
    .x(d => x(d.x))
    .y(d => y(d.y));

  let timeExtent = [0, 10];

  function isWithin(p, e) {
    return ((p.x >= e[0][0]) && (p.x <= e[1][0])
      && (p.y >= e[1][1]) && (p.y <= e[0][1]));
  }


  function brushended() {
    if (!d3.event.selection) {
      // console.log('empty selection');
      return;
    }

    // the extent measured in pixel should be mapped back to domain coordinates
    const extent =
      d3.event.selection.map(c => [x.invert(c[0]), y.invert(c[1])])
    ;
    // console.log('original extent', d3.event.selection);
    // console.log('new extent', extent);
    const list = [];
    container.datum().forEach((p) => { // for each person
      const lastPoint = p.values[timeExtent[1] - 1];
      // console.log(isWithin(lastPoint, extent), {p:lastPoint, e: extent});
      if (isWithin(lastPoint, extent)) {
        // console.log({ p: lastPoint, e: extent });
        list.push({
          id: p.person,
        });
      }
    });
    // console.log('list', list.length);
    dispatch.call('interval', this, list);
  }

  const brush = d3.brush()
    .on('end', brushended);

  function me(selection) {
    // draw all trajectories
    container = selection;
    paths = container.selectAll('path')
      .data(container.datum(), d => d.person);

    paths = paths
      .enter()
      .append('path')
      .merge(paths)
      .attr('stroke-width', 2)
      .attr('stroke', 'black')
      .attr('fill', 'none')
      .attr('opacity', 0.4);

    paths.attr('d', d => `${path(d.values.slice(timeExtent[0], timeExtent[1]))}m -2, 0 a 2,2 0 1,0 4,0 a 2,2 0 1,0 -4,0 `);

    container.append('g')
      .attr('class', 'brush')
      .call(brush);


    // handler for selection of events
  }

  me.on = function (eventType, handler) {
    dispatch.on(eventType, handler);

    return me;
  };

  me.timeExtent = function _timeExtent(_) {
    if (!arguments.length) return timeExtent;
    timeExtent = _;

    // var paths = container.selectAll("path")
    // .data(container.datum(), function(d){return d.person});
    paths.attr('d', d => `${path(d.values.slice(timeExtent[0], timeExtent[1]))}m -2, 0 a 2,2 0 1,0 4,0 a 2,2 0 1,0 -4,0 `);

    return me;
  };


  me.cellSize = function _cellSize(_) {
    if (!arguments.length) return cellSize;
    cellSize = _;
    x.range([cellSize * 0.5, (91 * cellSize) + (cellSize * 0.5)]);
    y.range([(60 * cellSize) + (cellSize * 0.5), cellSize * 0.5]);

    return me;
  };

  // function brushed() {
  //   // to implement on-the-fly render during selection
  //
  // }


  return me;
}
