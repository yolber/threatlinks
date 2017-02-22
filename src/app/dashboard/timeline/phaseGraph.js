import config from '../config';
import Filter from '../../utils/filterClass';

function phaseGraph() {
  const d3 = require('d3');

  const drawBarChart = ({
    barChart,
    width,
    height,
    scaleHeight,
    color
  }, events, startDate, endDate, activeTimestamps, highlightTimestamps) => {
    let max = 0;
    events = new Filter(events);
    events = events.reduceTo(config.timeline.type).unique(true);
    events = Object.keys(events).map(k => {
      const amount = Math.log(events[k]) + 1;
      max = max < amount ? amount : max;
      return {
        timestamp: parseInt(k, 10),
        amount
      };
    });



    const x = d3.scaleUtc()
      .domain([startDate, endDate])
      .range([2, width - 2]);

    const y = d3.scaleLinear()
      .domain([0, max])
      .range([height - scaleHeight, 0]);

    const xAxis = d3.axisBottom(x)
      .scale(x)
      .ticks(d3.timeDay, 1)
      .tickFormat(d3.timeFormat("%a%e"));

    const getColor = element => {
      if (highlightTimestamps.contains(element.timestamp)) {
        return config.highlightColor;
      } else if (activeTimestamps.contains(element.timestamp)) {
        return color;
      } else {
        return config.disabledColor;
      }
    };

    barChart.select(".xaxis")
      .call(xAxis);

    const bars = barChart.selectAll('.rectangle')
      .data(events, d => {
        return d;
      });

    bars.enter()
      .append('rect')
      .attr('class', 'rectangle')
      .attr('x', d => x(d.timestamp))
      .attr('y', d => y(d.amount))
      .attr('width', 10)
      .attr('height', d => height - y(d.amount) - scaleHeight)
      .attr("fill", getColor)
      .attr('stroke', "#353535");

    bars.attr('stroke', "#353535");

    bars.exit()
      .remove();
  };
  return {
    restrict: 'E',
    link: (scope, element) => {
      const state = scope.phase.state;
      const color = scope.color;
      const width = scope.width - config.margin;
      const height = document.querySelector('main').clientHeight * config.timeline.height;
      const scaleHeight = 20;
      const barChart = d3.select(element[0])
        .append('svg')
        .attr('width', width)
        .attr('height', height);
      barChart.append('g')
        .attr('class', 'xaxis')
        .attr('transform', `translate(0,${height - scaleHeight})`);
      state.subscribe(drawBarChart.bind(null, {
        barChart,
        width,
        height,
        scaleHeight,
        color
      }));
    }
  };
}

export default phaseGraph;
