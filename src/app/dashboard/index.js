'use strict';
import angular from 'angular';

import {timelineModule} from './timeline/index';

import {dashboard} from './dashboard';
import Phase from '../services/phase.js';
import sidebarDirective from './sidebarDirective';
import angularMaterial from 'angular-material';

export const dashboardModule = 'nike.dashboard';

angular
  .module(dashboardModule, [timelineModule, angularMaterial])
  .component('dashboard', dashboard)
  .directive('sidebar', sidebarDirective)
  .service('phaseService', Phase);
