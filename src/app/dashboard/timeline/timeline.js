import {updatePhases} from '../state/actions';

class TimelineController {
  constructor($scope, phaseService) {
    this.phases = [];
    this.events = [];
    //this.colorCodes = ['#614767', '#425563', '#5F7A76', '#01A982', '#80746E', '#767676'];
    this.colorCodes = ['#545454', ' #23395B', '#1F7A8C', '#69747C', '#A31621', '#DFE2CF']; 


    // this.colorCodes = ['#2AD2C9', '#5F7A76', '#80746E', '#425563', '#614767', '#425563', '#80746E', '#5F7A76', '#2AD2C9'];
    this.globalDispatch = $scope.$parent.dashboard.globalDispatch.bind($scope.$parent.dashboard);
    this.phaseService = phaseService;
    this.update = false;

    this.width = document.querySelector('timeline').clientWidth;
    this.height = document.querySelector('main').clientHeight;
    $scope.$emit('height', this.height);
    $scope.$watch('$parent.dashboard.events', events => {
      this.events = events;
    });

    this.getPhases();
  }

  getPhases() {
    if (!this.update) {
      this.update = true;
      this.phaseService.getPhases((err, phases) => {
        if (err) {
          console.error('🔥', err); // ... handle error
        } else {
          this.phaseWidth = this.width / phases.length;
          this.phases = phases;
          this.globalDispatch(updatePhases(this.phases));
          this.update = false;
        }
      });
    }
  }
}

TimelineController.$inject = ['$scope', 'phaseService'];

export const timeline = {
  templateUrl: 'app/dashboard/timeline/timeline.html',
  controller: TimelineController,
  controllerAs: 'timeline'
};
