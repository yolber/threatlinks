import config from './config';

class rawDataController {
  constructor($scope, $stateParams, rawDataService) {
    this.config = config;
    this.entityId = $stateParams.entityId;
    this.netEvents = [];
    this.dnsEvents = [];
    this.webEvents = [];
    this.updateNet = false;
    this.updateDns = true;
    this.updateWeb = true;
    this.rawDataConfig = [];
    this.rawDataService = rawDataService;

    $scope.$watch('$parent.startDate', date => {
      this.startDate = date;
      this.getNetflowData(this.updateNet);
      this.getDnsData(this.updateDns);
      this.getWebproxyData(this.updateWeb);
    });

    $scope.$watch('$parent.endDate', date => {
      if ($scope.$parent.endDate.getHours() === 0) {
        date.setHours(23, 59, 59);
      }
      this.endDate = date;
      this.getNetflowData(this.updateNet);
      this.getDnsData(this.updateDns);
      this.getWebproxyData(this.updateWeb);
    });
  }
  getNetflowData(updateNet) {
    if (!updateNet && this.startDate && this.endDate) {
      this.updateNet = true;
      this.rawDataConfig = this.config.netflowData;
      this.rawDataService.getRawDataNet(this.entityId, (err, netevents) => {
        if (err) {
          console.error('🔥', err);
        }
        this.updateNet = false;
        this.netEvents = netevents;
      });
    }
  }
  getDnsData(updateDns) {
    if (!updateDns && this.startDate && this.endDate) {
      this.updateDns = true;
      this.rawDataConfig = this.config.dnsData;
      this.rawDataService.getRawDNSData(this.entityId, (err, dnsevents) => {
        if (err) {
          console.error('🔥', err);
        }
        this.updateDns = false;
        this.dnsEvents = dnsevents;
      });
    }
  }
  getWebproxyData(updateWeb) {
    if (!updateWeb && this.startDate && this.endDate) {
      this.updateWeb = true;
      this.rawDataConfig = this.config.webproxyData;
      this.rawDataService.getRawWebData(this.entityId, (err, webevents) => {
        if (err) {
          console.error('🔥', err);
        }
        this.updateWeb = false;
        this.webEvents = webevents;
      });
    }
  }
}
export const rawData = {
  templateUrl: 'app/rawData/rawData.html',
  controller: rawDataController,
  controllerAs: 'rawData'
};

rawDataController.$inject = ['$scope', '$stateParams', 'rawDataService'];
