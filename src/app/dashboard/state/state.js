import config from '../config';
import Filter from '../../utils/filterClass';

class State {
  constructor(phase, timeseries) {
    this.phase = phase;
    this.timeseries = timeseries;
    this.newData = false;
    this.selection = {};
    this.calling = false;
    this.events = new Filter();
    this.activeTimestamps = new Filter();
    this.highlightTimestamps = new Filter();
    this.startDate = new Date();
    this.endDate = new Date();
    this.removeElements = false;
    this.parent = {
      events: new Filter()
    };
    this.subs = [];
  }

  subscribe(cb, type = 0, actions) {
    this.subs.push({
      cb,
      type,
      actions
    });
  }

  callSubs(action) {
    if (!this.calling) {
      this.calling = true;
      this.activeTimestamps = this.events;
      this.subs.forEach(subscriber => {
        if (!subscriber.actions || subscriber.actions.indexOf(action) !== -1) {
          switch (subscriber.type) {
            case 0:
              subscriber.cb(this.removeElements ? this.events : this.parent.events, this.startDate, this.endDate, this.activeTimestamps.reduceTo(config.timeline.type), this.highlightTimestamps.reduceTo(config.timeline.type));
              break;
            case 2:
              subscriber.cb(this.removeElements ? this.events : this.parent.events, this.startDate, this.endDate, this.activeTimestamps.reduceTo(config.timeline.type, 'ThreatPhase'), this.highlightTimestamps.reduceTo(config.timeline.type, 'ThreatPhase'), this.phase, this.newData);
              break;
            case 1:
              subscriber.cb(this.events, this.parent.events, this.selection, this.highlightTimestamps);
              break;
            default:
              break;
          }
        }
      });
      this.newData = false;
      this.calling = false;
    }
  }

  getFilterType(selection) {
    if (Array.isArray(selection)) {
      selection = selection[0];
    } else if (typeof selection === 'object') {
      selection = selection[Object.keys(selection)[0]];
    }
    switch (typeof selection) {
      case 'number':
        return 'filterRelative';
      case 'string':
        return 'filterIn';
      default:
        return 'filterExact';
    }
  }

  dispatch({
    type,
    groupType,
    selection,
    phase = '*'
  }) {
    if (phase === '*' || phase === this.phase || this.timeseries) {
      switch (type) {
        case 'UPDATE_PHASES':
          if (this.timeseries) {
            this.phase = (new Filter(selection)).reduceTo('name');
          }
          break;
        case 'UPDATE_EVENTS':
          this.parent.events = (events => {
            events = new Filter(events);
            if (typeof this.phase === 'string') {
              return events.filterExact('ThreatPhase', this.phase);
            } else {
              return events;
            }
          })(selection.events);
          this.startDate = selection.startDate;
          this.endDate = selection.endDate;
          this.newData = true;
        case 'FILTER_CHART':
          if (groupType && (this.selection[groupType] ||
              (typeof selection !== 'object' ||
                Object.keys(selection).length !== 0))) {
            if (!this.selection[groupType]) {
              this.selection[groupType] = {
                filterType: this.getFilterType(selection),
                phases: {}
              };
            }
            if (!this.selection[groupType].phases[phase]) {
              this.selection[groupType].phases[phase] = new Filter();
            }
            if (typeof selection === 'object') {
              this.selection[groupType].phases[phase] = selection;
            } else {
              this.selection[groupType].phases[phase].toggle(selection);
            }
          }
          this.events = this.parent.events;
          for (const group in this.selection) {
            if (this.selection.hasOwnProperty(group)) {
              for (const phase in this.selection[group].phases) {
                if (this.selection[group].phases.hasOwnProperty(phase)) {
                  this.events = this.events[this.selection[group].filterType](group, this.selection[group].phases[phase], phase === '*' ? {} : {type: false, cond: {ThreatPhase: phase}});
                }
              }
            }
          }
          break;
        case 'HIGHLIGHT_ELEMENT':
          this.highlightTimestamps = new Filter(selection);
          break;
        case 'HIGHLIGHT_EXACT_GROUP':
          this.highlightTimestamps = this.events.filterExact(groupType, selection, phase === '*' ? {} : {type: true, cond: {ThreatPhase: phase}});
          break;
        case 'HIGHLIGHT_RELATIVE_GROUP':
          this.highlightTimestamps = this.events.filterRelative(groupType, selection, phase === '*' ? {} : {type: true, cond: {ThreatPhase: phase}});
          break;
        case 'TOGGLE_REMOVE_ELEMENTS':
          this.removeElements = !this.removeElements;
          break;
        default:
          break;
      }
      this.callSubs(type);
    }
  }
}

export default State;
