
import angular from 'angular';
import {rawData} from './rawData';
import RawDataService from '../services/rawData.js';
import rawDataTr from './rawDataTr';
import simpleFilter from './simpleFilter';
export const rawDataModule = 'nike.rawData';
angular
  .module(rawDataModule, [])
  .component('rawData', rawData)
  .directive('rawDataTr', rawDataTr)
  .filter('simpleFilter', simpleFilter)
  .service('rawDataService', RawDataService);
