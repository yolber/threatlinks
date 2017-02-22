import config from '../config';
import Filter from '../../utils/filterClass';
import {
  filterChart,
  highlightExactGroup,
  resetHighlight
} from '../state/actions';

class MetadataController {
  constructor($scope) {
    this.metadata = [];
    this.$scope = $scope;
    this.state = $scope.phase.state;
    this.name = $scope.name;
    this.state.subscribe(this.convertData.bind(this), 1, ['UPDATE_EVENTS', 'FILTER_CHART']);
    this.globalDispatch = $scope.$parent.$parent.$parent.dashboard.globalDispatch.bind($scope.$parent.$parent.$parent.dashboard);
  }

  convertData(activeEvents, events, selection, highlight) {
    const data = [];
    const activeElements = selection[config.metadata.sorting] ? selection[config.metadata.sorting].phases[this.name] || [] : [];
    events = new Filter(events);
    activeEvents = (new Filter(activeEvents)).groupBy(config.metadata.sorting, true);
    highlight = highlight.reduceTo(config.metadata.sorting).unique();
    events.groupBy(config.metadata.sorting).forEach(group => {
      const gElements = new Filter(group.elements);
      const elements = [];
      config.metadata.selection.forEach(key => {
        const counts = gElements.reduceTo(key).unique(true);
        const gActive = (new Filter(activeEvents[group.key])).reduceTo(key).unique(true);
        for (const id in counts) {
          if (counts.hasOwnProperty(id)) {
            counts[id] = gActive[id] ? gActive[id] : 0;
          }
        }
        elements.push({
          key,
          elements: counts
        });
      });
      const uniqueActive = new Filter(activeEvents[group.key]).groupBy('entityId');
      data.push({
        name: group.key,
        // count: activeEvents[group.key] ? activeEvents[group.key].length : 0,
        count: uniqueActive ? uniqueActive.length : 0,
        disabled: !activeEvents[group.key],
        active: activeElements.indexOf(group.key) !== -1,
        highlight: highlight.indexOf(group.key) !== -1,
        elements
      });
    });
    this.metadata = data;
    this.$scope.$evalAsync();
  }

  filterBy(name) {
    this.globalDispatch(filterChart(config.metadata.sorting, name, this.name));
  }

  highlightGroup(name, type = config.metadata.sorting) {
    this.globalDispatch(highlightExactGroup(type, name, this.name));
  }

  resetHighlight() {
    this.globalDispatch(resetHighlight(this.name));
  }

}

MetadataController.$inject = ['$scope'];

function metadata() {
  return {
    restrict: 'E',
    templateUrl: 'app/dashboard/timeline/metadata.html',
    controller: MetadataController,
    controllerAs: 'metadataCtrl'
  };
}

export default metadata;
