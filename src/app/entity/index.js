'use strict';
import angular from 'angular';

import {entity} from './entity';
import EntityService from '../services/entity.js';
import features from './directives/features';
import featureGraph from './directives/featureGraph';
import info from './directives/info';
import similarity from './directives/similarity';
import similarityGraph from './directives/similarityGraph';
import threatLinking from './directives/threatLinking';
import netflow from './directives/netflow';
import netflowGraph from './directives/netflowGraph';
import threatList from './directives/threatList';
import threatListTr from './directives/threatListTr';
import variableFilter from './filter/variableFilter';

export const entityModule = 'nike.entity';

angular
  .module(entityModule, [])
  .component('entity', entity)
  .directive('features', features)
  .directive('featureGraph', featureGraph)
  .directive('info', info)
  .directive('similarity', similarity)
  .directive('similarityGraph', similarityGraph)
  .directive('threatLinking', threatLinking)
  .directive('netflow', netflow)
  .directive('netflowGraph', netflowGraph)
  .directive('threatList', threatList)
  .directive('threatListTr', threatListTr)
  .filter('variableFilter', variableFilter)
  .service('entityService', EntityService);
