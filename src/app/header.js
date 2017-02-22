import config from './dashboard/config';

class HeaderController {
  constructor($scope, $state) {
    this.title = $state.current.name;
    this.params = $state.params;
    this.date = this.getDateSettings(this.title);
    this.uiRoutes = this.getUiRoutes($state);
    this.show = false;
    this.inputParams = Object.assign({}, this.params);
    this.$state = $state;
    this.error = {};
    const today = new Date();
    const backdays = new Date();
    const maxbackdays = new Date();

    today.setHours(23, 59, 59);
    $scope.$parent.today = today;
    maxbackdays.setDate(today.getDate() - config.maxDaysBack);
    maxbackdays.setHours(0, 0, 0);
    $scope.$parent.backday = maxbackdays;
    backdays.setDate(today.getDate() - config.daysBack);
    backdays.setHours(0, 0, 0);
    $scope.$parent.endDate = today;
    $scope.$parent.startDate = backdays;

    this.displayNamesConfig = {
      entityId: 'entity id'
    };

    $scope.$parent.$on('$stateChangeSuccess', (e, toState, toParams, fromState, fromParams) => {
      this.title = $state.current.name;
      this.params = $state.params;
      this.updateInputParams();
      this.date = this.getDateSettings(this.title);
      this.uiRoutes = this.getUiRoutes($state);
      this.show = false;
      $state.fromState = fromState;
      $state.fromParams = fromParams;
    });
  }

  getDateSettings(name) {
    switch (name) {
      case 'rule-engine':
        return 0;
      case 'graph':
        return 1;
      case 'dashboard':
      case 'entity':
        return 2;
      default:
        return 2;
    }
  }

  getUiRoutes($state) {
    const allStates = $state.get();
    const currentState = $state.current;
    const states = [];
    const paramsRegex = /.*\{(.+)\}/;

    for (const state of allStates) {
      if (state !== currentState && !state.abstract) {
        const params = state.url.match(paramsRegex);
        states.push({
          name: state.name,
          param: params ? params[1] : null
        });
      }
    }
    return states.sort((a, b) => a.name > b.name);
  }

  showMenu() {
    // const menu = document.querySelector('.menu');
    // menu.style.left = `${document.querySelector('.header-title').offsetLeft}px`;
    // menu.style.top = `${document.querySelector('header').clientHeight}px`;
    this.show = !this.show;
  }

  routeTo(routeName, paramName, paramValue) {
    if (paramName === 'entityId' && (!paramValue || !paramValue.match(/(?:\d{1,3}\.){3}\d{1,3}/))) {
      this.error[paramName] = true;
      return;
    }
    this.$state.go(routeName, {[paramName]: paramValue});
    this.error[paramName] = false;
  }

  initParam(paramName) {
    return this.$state.params[paramName];
  }

  updateInputParams() {
    this.inputParams = Object.assign(this.inputParams, this.params);
    for (const key in this.inputParams) {
      if (!this.params[key]) {
        delete this.inputParams[key];
      }
    }
  }
}

HeaderController.$inject = ['$scope', '$state'];

export const header = {
  templateUrl: 'app/header.html',
  controller: HeaderController,
  controllerAs: 'header'
};
