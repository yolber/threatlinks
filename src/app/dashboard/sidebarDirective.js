'use strict';
import Filter from '../utils/filterClass';
import {toggleRemoveElements, highlightExactGroup, resetHighlight, filterChart} from './state/actions';
import config from './config';
// import {
//  $
// } from '../utils/domUtils';

class SidebarController {
  constructor($scope) {
    this.segments = [];
    this.globalDispatch = $scope.dashboard.globalDispatch.bind($scope.dashboard);
    $scope.$watch('dashboard.events', events => {
          /* $scope.rowdata = data.map(function (row) {
          row.score = parseInt(row.score);
          if (row.score < 0 || isNaN(row.score)) {
              row.score = -1;
              row.borderStyle = { borderColor : 'lightgrey' };
          } else {
              row.borderStyle = { borderColor : colorInterpolate(row.score) };
          }
          return row;
      });*/
      this.updateSidebar(events);
    });
    /*
    $scope.$watch('attack-phases.height', height => {
      $.style(document.querySelector(''), {
        height: `${height}px`
      });
    });*/
  }
  updateSidebar(events) {
    const d3 = require('d3');
    const colorInterpolate = d3.scaleLinear()
          .domain([1, 10])
          .interpolate(d3.interpolateRgb)
          .range(['#DF928E','#FF0036']);
    const segments = [];
    events = new Filter(events);
    config.sidebar.selection.forEach(key => {
      const all = (new Filter(events)).groupBy(key, true);
      let elements = events.reduceTo(key)
        .unique()
        .sort()
        .map(e => {
          const total = all[e] ? all[e].length : 0;
          return {
            id: e,
            count: total,
            toggled: false,
            borderStyle: {borderColor: colorInterpolate(total)}
          };
        });
      elements = new Filter(elements).dynamicSort("count");
      const obj = {
        name: key,
        elements
      };
      segments.push(obj);
    });
    this.segments = segments;
  }

  toggleRemove() {
    this.globalDispatch(toggleRemoveElements());
  }

  elementMouseover(key, element) {
    this.globalDispatch(highlightExactGroup(key, element));
  }
  elementMouseout() {
    this.globalDispatch(resetHighlight());
  }
  elementClick(key, element) {
    element.toggled = !element.toggled;
    this.globalDispatch(filterChart(key, element.id));
  }

}

SidebarController.$inject = ['$scope'];

function sidebarDirective() {
  return {
    restrict: 'E',
    templateUrl: 'app/dashboard/sidebarDirective.html',
    controller: SidebarController,
    controllerAs: 'sidebar'
  };
}

export default sidebarDirective;
