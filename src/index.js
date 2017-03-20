'use strict';
import angular from 'angular';
import uiRouter from 'angular-ui-router';
//import 'leaflet/dist/leaflet.js';
//import 'angular-leaflet-directive/dist/angular-leaflet-directive.min.js';

//import 'jquery';
//import './app/alerts/bootstrap.min.js';
//import 'dc';

import {
  dashboardModule
} from './app/dashboard/index';

import {
  graphModule
} from './app/graph/index';

import {
  entityModule
} from './app/entity/index';

import {
  rawDataModule
} from './app/rawData/index';

import {
  ruleEngineModule
} from './app/ruleEngine/index';

import {
  main
} from './app/main';
import {
  header
} from './app/header';
import {
  footer
} from './app/footer';

import displayNamesFilter from './app/utils/displayNamesFilter';
//import './app/alerts/alert_detail.js';

import '!style!css!sass!./index.scss';
import 'angular-material/angular-material.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'dc/dc.css';
//import 'leaflet/dist/leaflet.css';

//import './app/alerts.html';


const config = ($stateProvider, $urlRouterProvider, $mdDateLocaleProvider) => {
  $urlRouterProvider.otherwise('/dashboard');

  $stateProvider
    .state('dashboard', {
      url: '/dashboard',
      templateUrl: 'app/dashboard.template.html'
    })
    .state('entity', {
      url: '/entity/{entityId}',
      templateUrl: 'app/entity.template.html'
    })
    .state('raw-data', {
      url: '/rawData/{entityId}',
      templateUrl: 'app/rawData.template.html'
    })
    .state('rule-engine', {
      url: '/micro-analytics-manager',
      templateUrl: 'app/ruleEngine.template.html'
    })
    .state('graph', {
      url: '/graph',
      templateUrl: 'app/graph.template.html'
    //})
    //.state('Alert Details', {
    //  url: '/alert',
    //  templateUrl: 'app/alerts.html'
    });

  $mdDateLocaleProvider.formatDate = date => {
    return `${(`0${date.getDate()}`).substr(-2)}/${(`0${(date.getMonth() + 1)}`).substr(-2)}/${date.getFullYear()}`;
  };
};



angular
  .module('app', [uiRouter, dashboardModule, entityModule, graphModule, rawDataModule, ruleEngineModule])
  .config(config)
  .component('app', main)
  .component('fountainHeader', header)
  .component('fountainFooter', footer)
  .filter('displayNames', displayNamesFilter);

config.$inject = ['$stateProvider', '$urlRouterProvider', '$mdDateLocaleProvider'];
