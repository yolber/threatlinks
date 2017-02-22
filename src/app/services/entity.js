import NikeService from './nikeService';

class Entity extends NikeService {

  getSimilarity(entity, timestamp, cb) {
    timestamp -= new Date().getTimezoneOffset() * 60;
    this.$http.get(`${this.prefix}/similarityComplete.json`, {
      params: {
        entity,
        timestamp
      }
    })
    .then(res => cb(null, res.data), cb);
  }

  getNetflow(start, end, entity, interval, cb) {
    super.fetch('/netflow.json', {
      start,
      end,
      addParams: {
        entity,
        interval
      }
    })
    .then(res => cb(null, res.data), cb);
  }

  getFeatures(start, end, entity, cb) {
    super.fetch('/features.json', {
      start,
      end,
      addParams: {
        entity
      }
    })
    .then(res => cb(null, res.data), cb);
  }

}

export default Entity;
