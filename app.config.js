angular.module('ytApp').config(config);

config.inject = ['$stateProvider', '$urlRouterProvider'];

function config($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/video/');

    $stateProvider
        .state('state1', {
            url: '/video/',
            template: '<video-list></video-list>'
        })
        .state('state2', {
            url: '/video/detail',
            template: '<video-detail></video-detail>'
        });
}
