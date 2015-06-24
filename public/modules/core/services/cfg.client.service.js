'use strict';



//Menu service used for managing  menus
angular.module('core').provider('Cfg',
  function CfgProvider(){
    var store = {};
    this.set = function (prop, val) {
      store[prop] = val;
    }
    this.$get = [function CfgService(){
      return function (prop, def){
        return store[prop] || def ;
      }
    }]
  }
);
