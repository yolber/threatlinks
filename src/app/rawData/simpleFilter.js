// import displayNamesFilter from '../../utils/displayNamesFilter';
// import moment from 'moment';

// const displayNames = displayNamesFilter();

const simpleFilter = $sce => (input, _filter) => {
  const returnValue = ((input, _filter) => {
    if (_filter) {
      /*  const parts = _filter.split('\\');
      switch (parts[0]) {
        case 'date':
          return moment(input).format(parts[1]);
        case 'displayNames':
          return displayNames(input);
        case 'feature':
          if (input.analyticsId === 'Minority Report' || input.analyticsId === 'Temporal Minority Report') {
            return `${displayNames(input.features.name)} - Score: ${Math.round(input.features.score * 100)}%`;
          } else {
            return displayNames(input.analyticsId);
          }
        case 'phaseIcon':
          return `<div class="icon phase-${input}"></div>`;
        default:
          return input; */
    } else {
      return input;
    }
  })(input, _filter);

  return $sce.trustAsHtml(returnValue);
};

simpleFilter.$inject = ['$sce'];

export default simpleFilter;
