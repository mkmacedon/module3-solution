(function() {
'use strict'

	var app = angular.module("NarrowItDownApp", []);
	app.controller("NarrowItDownController", NarrowItDownController);
	app.service('MenuSearchService', MenuSearchService);
	app.directive('foundItems', foundItemsDirective);

	MenuSearchService.$inject=['$http', '$filter'];
	function MenuSearchService($http, $filter) {
		var service = this;

		service.getMatchedMenuItems = function(searchTerm) {
			return $http({
				method: 'GET',
				url: 'https://davids-restaurant.herokuapp.com/menu_items.json'
			}).then(function(result) {
				var allItems = result.data.menu_items;
				var found = $filter('filter')(allItems, { description: searchTerm });
				return found;
			});
		};
	}

	function foundItemsDirective() {
		var ddo = {
			templateUrl: 'foundItemsDirective.html',
			scope: {
				showAlert : '<',
				items : '<',
				onRemove: '&'
			},
			controller: FoundItemsDirectiveController,
			controllerAs: 'list',
			bindToController: true
		};
		return ddo;
	};

	function FoundItemsDirectiveController() {
		var list = this;
		list.showNothingFound = function() {
			return list.showAlert;
		};
	}


	NarrowItDownController.$inject=['MenuSearchService'];
	function NarrowItDownController(MenuSearchService) {
		var vm = this;

		vm.narrowItDown = function() {
			vm.found = [];
			var promise = MenuSearchService.getMatchedMenuItems(vm.searchTerm);
			promise.then(function(result) {
				vm.found = result;

				//Check whether there is a search term or if there are items to be shown
				if(vm.searchTerm == "" || vm.searchTerm == undefined || vm.found == undefined || vm.found == null || vm.found.length === 0)
					vm.showNothingFound = true;
				else vm.showNothingFound = false;
			});
		};

		vm.removeItem = function(index) {
			vm.found.splice(index, 1);
		};
	};
})();
