'use strict';
import GraphStyle from './graphStyle';

function graphDirective(nikeService, $stateParams) {
  const ref = `http://${document.location.hostname}:${document.location.port}/#/entity/`;
  return {
    restrict: 'E',
    scope: {
      hasEntity: '=entity',
      height: '=height'
    },
    templateUrl: 'app/graph/graph.html',
    link($scope) {
      const cytoscape = require('cytoscape');
      const regCose = require('cytoscape-cose-bilkent');

      regCose(cytoscape);

      const routed = $scope.height === undefined;

      const cy = cytoscape({
        container: document.querySelector('graph #cy'),
        boxSelectionEnabled: false,
        autounselectify: true
      });

      const resizeGraph = () => {
        document.querySelector('graph #cy').style.height = '0px';
        cy.resize();
        const sidebarFont = Number(getComputedStyle(document.querySelector('graph #sidebar'), "").fontSize.match(/(\d*(\.\d*)?)px/)[1]);
        document.getElementsByClassName('main')[0].style.height = '100%';
        document.getElementsByClassName('main')[0].style.minHeight = 'auto';
        const heightVal = document.getElementsByClassName('main-container')[0].clientHeight;
        document.getElementsByClassName('main')[0].style.height = null;
        document.getElementsByClassName('main')[0].style.minHeight = null;
        document.querySelector('graph #sidebar').style.maxHeight = `${heightVal - 0.02 * document.getElementsByClassName('main-container')[0].clientWidth - 2 * 1.5 * sidebarFont}px`;
        document.querySelector('graph').style.height = `${heightVal}px`;
        document.querySelector('graph #cy').style.height = `${heightVal}px`;
        document.querySelector('graph #cy').style.width = `${document.body.clientWidth}px`;
        cy.resize();
        cy.fit(null, 30);
      };

      const resizeGraphElement = () => {
        const sidebarFont = Number(getComputedStyle(document.querySelector('graph #sidebar'), "").fontSize.match(/(\d*(\.\d*)?)px/)[1]);
        const heightVal = $scope.height;
        let clientWidth = document.querySelector('#threat-linking-subpanel').clientWidth;
        const clientPaddingLeft = parseInt(window.getComputedStyle(document.querySelector('threat-linking .sub-panel')).getPropertyValue('padding-left'), 10);
        const clientPaddingRight = parseInt(window.getComputedStyle(document.querySelector('threat-linking .sub-panel')).getPropertyValue('padding-right'), 10);
        clientWidth -= clientPaddingLeft + clientPaddingRight;
        document.querySelector('graph #sidebar').style.display = 'none';
        document.querySelector('graph #sidebar').style.maxHeight = `${heightVal - 0.02 * clientWidth - 2 * 1.5 * sidebarFont}px`;
        document.querySelector('graph #cy').style.height = `${heightVal}px`;
        document.querySelector('threat-linking .body').style.height = `${heightVal}px`;
        document.querySelector('graph #cy').style.width = `${clientWidth}px`;
        cy.resize();
        cy.fit(null, 30);
      };

      const setProperty = (label, value) => {
        const property = document.createElement('div');
        property.className = 'property';
        const labelEle = document.createElement('div');
        labelEle.className = 'left';
        labelEle.innerHTML = label;
        const valueEle = document.createElement('div');
        valueEle.className = 'right';
        valueEle.innerHTML = value;
        property.appendChild(labelEle);
        property.appendChild(valueEle);
        document.querySelector('graph #sidebar .properties').appendChild(property);
      };

      const setMetadata = (properties, id, type) => {
        const sidebarTitle = document.querySelector('graph #sidebar h1');
        if (type === 'Entity') {
          sidebarTitle.innerHTML = properties.ip;
        } else if (type === 'ADUser' || type === 'SystemUser') {
          sidebarTitle.innerHTML = properties.username;
        } else if (type === 'Domain') {
          sidebarTitle.innerHTML = properties.name;
        } else {
          sidebarTitle.innerHTML = id;
        }
        document.querySelector('graph #sidebar h2').innerHTML = type;
        document.querySelector('graph #sidebar .properties').innerHTML = '';

        const keys = Object.keys(properties);
        keys.forEach(key => {
          if (key !== 'threats') {
            setProperty(key, properties[key]);
          }
        });
        if (properties.threats !== undefined) {
          let threatNumber = 0;
          properties.threats.forEach(threat => {
            const threatline = document.createElement('div');
            threatline.className = 'property threatline';
            threatline.innerHTML = `Threat ${++threatNumber}`;
            document.querySelector('graph #sidebar .properties').appendChild(threatline);
            setProperty('analyticsType', threat.analyticsType);
            setProperty('threatPhase', threat.threatPhase);
          });
        }
      };

      const positionSidebar = event => {
        const target = event.cyTarget;
        const sidebar = document.querySelector('graph #sidebar');
        const clientHeight = document.querySelector('graph #cy').clientHeight;
        const clientWidth = document.querySelector('graph #cy').clientWidth;
        const cyOffsetLeft = document.querySelector('graph #cy').offsetLeft;
        const sidebarFont = Number(getComputedStyle(sidebar, "").fontSize.match(/(\d*(\.\d*)?)px/)[1]);

        sidebar.style.left = '-1000px';
        sidebar.style.top = '-1000px';
        sidebar.style.transition = 'none';
        sidebar.style.height = 'auto';

        const sidebarHeight = sidebar.clientHeight;
        const sidebarWidth = sidebar.clientWidth;
        sidebar.style.maxHeight = `${(clientHeight / 2) - (clientHeight * 0.1)}px`;

        sidebar.style.height = '0px';
        sidebar.style.transition = 'padding 0.5s ease, height 0.5s ease';

        const renderedFontSize = ((GraphStyle.fontSize + 2) / 2) * (target.renderedHeight() / target.height());
        let x = target.renderedPosition().x;
        x = (routed) ? x - (clientWidth * 0.1) - (sidebarFont * 1.5) : x + (cyOffsetLeft) - (sidebarWidth / 2);
        let y = target.renderedPosition().y;
        y = (clientHeight / 2 >= y) ? y + (target.renderedHeight() / 2) + renderedFontSize : y - (target.renderedHeight() / 2) - renderedFontSize - sidebarHeight;
        const offsetCy = document.getElementById('cy').offsetTop;

        sidebar.style.left = `${x}px`;
        sidebar.style.top = `${y + offsetCy}px`;
        sidebar.style.padding = '1.5em 1.5em';
        sidebar.style.height = `${sidebarHeight - (sidebarFont * 3)}px`;
      };

      const hideSidebar = () => {
        const sidebar = document.querySelector('graph #sidebar');
        sidebar.style.height = '0px';
        sidebar.style.padding = '0em 1.5em';
      };

      if (routed) {
        document.querySelector('fountain-header').style.overflowX = 'hidden';
        cy.style(GraphStyle.getStyle(window.getComputedStyle(document.querySelector('app > .main-container')).getPropertyValue('background-color')));
      } else {
        cy.style(GraphStyle.getStyle(window.getComputedStyle(document.querySelector('threat-linking .sub-panel')).getPropertyValue('background-color')));
      }

      cy.on('layoutready', () => {
        if (routed) {
          resizeGraph();
        } else {
          resizeGraphElement();
        }
      });

      cy.on('tap', 'node', event => {
        if (routed) {
          setMetadata(event.cyTarget.data('properties'), event.cyTarget.id(), event.cyTarget.data('type'));
          positionSidebar(event);
        } else {
          window.location.href = ref + event.cyTarget.data('properties').ip;
        }
      });

      cy.on('tap', event => {
        if (event.cyTarget.isNode === undefined || !event.cyTarget.isNode()) {
          hideSidebar();
        }
      });

      cy.on('pan', () => {
        hideSidebar();
      });

      cy.on('drag', () => {
        hideSidebar();
      });

      cy.on('free', 'node', event => {
        setMetadata(event.cyTarget.data('properties'), event.cyTarget.id(), event.cyTarget.data('type'));
        positionSidebar(event);
      });

      if (routed) {
        window.addEventListener('resize', resizeGraph);
      } else {
        window.addEventListener('resize', resizeGraphElement);
      }

      let myScope = $scope;
      let scopeString = '';
      while (!myScope.hasOwnProperty('endDate')) {
        myScope = myScope.$parent;
        scopeString += '$parent.';
      }
      scopeString += 'endDate';

      $scope.$watch(scopeString, endDate => {
        if (endDate) {
          // if (routed) {
          //    myScope.startDate = myScope.endDate;
          // }
          const timestampLocal = Math.floor(new Date(myScope.endDate).getTime() / 1000);
          const timestampUTC = timestampLocal - new Date().getTimezoneOffset() * 60;
          let params;
          if ($scope.hasEntity) {
            params = {
              addParams: {
                timestamp: timestampUTC,
                entity: $stateParams.entityId
              }
            };
          } else {
            params = {
              addParams: {
                timestamp: timestampUTC
              }
            };
          }
          nikeService.fetch('/threatLinkingDirectly.json', params).then(success => {
            cy.remove('*');
            cy.add(success.data);
            cy.layout({
              name: 'cose-bilkent',
              idealEdgeLength: 100,
              edgeElasticity: 1
            });
          }, err => {
            console.log(err);
          });
        }
      });
    }
  };
}

graphDirective.$inject = ['nikeService', '$stateParams'];

export default graphDirective;
