class RuleEngine {
  constructor($http, $scope) {
    this.httpService = $http;
    this.scopeService = $scope;
    //this.rootURL = 'http://threataware-as.net:8080/AnalyticsEngine/AnalyticsServices/API/';
    this.rootURL = '/app/data/';
  }

  /*
      Connects with Analytics Engine and returns all Modules.
  */
  loadModules(passphrase) {
    return this.httpService({
      method: 'GET',
      url: `${this.rootURL}microAnalytics.json`
      //headers: {Authorization: `basic ${passphrase}`}
    });
  }

  /*
      Connects with Analytics Engine and triggers an execution with the given timestamp.
  */
  executeModules(date, hour, minutes, passphrase) {
    return this.httpService({
      method: 'GET',
      url: `${this.rootURL}result?date=${date}&hour=${hour}&minutes=${minutes}`,
      headers: {Authorization: `basic ${passphrase}`}
    });
  }

  /*
      Connects with Analytics Engine and tries to place a new module. The request data has to be transformed
      to achieve the application/x-www-form-urlencoded style which is expected by the backend.
  */
  addModule(day, month, year, hour, minutes, payload, passphrase) {
    return this.httpService({
      method: 'PUT',
      url: `${this.rootURL}microAnalytics?year=${year}&month=${month}&day=${day}&hour=${hour}&minutes=${minutes}`,
      headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `basic ${passphrase}`},
      transformRequest(obj) {
        const str = [];
        for (const p in obj) {
          if (obj.hasOwnProperty(p)) {
            str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`);
          }
        }
        return str.join("&");
      },
      transformResponse: undefined, //  --> Do not treat Response as JSON (it is a plain status string)
      data: {newAnalytics: JSON.stringify(payload)}
    });
  }

  updateModule(day, month, year, hour, minutes, payload, passphrase) {
    return this.httpService({
      method: 'POST',
      url: `${this.rootURL}microAnalytics?year=${year}&month=${month}&day=${day}&hour=${hour}&minutes=${minutes}&microAnalyticsId=${payload.microAnalyticsId}`,
      headers: {'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': `basic ${passphrase}`},
      transformRequest(obj) {
        const str = [];
        for (const p in obj) {
          if (obj.hasOwnProperty(p)) {
            str.push(`${encodeURIComponent(p)}=${encodeURIComponent(obj[p])}`);
          }
        }
        return str.join("&");
      },
      transformResponse: undefined, //  --> Do not treat Response as JSON (it is a plain status string)
      data: {updatedAnalytics: JSON.stringify(payload)}
    });
  }

  /*
      Connects with Analytics Engine and triggers the deletion of the selected module.
  */
  deleteModule(moduleId, passphrase) {
    return this.httpService({
      method: 'DELETE',
      url: `${this.rootURL}microAnalytics?microAnalyticsId=${moduleId}`,
      headers: {Authorization: `basic ${passphrase}`}
    });
  }

  getCookie(cookieName) {
    const name = `${cookieName}=`;
    const allCookies = document.cookie.split(';');
    for (let i = 0; i < allCookies.length; i++) {
      let currentCookie = allCookies[i];
      while (currentCookie.charAt(0) === ' ') {
        currentCookie = currentCookie.substring(1);
      }
      if (currentCookie.indexOf(name) === 0) {
        return currentCookie.substring(name.length, currentCookie.length);
      }
    }
    return "";
  }

  isCookieAvailable(cookieName) {
    const cookiePlaceholder = this.getCookie(cookieName);
    if (cookiePlaceholder === '') {
      return false;
    } else {
      return true;
    }
  }

  setCookie(name, value, expDays) {
    if (expDays === 0) {
      document.cookie = `${name}=${value};`;
    } else {
      const expDate = new Date();
      expDate.setTime(expDate.getTime() + (expDays * 24 * 60 * 60 * 1000));
      document.cookie = `${name}=${value}; expires=${expDate}`;
    }
  }
}

RuleEngine.$inject = ['$http'];

export default RuleEngine;
