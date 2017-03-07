'use strict';
import angular from 'angular';

import {
 ruleEngine
} from './ruleEngine';
import RuleEngineService from '../services/ruleEngine';
import fileSelect from './fileSelect';

export const ruleEngineModule = 'spider.ruleEngine';

angular
  .module(ruleEngineModule, [])
  .component('ruleEngine', ruleEngine)
  .directive('fileSelect', fileSelect)
  .service('ruleEngine', RuleEngineService);
