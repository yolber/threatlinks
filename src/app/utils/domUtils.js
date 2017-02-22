'use strict';
const addEventListenerToElement = (element, eventHandler) => {
  for (const fn in eventHandler) {
    if (eventHandler.hasOwnProperty(fn)) {
      element.addEventListener(fn, eventHandler[fn]);
    }
  }
};

const style = (element, styleObject) => {
  for (const key in styleObject) {
    if (styleObject.hasOwnProperty(key)) {
      element.style[key] = styleObject[key];
    }
  }
};

const toggleClass = (element, classList) => {
  if (!Array.isArray(classList)) {
    classList = [classList];
  }
  for (const className of classList) {
    element.classList.toggle(className);
  }
};

const addClass = (element, classList) => {
  if (!Array.isArray(classList)) {
    classList = [classList];
  }
  classList.forEach(className => {
    element.classList.add(className);
  });
};

const removeClass = (element, classList) => {
  if (!Array.isArray(classList)) {
    classList = [classList];
  }
  for (const className of classList) {
    element.classList.remove(className);
  }
};

const append = (element, type, attributes = {}) => {
  const newElement = document.createElement(type);
  element.appendChild(newElement);
  for (const attribute in attributes) {
    if (attributes.hasOwnProperty(attribute)) {
      switch (attribute) {
        case 'style':
          style(newElement, attributes[attribute]);
          break;
        case 'classList':
          toggleClass(newElement, attributes[attribute]);
          break;
        case 'eventHandler':
          addEventListenerToElement(newElement, attributes[attribute]);
          break;
        default:
          newElement[attribute] = attributes[attribute];
          break;
      }
    }
  }
  return newElement;
};

export const $ = {
  addEventListenerToElement,
  append,
  style,
  toggleClass,
  addClass,
  removeClass
};
