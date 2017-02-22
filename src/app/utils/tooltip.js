class Tooltip {
  constructor(parent, generateHtml) {
    this.tip = this.createElement();
    this.parent = parent;
    this.generateHtml = generateHtml;
    this.show = this.show.bind(this);
    this.hide = this.hide.bind(this);
  }

  createElement() {
    const node = document.createElement('div');
    document.querySelector('main').appendChild(node);
    node.classList.add('tooltip');
    return node;
  }

  show(data, id, array) {
    const target = array[id];
    const left = (target.cx ? target.cx : target.x).baseVal.value;
    const top = (target.cy ? target.cy : target.y).baseVal.value;
    const offsetTop = target.r ? target.r.baseVal.value : 0;
    const tipWidth = this.tip.clientWidth / 2;
    let offsetLeft = 500;
    if (data.hasOwnProperty('coordinates')) {
      offsetLeft = 0;
    }
    this.tip.innerHTML = this.generateHtml(data);
    this.tip.style.left = `${left + this.parent.offsetLeft + offsetLeft - ((left - tipWidth) < 0 ? 0 : tipWidth)}px`;
    this.tip.style.top = `${top + this.parent.offsetTop + 80 - offsetTop - this.tip.clientHeight}px`;
    this.tip.style.opacity = 1;
    this.tip.style.position = "absolute";
  }
  hide() {
    this.tip.style.opacity = 0;
  }
}

export default Tooltip;
