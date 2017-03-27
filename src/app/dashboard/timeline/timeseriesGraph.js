import config from '../config';
import Filter from '../../utils/filterClass';

function phaseGraph() {
  const d3 = require('d3');

  const globals = {
    x: () => {},
    globalDispatch: () => {}
  };

  const mapColorsToPhases = (colorCodes, phases) => {
    const colors = {};
    for (const phase in phases) {
      if (phases.hasOwnProperty(phase)) {
        colors[phases[phase]] = {
          rgba: colorCodes[phase % 9].replace(/(#|\w{2})/g, match => {
            if (match === '#') {
              return '';
            }
            return `${parseInt(match, 16)},`;
          }),
          hex: colorCodes[phase]
        };
      }
    }
    return colors;
  };

  const resetBrush = () => {
    document.querySelector('g .brush .selection')
      .style.display = 'none';
    document.querySelector('g .brush .handle--e')
      .style.display = 'none';
    document.querySelector('g .brush .handle--w')
      .style.display = 'none';
    globals.filterBy(config.timeline.type, {});
  };

  const drawCircles = ({
    timeSeries,
    width,
    height,
    colorCodes,
    margin
  }, events, startDate, endDate, activeTimestamps, highlightTimestamps, phases = [], newData = false) => {
    if (newData) {
      resetBrush();
    }

    const colors = Object.assign({},
      mapColorsToPhases(colorCodes, phases),
      mapColorsToPhases([config.highlightColor, config.disabledColor], ['highlight', 'disabled']));

    events = new Filter(events);
    events = events.reduceTo(config.timeline.type, 'ThreatPhase').groupBy('ThreatPhase');
    let _events = [];
    let max = 0;
    events.forEach(phase => {
      const elements = new Filter(phase.elements).reduceTo(config.timeline.type).unique(true);
      phase.elements = Object.keys(elements).map(k => {
        max = elements[k] > max ? elements[k] : max;
        // console.log(new Date(parseInt(k, 10)) + elements[k] + phase.key);
        return {
          timestamp: parseInt(k, 10),
          amount: elements[k],
          phase: phase.key
        };
      });
      _events = [..._events, ...phase.elements];
    });

    events = _events;
    const x = d3.scaleUtc()
      .domain([startDate, endDate])
      .range([0 + margin.right, width - margin.left]);
    globals.x = x;

    const y = d3.scaleBand()
      .domain(phases)
      .range([height - margin.top, margin.bottom]);
    const getColor = (stroke, element) => {
      const opacity = ((element.amount / max) + 0.5) * 0.5;
      const e = {
        timestamp: element.timestamp,
        ThreatPhase: element.phase
      };
      if (stroke) {
        if (highlightTimestamps.contains(e)) {
          return `rgba(${colors.highlight.rgba} ${opacity})`;
        } else if (activeTimestamps.contains(e) && colors[element.phase]) {
          return `rgba(${colors[element.phase].rgba} ${opacity})`;
        } else {
          return `rgba(${colors.disabled.rgba} ${opacity})`;
        }
      } else if (activeTimestamps.contains(e) && colors[element.phase]) {
        return colors[element.phase].hex;
      } else {
        return colors.disabled.hex;
      }
    };

    const xAxis = d3.axisBottom(x)
    .ticks(d3.timeHour.every(4))
    .tickSize(-height, 0)
    .tickFormat(d => {
      const hour = d3.timeFormat("%H")(d);
      return hour === '00' ? d3.timeFormat("%d/%m/%y")(d) : hour;
    });

    d3.select("timeseries-graph .xaxis")
    .call(xAxis);

    const yAxis = d3.axisLeft(y)
    .ticks(phases.length)
    .tickSize(-width + margin.right, margin.left);

    d3.select("timeseries-graph .yaxis")
    .call(yAxis);

    d3.selectAll('.circ').remove();

    const times = timeSeries.selectAll('.circ')
      .data(events, d => {
      // return d[config.timeline.type] + d.phase;
        return d;
      });

    times.enter()
      .append('circle')
      .attr('class', 'circ')
      // .attr('cx', d => x(d[config.timeline.type]))
      .attr('cx', d => x(d.timestamp))
      .attr('cy', d => y(d.phase))
      .attr('r', d => Math.ceil(Math.log(d.amount) + 5))
      .attr('stroke', getColor.bind(null, true))
      .attr('fill', getColor.bind(null, false));

    times.attr('stroke', getColor.bind(null, true));
    times.attr('fill', getColor.bind(null, false));

    times.exit()
      .remove();
  };

  return {
    restrict: 'E',
    link: (scope, element) => {
      globals.filterBy = scope.timeseries.filterBy.bind(scope.timeseries);
      const state = scope.timeseries.state;
      const margin = {
        top: 0,
        right: 5,
        bottom: 15,
        left: 65
      };
      const width = scope.width - margin.left - margin.right - config.margin;
      const colorCodes = scope.$parent.timeline.colorCodes;
      // const height = (document.querySelector('main').clientHeight *
      //  (1 - config.timeline.height - config.timeline.title - config.metadata.height)) -
      // margin.top - margin.bottom - config.margin;
      const height = document.querySelector('#timeseries').clientHeight - 30;
      const svg = d3.select(element[0])
      .append('svg')
      .attr('width', width + margin.right + margin.left)
      .attr('height', height + margin.top + margin.bottom)
      .attr("class", "timeseries-graph-svg-component");

      const context = svg.append('g')
      .attr('class', 'context')
      .attr('transform', `translate(${margin.left},${margin.top})`);

      context.append('g')
      .attr('class', 'xaxis')
      .attr('transform', `translate(${margin.left},${(margin.top + (height - margin.bottom))})`);

      context.append('g')
      .attr('class', 'yaxis')
      .attr('transform', `translate(${margin.left},${margin.top})`);

      const timeSeries = context.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

      const brush = d3.brushX();

      brush.on('brush', function () {
        const [start, end] = d3.brushSelection(this);
        const gt = Date.parse(globals.x.invert(start));
        const lt = Date.parse(globals.x.invert(end));
        globals.filterBy(config.timeline.type, {
          gt,
          lt
        });
      });
      brush.on('end', function () {
        if (d3.brushSelection(this) === null) {
          globals.filterBy(config.timeline.type, {});
        }
      });

      timeSeries.append('g')
      .attr('class', 'brush')
      .call(brush);

      state.subscribe(drawCircles.bind(null, {
        timeSeries,
        width,
        height,
        colorCodes,
        margin
      }), 2);
    }
  };
}

export default phaseGraph;
