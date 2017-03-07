class GraphStyle {
  static getStyle(backgroundColor) {
    this.highlightRed = '#FF0036';
    this.black = '#000000';
    this.white = '#ffffff';
    this.highlightSlate = '#425563';
    this.highlightSteel = '#5f7a76';
    this.highlightBronze = '#80746e';
    this.gray = '#c6c9ca';
    this.highlightBlackish = '#353501';
    this.highlightPurple = '#614767';

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
          'line-color': this.gray,
          'target-arrow-shape': 'triangle',
          'target-arrow-color': this.gray,
          'label': 'data(type)',
          'font-size': 7,
          'font-family': 'Arial',
          'text-rotation': 'autorotate',
          'color': this.highlightSlate
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
          'color': this.highlightPurple,
          'background-image': '/app/icons/person-purple.svg'
        }
      },
      {
        selector: '[type = \'SystemUser\']',
        style: {
          'width': 39,
          'label': 'data(properties.username)',
          'color': this.highlightBronze,
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
          'background-color': this.highlightBlackish,
          'width': 40,
          'height': 40,
          'text-outline-color': this.highlightBlackish,
          'text-outline-width': 1,
          'text-outline-opacity': 1
        }
      },
      {
        selector: '[type = \'Entity\'][threatened]',
        style: {
          'background-image': '/app/icons/server-black.png',
          'color': this.highlightBlackish
        }
      },
      {
        selector: '[type = \'Entity\'][requested]',
        style: {
          'color': this.highlightRed,
          'background-image': '/app/icons/server-red.png'
        }
      }
    ];
    return graphStyle;
  }
}

export default GraphStyle;
