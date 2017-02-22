import NikeService from './nikeService';

class RawData extends NikeService {

  getRawDNSData(entity, cb) {
    this.$http.get(`${this.prefix}/DNS`, {
      params: {
        entity
      }
    })
    .then(res => cb(null, res.data.data), cb);
  }
  getRawWebData(entity, cb) {
    this.$http.get(`${this.prefix}/webproxy`, {
      params: {
        entity
      }
    })
    .then(res => cb(null, res.data.data), cb);
  }
  getRawDataNet(entity, cb) {
    this.$http.get(`${this.prefix}/netflowPage`, {
      params: {
        entity
      }
    })
    .then(res => cb(null, res.data.data), cb);
  }
}

RawData.$inject = ['$http'];

export default RawData;
