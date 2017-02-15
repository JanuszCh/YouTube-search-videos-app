webpackJsonp([0],[
/* 0 */,
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


angular.module('ytApp').config(config);

config.inject = ['$stateProvider', '$urlRouterProvider'];

function config($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/video/');

    $stateProvider.state('state1', {
        url: '/video/',
        template: '<video-list></video-list>'
    }).state('state2', {
        url: '/video/detail',
        template: '<video-detail></video-detail>'
    });
}

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


angular.module('ytApp', ['ui.router', 'ngRoute', 'ngAnimate', 'core', 'videoDetail', 'videoList']);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


angular.module('core', ['core.video']);

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


angular.module('core.video', []);

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function () {
  'use strict';

  angular.module('core.video').service('videoService', videoService);

  videoService.inject = ['$http'];

  function videoService($http) {
    var API_KEY = 'AIzaSyDkTxa8HHNdbklnxjZSUPScSl1fJMM1a6Y';
    var Video_Lits_URL = 'https://www.googleapis.com/youtube/v3/search';
    var Video_Detail_URL = 'https://www.googleapis.com/youtube/v3/videos';
    var videoId = '';
    var paramsVideoList = {
      key: API_KEY,
      part: 'snippet',
      q: 'angular tutorial',
      type: 'video',
      maxResults: 25,
      order: 'relevance'
    };
    var paramsVideoDetail = {
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
      console.log(paramsVideoList);
      return $http({
        method: 'GET',
        url: Video_Lits_URL,
        params: paramsVideoList
      }).then(function (response) {
        return response.data;
      });
    }

    function getVideoDetail() {
      paramsVideoDetail.id = videoId;
      return $http({
        method: 'GET',
        url: Video_Detail_URL,
        params: paramsVideoDetail
      }).then(function (response) {
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

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function () {
  'use strict';

  angular.module('videoDetail').component('videoDetail', {
    templateUrl: 'video-detail/video-detail.template.html',
    controller: phoneDetailController
  });

  phoneDetailController.inject = ['$routeParams', 'videoService', '$sce'];

  function phoneDetailController($routeParams, videoService, $sce) {
    var ctrl = this;
    var URL = 'https://www.youtube.com/embed/';

    ctrl.videoId = videoService.getVideoId();
    ctrl.url = $sce.trustAsResourceUrl(URL + ctrl.videoId);

    function isDataValid(data) {
      return data.length > 0;
    }

    function insertVideoTags(videoData) {
      var videoTagsArray = videoData.snippet.tags;
      if (isDataValid(videoTagsArray)) {
        document.querySelector('#video-tags').innerText = videoTagsArray.join(', ');
      }
    }

    function insertVideoPublishedAt(videoData) {
      if (isDataValid(videoData.snippet.publishedAt)) {
        document.querySelector('#video-publishedAt').innerText = videoData.snippet.publishedAt.slice(0, 10);
      }
    }

    function insertVideoDuration(videoData) {
      var videoDuration = videoData.contentDetails.duration;
      if (isDataValid(videoDuration)) {
        videoDuration = videoDuration.slice(2).replace('H', 'hrs ').replace('M', 'min ').replace('S', 'sec');
        document.querySelector('#video-duration').innerText = videoDuration;
      }
    }

    videoService.getVideoDetail().then(function (data) {
      ctrl.video = data.items[0];
      console.log(ctrl.video);
      insertVideoTags(ctrl.video);
      insertVideoDuration(ctrl.video);
      insertVideoPublishedAt(ctrl.video);
    });
  }
})();

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function () {
    'use strict';

    angular.module('videoDetail', ['ngRoute']);
})();

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function () {
  'use strict';

  angular.module('videoList').component('videoList', {
    templateUrl: 'video-list/video-list.template.html',
    controller: videoListController
  });

  videoListController.inject = ['videoService'];

  function videoListController(videoService) {
    var ctrl = this;
    var modalWindow = document.querySelector('#modal');
    var modalMsgField = document.querySelector('#modal-msg-field');
    var searchErrorMsg = 'The "Search query" field should contain at least one character';
    var dateErrorMsg = '"Published after" date must be earlier than "Published before" date';
    var noVideosErrorMsg = 'No results match your search criteria';
    ctrl.videoDefinitionsOptions = [{
      value: 'any',
      name: 'Any'
    }, {
      value: 'high',
      name: 'HD'
    }, {
      value: 'standard',
      name: 'SD'
    }];
    ctrl.sortOptions = [{
      value: 'titleAsc',
      name: 'Title - ascending'
    }, {
      value: 'titleDsc',
      name: 'Title - descending'
    }, {
      value: 'dateAsc',
      name: 'Date - oldest first'
    }, {
      value: 'dateDsc',
      name: 'Date - newest first'
    }];
    ctrl.videoDurationOptions = [{
      value: 'any',
      name: 'Any'
    }, {
      value: 'short',
      name: 'Less than 4 minutes'
    }, {
      value: 'medium',
      name: 'Between 4 and 20 minutes'
    }, {
      value: 'long',
      name: 'More than 20 minutes'
    }];
    var publishedAfterPikaday = new Pikaday({
      field: document.querySelector('#publishedAfterInput'),
      format: 'YYYY-MM-DD',
      firstDay: 1,
      minDate: new Date('2005-04-23'),
      maxDate: new Date(),
      onSelect: function onSelect() {
        var selectedDay = this.getDate();
        var dayAfterSelectedDay = new Date(selectedDay.setDate(selectedDay.getDate() + 1));
        publishedBeforePikaday.setMinDate(dayAfterSelectedDay);
      }
    });
    var publishedBeforePikaday = new Pikaday({
      field: document.querySelector('#publishedBeforeInput'),
      format: 'YYYY-MM-DD',
      firstDay: 1,
      minDate: new Date('2005-04-24'),
      maxDate: new Date(),
      onSelect: function onSelect() {
        var selectedDay = this.getDate();
        var dayBeforeSelectedDay = new Date(selectedDay.setDate(selectedDay.getDate() - 1));
        publishedAfterPikaday.setMaxDate(dayBeforeSelectedDay);
      }
    });

    ctrl.searchVideos = searchVideos;
    ctrl.setVideoId = setVideoId;
    ctrl.sortOptionsSelected = sortOptionsSelected;
    ctrl.reverse = false;

    function setParams() {
      return {
        query: ctrl.query,
        publishedAfter: ctrl.publishedAfter || '2005-04-23',
        publishedBefore: ctrl.publishedBefore || '2990-01-01',
        videoDefinition: ctrl.videoDefinition,
        videoDuration: ctrl.videoDuration
      };
    }

    function setVideoId(videoId) {
      videoService.setVideoId(videoId);
    }

    function isSearchInputValid() {
      return ctrl.query !== undefined && ctrl.query.length >= 1;
    }

    function showSortOptions() {
      document.querySelector('#sort-options').classList.remove("hide");
    }

    function isResponseValid(data) {
      return data.items.length > 0;
    }

    function addCloseModalEvents() {
      document.querySelector('#close-modal').addEventListener('click', closeModalWindow);
      window.addEventListener('click', function (event) {
        if (event.target === modalWindow) {
          closeModalWindow();
        }
      });
    }

    function showModalWindow(errorMsg) {
      modalWindow.classList.remove("hide");
      modalMsgField.innerText = errorMsg;
      addCloseModalEvents();
    }

    function closeModalWindow() {
      modalWindow.classList.add("hide");
    }

    function showResponse(data) {
      if (isResponseValid(data)) {
        ctrl.videos = data.items;
        showSortOptions();
        console.log(data.items);
        sortOptionsSelected(ctrl.sort);
      } else {
        showModalWindow(noVideosErrorMsg);
      }
    }

    function loadVideos() {
      videoService.getVideosList().then(function (data) {
        showResponse(data);
      });
    }

    function searchVideos() {
      if (isSearchInputValid()) {
        console.log('load videos ON');
        videoService.setQueryParams(setParams());
        loadVideos();
      } else {
        showModalWindow(searchErrorMsg);
      }
    }

    function sortOptionsSelected(sortType) {
      switch (sortType) {
        case 'titleAsc':
          ctrl.reverse = false;
          ctrl.sortQuery = 'snippet.title';
          break;
        case 'titleDsc':
          ctrl.reverse = true;
          ctrl.sortQuery = 'snippet.title';
          break;
        case 'dateAsc':
          ctrl.reverse = false;
          ctrl.sortQuery = 'snippet.publishedAt';
          break;
        case 'dateDsc':
          ctrl.reverse = true;
          ctrl.sortQuery = 'snippet.publishedAt';
          break;
      }
    }
    loadVideos();
  }
})();

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


angular.module('videoList', []);

/***/ }),
/* 13 */,
/* 14 */,
/* 15 */,
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(5);
__webpack_require__(4);
__webpack_require__(6);
__webpack_require__(7);
__webpack_require__(8);
__webpack_require__(12);
__webpack_require__(11);
__webpack_require__(10);
__webpack_require__(9);

/***/ })
],[16]);