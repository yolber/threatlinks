class ruleEngineController {

  constructor(RuleEngineService, $scope, $mdDialog, $state) {
    this.ruleEngineService = RuleEngineService;
    this.scopeService = $scope;
    this.dialogService = $mdDialog;
    this.$state = $state;
    this.passphrase = '';
    this.resize();
    //this.showLoginPrompt();

    window.addEventListener('resize', this.resize);
  }

  showExecutionConfirmation() {
    this.confirmExecution = true;
    this.scopeService.executionDate = new Date();
    this.scopeService.executionTime = new Date();
  }

  jsonUploadFinished() {
    const jsonfile = this.scopeService.file.data;
    this.moduleFile = JSON.parse(jsonfile);
    this.newModuleName = this.moduleFile.microAnalyticsId;
    this.showImportStaus = false;
    this.scopeService.$apply(() => {
      this.scopeService.isFileUploaded = true;
    });
  }

  submitForm() {
    this.showImportStatus = true;
    this.importStatus = "Checking module..";
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const year = today.getFullYear();
    this.ruleEngineService.addModule(day, month, year, today.getHours(),
      today.getMinutes(), this.scopeService.newModule, this.passphrase).then(this.addRuleSuccess.bind(this),
      this.addRuleError.bind(this));
  }

  saveModule(module) {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const year = today.getFullYear();
    this.ruleEngineService.updateModule(day, month, year, today.getHours(), today.getMinutes(), module, this.passphrase).then(this.redrawModules.bind(this), () => {});
  }

  addModule() {
    this.scopeService.isFileUploaded = false;
    this.showImportStatus = true;
    this.importStatus = "Checking module..";

    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    const year = today.getFullYear();
    this.ruleEngineService.addModule(day, month, year, today.getHours(),
      today.getMinutes(), this.moduleFile, this.passphrase).then(this.addRuleSuccess.bind(this),
      this.addRuleError.bind(this));
  }

  exportModule(module) {
    const filename = `${module.microAnalyticsId}.json`;
    const data = JSON.stringify(module);
    const blob = new Blob([data], {
      type: 'text/json'
    });
    const e = document.createEvent('MouseEvents');
    const a = document.createElement('a');

    a.download = filename;
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ['text/json', a.download, a.href].join(':');
    e.initEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    a.dispatchEvent(e);
  }

  deleteModule(module) {
    this.ruleEngineService.deleteModule(module.microAnalyticsId, this.passphrase).then(this.deleteModuleSuccess.bind(this),
      this.deleteModuleError.bind(this));
  }

  showDeletionPrompt(module) {
    const confirm = this.dialogService.confirm()
      .title('Confirm deletion')
      .textContent(`Please confirm the deletion of ${module.microAnalyticsId}!`)
      .ariaLabel('confirmDeletion')
      .ok('Confirm')
      .cancel('Cancel');
    this.dialogService.show(confirm).then(() => {
      this.deleteModule(module);
    }, () => {});
  }

  showTimestampShift(timestampType) {
    if (timestampType !== 'basic' && timestampType !== 'specific') {
      return true;
    }
    return false;
  }

  /*showLoginPrompt() {
    if (this.ruleEngineService.isCookieAvailable('microAnalyticsPassphrase')) {
      this.passphrase = this.ruleEngineService.getCookie('microAnalyticsPassphrase');
      this.initializePage();
      return;
    }

    this.dialogService.show({
      controller: DialogController,
      templateUrl: 'app/ruleEngine/passwordPrompt.hml',
      clickOutsideToClose: true
    })
      .then(username => {
        if (username === null) {
          if (this.$state.fromState) {
            this.$state.go(this.$state.fromState.name, this.$state.fromParams);
          } else {
            this.$state.go('dashboard');
          }
          return;
        }
        this.passphrase = window.btoa(username);
        this.ruleEngineService.setCookie('microAnalyticsPassphrase', this.passphrase);
        this.initializePage();
      }, () => {});
  }*/

  executeRules() {
    let month = this.scopeService.executionDate.getMonth() + 1;
    let day = this.scopeService.executionDate.getDate();
    let hours = this.scopeService.executionTime.getHours();
    let minutes = this.scopeService.executionTime.getMinutes();

    if (day < 10) {
      day = `0${day}`;
    }
    if (month < 10) {
      month = `0${month}`;
    }
    if (hours < 10) {
      hours = `0${hours}`;
    }
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }

    const dateString = `${this.scopeService.executionDate.getFullYear()}/${month}/${day}`;
    this.isExecuting = true;
    this.hasExecutionResults = false;
    this.confirmExecution = false;
    this.ruleEngineService.executeModules(dateString, hours,
      minutes, this.passphrase).then(this.executeRulesSuccess.bind(this),
      this.executeRulesError.bind(this));
  }

  /*
      Sets all show-variables to an initial value - page will be displayed as after refresh.
  */
  initializePage() {
    this.statusMessage = 'Loading modules..';
    this.areRulesLoaded = false;
    this.modules = {};

    this.executionStatusMessage = "";
    this.hasExecutionResults = false;
    this.confirmExecution = false;
    this.isExecuting = false;
    this.moduleFile = {};
    this.addNewRule = false;
    this.importJSON = false;
    this.importForm = false;
    this.showImportStatus = false;
    this.scopeService.isFileUploaded = false;

    this.scopeService.newModule = {
      priority: 0,
      analyticsExecutionInterface: 'restAPI',
      analyticsEngine: 'spiderAE',
      microAnalyticsRepresentation: 'SQL',
      timestampData: {
        timestampType: 'basic'
      },
      microAnalyticsResults: {}
    };
    this.ruleEngineService.loadModules(this.passphrase).then(this.drawRules.bind(this), this.loadRulesError.bind(this));
    this.resize();
  }

  /*
        REST-CALLBACKS
  */
  redrawModules() {
    this.modules = this.modules.sort((a, b) => a.priority - b.priority);
  }

  drawRules(response) {
    this.modules = response.data.modules;
    this.areRulesLoaded = true;
    this.resize();
  }

  loadRulesError() {
    this.statusMessage = 'Error.';
    this.ruleEngineService.setCookie('microAnalyticsPassphrase', 'null', -10); // Deletes the cookie, exp. Date before now
    this.showLoginPrompt();
  }

  executeRulesSuccess(response) {
    this.executionResults = response.data;
    this.hasExecutionResults = true;
    this.isExecuting = false;
  }

  executeRulesError() {
    this.executionStatusMessage = "Error executing rules.";
    this.hasExecutionResults = false;
    this.isExecuting = false;
  }

  addRuleSuccess() {
    this.initializePage();
  }

  addRuleError(response) {
    this.showImportStatus = true;
    this.importJSON = false;
    this.importStatus = response.data;
  }

  deleteModuleSuccess() {
    this.initializePage();
  }

  deleteModuleError() {}

  updateModuleSuccess() {
    this.initializePage();
  }

  updateModuleError() {}
    /*
          END CALLBACKS
    */

  /*
      Resizes the document so that the sidebar & the main content always have exact the height of the page.
  */
  resize() {
    document.querySelector('rule-engine #sidebar').style.height = '0px';
    document.querySelector('rule-engine #content').style.height = '0px';
    const heightStr = `${document.getElementsByClassName('main')[0].clientHeight}px`;
    document.querySelector('rule-engine #sidebar').style.height = heightStr;
    document.querySelector('rule-engine #content').style.height = heightStr;
  }

}

function DialogController($scope, $mdDialog) {
  $scope.hide = function () {
    $mdDialog.hide();
  };
  $scope.cancel = function () {
    $mdDialog.cancel();
  };
  $scope.answer = function (answer) {
    $mdDialog.hide(answer);
  };
}

ruleEngineController.$inject = ['ruleEngine', '$scope', '$mdDialog', '$state'];

export const ruleEngine = {
  templateUrl: 'app/ruleEngine/ruleEngine.html',
  controller: ruleEngineController
};
