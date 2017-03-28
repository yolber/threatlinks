import config from '../config';
// const ref = `http://${document.location.hostname}:${document.location.port}/#/rawData/`;

class ThreatListController {
  constructor($scope) {
    this.config = config;
    this.events = $scope.entity.events;
    this.phases = $scope.entity.phases;
    this.sortBy = 'timestamp';
    this.displayNamesConfig = {phaseId: ' '};

    $scope.$watch('entity.events', events => {
      this.events = events.map(e => Object.assign(e, {
        analyticsDetails: {
          features: e.features,
          analyticsId: e.analyticsID
        }
      }));
      this.sortEvents();
    });
  }

  changeSort(key) {
    if (this.sortBy !== key) {
      this.sortBy = key;
      this.sortEvents();
    }
  }

  sortEvents() {
    if (this.events.length > 0) {
      const sortType = typeof this.events[0][this.sortBy];
      let fn;
      switch (sortType) {
        case 'string':
          fn = (a, b) => {
            const stringA = a[this.sortBy].toUpperCase();
            const stringB = b[this.sortBy].toUpperCase();
            if (stringA < stringB) {
              return -1;
            }
            if (stringA > stringB) {
              return 1;
            }
            return 0;
          };
          break;
        case 'object':
          fn = (a, b) => {
            a = a[this.sortBy];
            b = b[this.sortBy];
            if (a.analyticsId === b.analyticsId) {
              if (a.analyticsId === 'Peer-based Anomaly' || a.analyticsId === 'Temporal Anomaly') {
                if (a.features.name === b.features.name) {
                  return b.features.score - a.features.score;
                } else {
                  return a.features.name < b.features.name ? -1 : 1;
                }
              } else {
                return 0;
              }
            } else {
              return a.analyticsId < b.analyticsId ? -1 : 1;
            }
          };
          break;
        default:
          fn = (a, b) => (b[this.sortBy] - a[this.sortBy]) >> 0;
          break;
      }
      this.events = this.events.sort(fn);
    }
  }
}

ThreatListController.$inject = ['$scope'];

function threatlist() {
  return {
    restrict: 'E',
    templateUrl: 'app/entity/directives/threatList.html',
    controller: ThreatListController,
    controllerAs: 'threatList'
  };
}

export default threatlist;
