'use strict';
export const filterChart = (groupType, selection, phase) => {
  return {
    type: 'FILTER_CHART',
    groupType,
    selection,
    phase
  };
};

export const highlightExactGroup = (groupType, selection, phase) => {
  return {
    type: 'HIGHLIGHT_EXACT_GROUP',
    groupType,
    selection,
    phase
  };
};

export const highlightRelativeGroup = (groupType, selection, phase) => {
  return {
    type: 'HIGHLIGHT_RELATIVE_GROUP',
    groupType,
    selection,
    phase
  };
};

export const highlightElement = (selection, phase) => {
  return {
    type: 'HIGHLIGHT_ELEMENT',
    selection,
    phase
  };
};

export const resetHighlight = phase => {
  return {
    type: 'HIGHLIGHT_ELEMENT',
    selection: null,
    phase
  };
};

export const toggleRemoveElements = () => {
  return {
    type: 'TOGGLE_REMOVE_ELEMENTS'
  };
};

export const updateEvents = (startDate, endDate, events) => {
  return {
    type: 'UPDATE_EVENTS',
    selection: {
      startDate,
      endDate,
      events
    }
  };
};

export const updatePhases = selection => {
  return {
    type: 'UPDATE_PHASES',
    selection
  };
};
