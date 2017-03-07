class spiderService {
  constructor($http) {
    this.$http = $http;
    //this.prefix = window.location.hostname.match(/threataware-as/) ? '/t/visualization' : '//threataware-as.net/0/t/visualization';
    this.prefix = '/app/data';
  }

  splitDate(timestamp) {
    const date = new Date(timestamp);
    const dateUTC = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    const dateString = dateUTC.toISOString();
    const array = dateString.split(/(T|:)/g);
    array.splice(1, 1);
    array.splice(2, 1);
    return array;
  }

  fetch(url, {
    start,
    end,
    addParams = {}
  }) {
    const obj = {};

    if (start !== undefined) {
      const [
          startdate,
          starthour,
          startminutes
        ] = this.splitDate(start);
      Object.assign(obj, {startdate, starthour, startminutes});
    }

    if (end !== undefined) {
      const [
          enddate,
          endhour,
          endminutes
        ] = this.splitDate(end);
      Object.assign(obj, {enddate, endhour, endminutes});
    }

    const params = Object.assign(obj, addParams);
    return this.$http.get(`${this.prefix}${url}`, {
      params
    });
  }
}

spiderService.$inject = ['$http'];

export default spiderService;
