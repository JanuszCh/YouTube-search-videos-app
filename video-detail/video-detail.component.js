(function () {
  'use strict';
  angular
    .module('videoDetail')
    .component('videoDetail', {
      templateUrl: 'video-detail/video-detail.template.html',
      controller: phoneDetailController
    });

  phoneDetailController.inject = ['$routeParams', 'videoService', '$sce'];

  function phoneDetailController($routeParams, videoService, $sce) {
    const ctrl = this;
    const URL = 'https://www.youtube.com/embed/';

    ctrl.videoId = videoService.getVideoId();
    ctrl.url = $sce.trustAsResourceUrl(URL + ctrl.videoId);

    function isDataValid(data) {
      return data.length > 0;
    }

    function insertVideoTags(videoData) {
      let videoTagsArray = videoData.snippet.tags;
      if (isDataValid(videoTagsArray)) {
        document.querySelector('#video-tags').innerText = videoTagsArray.join(', ');
      }
    }
    
    // function insertVideoPublishedAt(videoData) {
    //   if (isDataValid(videoData.snippet.publishedAt)) {
    //     document.querySelector('#video-publishedAt').innerText = videoData.snippet.publishedAt.slice(0, 10);
    //   }
    // }

    function insertVideoDuration(videoData) {
      let videoDuration = videoData.contentDetails.duration;
      if (isDataValid(videoDuration)) {
        videoDuration = videoDuration.slice(2).replace('H', 'hrs ').replace('M', 'min ').replace('S', 'sec');
        document.querySelector('#video-duration').innerText = videoDuration;
      }
    }

    videoService.getVideoDetail().then(function (data) {
      ctrl.video = data.items[0];
      insertVideoTags(ctrl.video);
      insertVideoDuration(ctrl.video);
    });
  }

})();