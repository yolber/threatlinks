export default {
  timeline: {
    height: 0.15,
    title: 0.05,
    type: 'timestamp',
    tickSize: 0.2
  },
  metadata: {
    height: 0.4,
    sorting: 'analyticsType',
    selection: [
      'entityId'
    ]
  },
  sidebar: {
    selection: [
      'entityId',
      'dataSource'
    ]
  },
  margin: 5,
  highlightColor: '#FF0036',
  disabledColor: '#C6C9CA',
  daysBack: 3,
  maxDaysBack: 360
};
