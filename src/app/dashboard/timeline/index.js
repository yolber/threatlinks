import angular from 'angular';

import {
  timeline
} from './timeline';
import phaseDirective from './phase';
import phaseGraph from './phaseGraph';
import timeseriesDirective from './timeseries';
import timeseriesGraph from './timeseriesGraph';
import metadataDirective from './metadata';

import Phase from '../../services/phase.js';

export const timelineModule = 'timeline';

angular
  .module(timelineModule, [])
  .component('timeline', timeline)
  .service('phaseService', Phase)
  .directive('phase', phaseDirective)
  .directive('phaseGraph', phaseGraph)
  .directive('timeseries', timeseriesDirective)
  .directive('timeseriesGraph', timeseriesGraph)
  .directive('metadata', metadataDirective);
