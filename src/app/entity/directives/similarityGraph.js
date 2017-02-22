import config from '../config';
import Tooltip from '../../utils/tooltip';

function similarityGraph() {
  const d3 = require('d3');

  const ref = `http://${document.location.hostname}:${document.location.port}/#/entity/`;

  const getCoordinates = (data, name) => {
    for (const object of data) {
      if (object.name === name) {
        return object.coordinates;
      }
    }
    return [];
  };

  const draw = (chart, data, x, y, entityId, tip) => {
    const a = getCoordinates(data, entityId);
    // const sizes = [12, 10, 8, 6, 4];
    const getDistanceIndex = b => {
      const distance = Math.sqrt((a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]));
      const index = Math.ceil(distance / 0.5);
      return index > 4 ? 4 : index;
    };

    d3.selectAll('.circ').remove();

    chart
      .selectAll('.circ')
      .data(data, d => d.name)
      .enter()
      .append('circle')
      .attr('class', 'circ')
      .attr('cx', d => x(d.coordinates[0]))
      .attr('cy', d => y(d.coordinates[1]))
      .attr('r', d => {
        d.distId = getDistanceIndex(d.coordinates);
        return (d.distId === 0 ? 10 : 4);
      })
      // .attr('r', d => {
      //   d.distId = getDistanceIndex(d.coordinates);
      //   return sizes[d.distId];
      // })
      .attr('fill', d => d.distId === 0 ? '#FF0036' : '#353501')
      .attr('stroke', 'black')
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)
      .on('click', d => {
        window.location.href = ref + d.name;
        return;
      });

    chart.exit().remove();
  };
  return {
    restrict: 'E',
    scope: {
      data: "=data",
      bounds: "=bounds",
      entityId: "=entityId"
    },
    link: (scope, element) => {
      const main = document.querySelector('main');
      const height = config.similarity.graphHeight - 30;
      const width = main.clientWidth * 0.3;
      const entityId = scope.$parent.entity.entityId;
      const similarityChart = d3.select(element[0])
        .append('svg')
        .attr('height', `${height}px`)
        .attr('width', `${width}px`);
      const tip = new Tooltip(element[0], d => d.name);

      let x = d3.scaleLinear()
        .domain([scope.bounds.x.min * 1.2, scope.bounds.x.max * 1.2])
        .range([0, width]);
      let y = d3.scaleLinear()
        .domain([scope.bounds.y.min * 1.2, scope.bounds.y.max * 1.2])
        .range([height, 0]);
      scope.$watch('data', data => {
        x = x.domain([scope.bounds.x.min * 1.2, scope.bounds.x.max * 1.2]);
        y = y.domain([scope.bounds.y.min * 1.2, scope.bounds.y.max * 1.2]);
        draw(similarityChart, data, x, y, entityId, tip);
      });
    }
  };
}

export default similarityGraph;
