function fileSelect($window) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link(scope, el, attr, ctrl) {
      const fileReader = new $window.FileReader();
      fileReader.onload = () => {
        ctrl.$setViewValue(fileReader.result);
        if ('fileLoaded' in attr) {
          scope.$eval(attr.fileLoaded);
        }
      };

      fileReader.onprogress = () => {
        if ('fileProgress' in attr) {
          scope.$eval(attr.fileProgress, {$total: $window.event.total, $loaded: $window.event.loaded});
        }
      };

      fileReader.onerror = () => {
        if ('fileError' in attr) {
          scope.$eval(attr.fileError, {$error: fileReader.error});
        }
      };

      el.bind('change', e => {
        const file = e.target.files[0];
        if (file.type === '' || file.type === 'text') {
          fileReader.readAsText(file);
        } else if (file.type === 'data') {
          fileReader.readAsDataURL(file);
        }
      });
    }
  };
}

fileSelect.$inject = ['$window'];

export default fileSelect;
