import NikeService from './nikeService';

class Phase extends NikeService {
  getPhases(cb) {
    //this.$http.get(`${this.prefix}/threatPhaseList`).then(res => {
    this.$http.get(`/app/data/threatPhaseList.json`).then(res => {
      const phases = res.data.map(e => {
        return {
          name: e.phaseDescription,
          id: parseInt(e.ID, 10)
        };
      }).sort((a, b) => a.id - b.id);
      cb(null, phases);
    }, cb);
  }

  getEvents({
    start,
    end
  }, cb) {
    super.fetch('/partialAnalyticsThreatFindings.json', {
      start,
      end
    }).then(res => {
      const events = [];
      res.data.forEach(e => {
        e.startDate = (new Date(e.startDate)).getTime();
        e.endDate = (new Date(e.endDate)).getTime();
        e.timestamp = (new Date(e.timestamp)).getTime();
        const phases = e.ThreatPhase.split(',');
        phases.forEach(phase => {
          const o = Object.assign({}, e, {
            ThreatPhase: phase
          });
          if (o.analyticsID === 'Minority Report') {
            const list = o.analyticsType.replace('Minority Report - Feature:', '').split(' - ');
            const type = list[0].split(', Score:');
            o.features = {
              name: type[0],
              score: type[1],
              description: list[1]
            };
            o.analyticsType = 'Minority Report';
          }
          if (o.analyticsID === 'Temporal Minority Report') {
            const list1 = o.analyticsType.replace('Temporal Minority Report - Feature:', '').split(' - ');
            const type1 = list1[0].split(', Score:');
            o.features = {
              name: type1[0],
              score: type1[1],
              description: list1[1]
            };
            o.analyticsType = 'Temporal Minority Report';
          }
          events.push(o);
        });
      });
      cb(null, events);
    }, cb);
  }
}

Phase.$inject = ['$http'];

export default Phase;
