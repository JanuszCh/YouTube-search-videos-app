(function () {
  'use strict';

  angular.module('core.video').service('videoService', videoService);

  videoService.inject = ['$http'];

  function videoService($http) {
    const API_KEY = 'AIzaSyDkTxa8HHNdbklnxjZSUPScSl1fJMM1a6Y';
    const Video_Lits_URL = 'https://www.googleapis.com/youtube/v3/search';
    const Video_Detail_URL = 'https://www.googleapis.com/youtube/v3/videos';
    let videoId = '';
    let paramsVideoList = {
      key: API_KEY,
      part: 'snippet',
      q: 'angular tutorial',
      type: 'video',
      maxResults: 25,
      order: 'relevance'
    };
    let paramsVideoDetail = {
      key: API_KEY,
      part: 'snippet, statistics, contentDetails, status',
      type: 'video',
      id: ''
    };

    function setVideoId(vidId) {
      videoId = vidId;
      return videoId;
    }

    function getVideoId() {
      return videoId;
    }

    function setQueryParams(params) {
      paramsVideoList.q = params.query || paramsVideoList.q;
      paramsVideoList.publishedAfter = params.publishedAfter + 'T00:00:00Z';
      paramsVideoList.publishedBefore = params.publishedBefore + 'T00:00:00Z';
      paramsVideoList.videoDefinition = params.videoDefinition;
      paramsVideoList.videoDuration = params.videoDuration;
    }

    function getVideosList() {
      return $http({
          method: 'GET',
          url: Video_Lits_URL,
          params: paramsVideoList
        })
        .then(function (response) {
          return response.data;
        });
    }

    function getVideoDetail() {
      paramsVideoDetail.id = videoId;
      return $http({
          method: 'GET',
          url: Video_Detail_URL,
          params: paramsVideoDetail
        })
        .then((response) => {
          return response.data;
        });
    }

    return {
      getVideosList: getVideosList,
      setVideoId: setVideoId,
      getVideoId: getVideoId,
      getVideoDetail: getVideoDetail,
      setQueryParams: setQueryParams
    };
  }
})();