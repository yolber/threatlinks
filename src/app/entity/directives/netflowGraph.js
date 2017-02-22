import config from '../config';
import Filter from '../../utils/filterClass';
import displayNamesFilter from '../../utils/displayNamesFilter';
import Tooltip from '../../utils/tooltip';

function featureGraph() {
  const d3 = require('d3');

  const draw = (chart, height, axesSpace, tip, data, x, y, alerts) => {
    const xAxis = d3.axisBottom(x).ticks(18)
      // .ticks(d3.timeHour.every(4))
      .tickSize(5)
      .tickFormat(d => {
        const hour = d3.timeFormat("%H")(d);
        return hour === '00' ? d3.timeFormat("%d/%m/%y")(d) : hour;
      });

    const yAxis = d3.axisLeft(y)
      .ticks(10)
      .tickSize(5);

    d3.select('netflow-graph .xaxis').call(xAxis);
    d3.select('netflow-graph .yaxis').call(yAxis);

    const lines = chart
      .selectAll('rect')
      .data(data, d => d.timestamp);

    lines.enter()
      .append('rect')
      .attr('x', d => x(new Date(d.timestamp)))
      .attr('y', d => y(d.number))
      .attr('width', 2)
      .attr('height', d => height - y(d.number) - axesSpace.bottom);

    lines.exit()
      .remove();

    const circles = chart
      .selectAll('circle')
      .data(alerts, d => d[0].timestamp);

    circles.enter()
      .append('circle')
      .attr('cx', d => {
        const c = (new Filter(data)).filterRelative('timestamp', {
          gt: d[0].timestamp - 3600,
          lt: d[0].timestamp + 3600
        })[0];
        return c ? x(new Date(c.timestamp)) : x(new Date(d[0].timestamp));
      })
      .attr('cy', d => {
        const c = (new Filter(data)).filterRelative('timestamp', {
          gt: d[0].timestamp - 3600,
          lt: d[0].timestamp + 3600
        })[0];
        return c ? y(c.number) - d.length - 3 : height - axesSpace.bottom - d.length - 3;
      })
      .attr('r', d => d.length + 3)
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

    circles.exit().remove();
  };

  return {
    restrict: 'E',
    scope: {
      data: "=data",
      max: "=max",
      alerts: "=alerts"
    },
    link: (scope, element) => {
      const main = document.querySelector('main');
      const height = config.netflow.graphHeight;
      const width = main.clientWidth * 0.63;
      let data = [];
      let alerts = [];
      const axesSpace = {
        left: 70,
        bottom: 20
      };
      let x = d3.scaleTime()
        .domain([scope.$parent.entity.startDate, scope.$parent.entity.endDate])
        .range([axesSpace.left + 1, width - axesSpace.left]);
      let y = d3.scaleLinear()
        .domain([0, scope.max])
        .range([height - axesSpace.bottom, ((height - axesSpace.bottom) * 0.1)]);

      const xAxis = d3.axisBottom(x).ticks(18)
        // .ticks(d3.timeHour.every(4));
        .tickSize(5)
        .tickFormat(d => {
          const hour = d3.timeFormat("%H")(d);
          return hour === '00' ? d3.timeFormat("%d/%m/%y")(d) : hour;
        });

      const yAxis = d3.axisLeft(y)
        .ticks(10)
        .tickSize(5);

      const svg = d3.select(element[0])
        .append('svg')
        .attr('height', `${height}px`)
        .attr('width', `${width}px`);

      svg.append('g')
        .attr('class', 'xaxis')
        .attr('transform', `translate(0,${height - axesSpace.bottom})`)
        .call(xAxis);

      svg.append('g')
        .attr('class', 'yaxis')
        .attr('transform', `translate(${axesSpace.left},0)`)
        .call(yAxis);

      const barChart = svg.append('g');

      const tip = new Tooltip(element[0], d => {
        const html = [];
        const displayNames = displayNamesFilter();
        const data = (new Filter(d)).reduceTo('analyticsType').unique(true);
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            html.push(`<div>${data[key]} - ${displayNames(key)}</div>`);
          }
        }
        return html.join('\n');
      });

      const clean = draw.bind(null, barChart, height, axesSpace, tip, [], x, y, []);
      const update = draw.bind(null, barChart, height, axesSpace, tip);

      scope.$watch('data', _data => {
        y = y.domain([0, scope.max]);
        data = _data;
        clean();
        update(data, x, y, alerts);
      });

      scope.$watch('alerts', _alerts => {
        y = y.domain([0, scope.max]).range([height - axesSpace.bottom, ((height - axesSpace.bottom) * 0.1)]);
        alerts = _alerts;
        clean();
        update(data, x, y, alerts);
      });

      scope.$watch('$parent.entity.startDate', startDate => {
        if (startDate) {
          clean();
          x = x.domain([startDate, scope.$parent.entity.endDate]).range([axesSpace.left + 1, width - axesSpace.left]);
          update(data, x, y, alerts);
        }
      });

      scope.$watch('$parent.entity.endDate', endDate => {
        if (endDate) {
          x = x.domain([scope.$parent.entity.startDate, endDate]).range([axesSpace.left + 1, width - axesSpace.left]);
          clean();
          update(data, x, y, alerts);
        }
      });
    }
  };
}

export default featureGraph;
