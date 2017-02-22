import Filter from '../utils/filterClass';
import config from './config';

class entityController {
  constructor($scope, $stateParams, phaseService) {
    this.config = config;
    this.entityId = $stateParams.entityId;
    this.events = [];
    this.phases = {};
    this.update = false;
    this.graphHeight = config.graphHeight;
    this.phaseService = phaseService;

    phaseService.getPhases((err, phases) => {
      if (err) {
        console.error('🔥', err);
      }

      phases.forEach(e => {
        this.phases[e.name] = e.id;
      });

      $scope.$watch('$parent.startDate', date => {
        this.startDate = date;
        this.getEvents();
      });
      $scope.$watch('$parent.endDate', date => {
        if ($scope.$parent.endDate.getHours() === 0) {
          date.setHours(23, 59, 59);
        }
        this.endDate = date;
        this.getEvents();
      });
    });

    $scope.menuSelected = 'entity';
  }

  getEvents() {
    if (!this.update && this.startDate && this.endDate) {
      this.update = true;
      this.phaseService.getEvents({
        start: this.startDate,
        end: this.endDate
      }, (err, events) => {
        if (err) {
          console.error('🔥', err);
        }
        events = events.map(e => Object.assign(e, {phaseId: this.phases[e.ThreatPhase]}));
        events = new Filter(events);
        this.events = events.filterExact('entityId', this.entityId);
        this.update = false;
      });
    }
  }
}

export const entity = {
  templateUrl: 'app/entity/entity.html',
  controller: entityController,
  controllerAs: 'entity'
};

entityController.$inject = ['$scope', '$stateParams', 'phaseService'];
