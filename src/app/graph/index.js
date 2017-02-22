import angular from 'angular';

import graphDirective from './graphDirective';
import NikeService from './../services/nikeService';
export const graphModule = 'nike.graph';

angular
  .module(graphModule, [])
  .directive('graph', graphDirective)
  .service('nikeService', NikeService);
