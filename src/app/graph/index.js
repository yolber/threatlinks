import angular from 'angular';

import graphDirective from './graphDirective';
import spiderService from './../services/spiderService';
export const graphModule = 'spider.graph';

angular
  .module(graphModule, [])
  .directive('graph', graphDirective)
  .service('spiderService', spiderService);
