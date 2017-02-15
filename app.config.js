angular.module('ytApp').config(config);

config.inject = ['$stateProvider', '$urlRouterProvider'];

function config($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/video/');

    $stateProvider
        .state('videoSearch', {
            url: '/video/',
            template: '<video-list></video-list>'
        })
        .state('videoDetails', {
            url: '/video/details',
            template: '<video-detail></video-detail>'
        });
}
