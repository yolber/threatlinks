import mds from '../../utils/mds';

class SimilarityController {
  constructor($scope, entityService) {
    this.entityId = $scope.entity.entityId;
    this.timestamp = $scope.entity.endDate;
    this.entityService = entityService;
    this.data = [];
    this.update = false;
    this.bounds = {
      x: {
        max: 1,
        min: -1
      },
      y: {
        max: 1,
        min: -1
      }
    };
    $scope.$watch('entity.endDate', date => {
      this.endDate = date;
      this.getSimilarity();
    });
  }

  getSimilarity() {
    if (!this.update && this.endDate) {
      this.update = true;
      const timestamp = Math.floor(this.endDate.getTime() / 1000);
      this.entityService.getSimilarity(this.entityId, timestamp, (err, data) => {
        if (err) {
          console.error('🔥', err);
        } else {
          const result = {};
          data.forEach(e => {
            if (!result[e.entity1]) {
              result[e.entity1] = {
                [e.entity1]: 0
              };
            }
            if (!result[e.entity2]) {
              result[e.entity2] = {
                [e.entity2]: 0
              };
            }
            result[e.entity1][e.entity2] = e.distance;
            result[e.entity2][e.entity1] = e.distance;
          });
          this.convertData(result);
          this.update = false;
        }
      });
    }
  }

  convertData(data) {
    const distances = Object.keys(data).map(k => data[k]);
    distances.forEach((v, k) => {
      distances[k] = Object.keys(v).sort().map(_k => v[_k]);
    });
    if (distances.length > 0 && distances[0].length > 0) {
      const coordinates = mds(distances);
      const bounds = {
        x: {
          max: -Infinity,
          min: Infinity
        },
        y: {
          max: -Infinity,
          min: Infinity
        }
      };
      const entities = Object.keys(data).sort().map((v, i) => {
        bounds.x.max = coordinates[i][0] > bounds.x.max ? coordinates[i][0] : bounds.x.max;
        bounds.y.max = coordinates[i][1] > bounds.y.max ? coordinates[i][1] : bounds.y.max;
        bounds.x.min = coordinates[i][0] < bounds.x.min ? coordinates[i][0] : bounds.x.min;
        bounds.y.min = coordinates[i][1] < bounds.y.min ? coordinates[i][1] : bounds.y.min;
        return {
          name: v,
          coordinates: coordinates[i]
        };
      });
      this.data = entities;
      this.bounds = bounds;
    }
  }
}

SimilarityController.$inject = ['$scope', 'entityService'];

function similarity() {
  return {
    restrict: 'E',
    templateUrl: 'app/entity/directives/similarity.html',
    controller: SimilarityController,
    controllerAs: 'similarity'
  };
}

export default similarity;
