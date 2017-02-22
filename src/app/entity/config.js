export default {
  threatList: [
    {
      name: 'phaseId',
      filter: 'phaseIcon'
    },
    {
      name: 'ThreatPhase'
    }, {
      name: 'timestamp',
      filter: 'date\\HH:mm DD/MM/YY'
    }, {
      name: 'dataSource'
    }, {
      name: 'analyticsType'
    }, {
      name: 'analyticsDetails',
      filter: 'feature'
    }
  ],
  netflow: {
    interval: 3600, // sec
    graphHeight: 250
  },
  similarity: {
    graphHeight: 265
  },
  graphHeight: 425
};
