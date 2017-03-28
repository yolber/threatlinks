function featureGraph() {
  const d3 = require('d3');
  return {
    restrict: 'E',
    scope: {
      data: "=data",
      max: "=max"
    },
    link: (scope, element) => {
      const main = document.querySelector('main');
      const height = 60;
      const width = main.clientWidth * 0.2;
      const barChart = d3.select(element[0])
        .append('svg')
        .attr('height', `${height}px`)
        .attr('width', `${width}px`);

      const x = d3.scaleUtc()
        .domain([scope.$parent.$parent.entity.startDate, scope.$parent.$parent.entity.endDate])
        .range([0, width]);
      const y = d3.scaleLinear()
        .domain([0, scope.max])
        .range([height, 0]);

      barChart
        .selectAll('rect')
        .data(scope.data, d => d.timestamp)
        .enter()
        .append('rect')
        .attr('x', d => x(new Date(d.timestamp)))
        .attr('y', d => y(d.count))
        .attr('width', 2)
        .attr('height', d => height - y(d.count));
    }
  };
}

export default featureGraph;
