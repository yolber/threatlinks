class FeaturesController {
  constructor($scope, entityService) {
    this.entityId = $scope.entity.entityId;
    this.features = [];
    this.entityService = entityService;
    this.startDate = $scope.entity.startDate;
    this.endDate = $scope.entity.endDate;
    this.update = false;
    $scope.$watch('entity.startDate', date => {
      this.startDate = date;
      this.getFeatures();
    });
    $scope.$watch('entity.endDate', date => {
      this.endDate = date;
      this.getFeatures();
    });
    this.getFeatures();
  }

  getFeatures() {
    if (!this.update && this.startDate && this.endDate) {
      this.update = true;
      this.entityService.getFeatures(this.startDate.getTime(), this.endDate.getTime(), this.entityId, (err, data) => {
        if (err) {
          console.error('🔥', err);
        } else {
          this.extractData(data);
          this.update = false;
        }
      });
    }
  }

  extractData(data) {
    const features = [];
    const links = {};
    data.forEach(e => {
      for (const key in e) {
        if (['TIMESTAMP', 'entity', 'epch', 'time_begin'].indexOf(key) === -1) {
          if (!links[key]) {
            links[key] = {
              name: key,
              data: [],
              max: -Infinity
            };
            features.push(links[key]);
          }
          links[key].data.push({
            timestamp: e.TIMESTAMP,
            count: e[key]
          });
          if (e[key] > links[key].max) {
            links[key].max = e[key];
          }
        }
      }
    });
    for (const key in links) {
      if (links[key].max === 0) {
        features.splice(features.indexOf(links[key]), 1);
      }
    }

    this.features = features;
  }
}

FeaturesController.$inject = ['$scope', 'entityService'];

function features() {
  return {
    restrict: 'E',
    templateUrl: 'app/entity/directives/features.html',
    controller: FeaturesController,
    controllerAs: 'features'
  };
}

export default features;
