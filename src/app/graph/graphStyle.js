class GraphStyle {
  static getStyle(backgroundColor) {
    this.hpeGreen = '#FF0036';
    this.black = '#000000';
    this.white = '#ffffff';
    this.hpeSlate = '#425563';
    this.hpeDarkSteel = '#5f7a76';
    this.hpeBronze = '#80746e';
    this.hpeGray1 = '#c6c9ca';
    this.hpeTurquoise = '#FF0036';
    this.hpeOrange = '#353501';
    this.hpePurple = '#614767';

    if (backgroundColor === undefined) {
      this.backgroundColor = '#fafafa';
    } else {
      this.backgroundColor = backgroundColor;
    }
    this.fontSize = 7;

    const graphStyle = [
      {
        selector: 'node',
        style: {
          'background-color': this.backgroundColor,
          'label': 'data(id)',
          'width': 50,
          'height': 50,
          'font-size': this.fontSize,
          'font-family': 'Arial',
          'font-weight': 'bold',
          'padding-bottom': this.fontSize + 2,
          'text-margin-y': -this.fontSize - 1,
          'color': this.white,
          'text-halign': 'center',
          'text-valign': 'bottom',
          'shape': 'rectangle',
          'background-fit': 'contain',
          'background-position-y': `-${(this.fontSize + 2) / 2}px`
        }
      },
      {
        selector: 'edge',
        style: {
          'width': 3,
          'curve-style': 'bezier',
          'line-color': this.hpeGray1,
          'target-arrow-shape': 'triangle',
          'target-arrow-color': this.hpeGray1,
          'label': 'data(type)',
          'font-size': 7,
          'font-family': 'Arial',
          'text-rotation': 'autorotate',
          'color': this.hpeSlate
        }
      },
      {
        selector: '[type = \'Entity\']',
        style: {
          'label': 'data(properties.ip)',
          'width': 34,
          'color': this.black,
          'background-image': '/app/icons/server.svg'
        }
      },
      {
        selector: '[type = \'ADUser\']',
        style: {
          'width': 39,
          'label': 'data(properties.username)',
          'color': this.hpePurple,
          'background-image': '/app/icons/person-purple.svg'
        }
      },
      {
        selector: '[type = \'SystemUser\']',
        style: {
          'width': 39,
          'label': 'data(properties.username)',
          'color': this.hpeBronze,
          'background-image': '/app/icons/person-bronze.svg'
        }
      },
      {
        selector: '[type = \'Domain\']',
        style: {
          'width': 66,
          'label': 'data(properties.name)',
          'color': this.black,
          'background-image': '/app/icons/network.svg'
        }
      },
      {
        selector: '[type = \'Threat\']',
        style: {
          'background-color': this.hpeOrange,
          'width': 40,
          'height': 40,
          'text-outline-color': this.hpeOrange,
          'text-outline-width': 1,
          'text-outline-opacity': 1
        }
      },
      {
        selector: '[type = \'Entity\'][threatened]',
        style: {
          'background-image': '/app/icons/server-black.png',
          'color': this.hpeOrange
        }
      },
      {
        selector: '[type = \'Entity\'][requested]',
        style: {
          'color': this.hpeTurquoise,
          'background-image': '/app/icons/server-red.png'
        }
      }
    ];
    return graphStyle;
  }
}

export default GraphStyle;
