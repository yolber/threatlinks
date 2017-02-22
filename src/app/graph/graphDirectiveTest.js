    'use strict';
    import GraphStyle from './graphStyle';

    function graphDirective() {
      return {
        restrict: 'E',
        templateUrl: 'app/graph/graph.html',
        link() {
          const cytoscape = require('cytoscape');
          const jquery = require('jquery');
          const cyqtip = require('cytoscape-qtip');
          cyqtip(cytoscape, jquery);

          const cy = cytoscape({
            container: document.querySelector('graph #cy')
          });

          cy.style(GraphStyle.getStyle());

          cy.add({
            nodes: [
              {
                data: {
                  id: 'test'
                }
              }
            ],
            edges: [
              //somedata
            ]
          });
          cy.layout({name: 'cose'});

          cy.$('test').qtip({
            content: 'Hello!',
            position: {
              my: 'top center',
              at: 'bottom center'
            },
            style: {
              classes: 'qtip-bootstrap',
              tip: {
                width: 16,
                height: 8
              }
            }
          });
        }
      };
    }

    graphDirective.$inject = ['graphService'];

    export default graphDirective;
