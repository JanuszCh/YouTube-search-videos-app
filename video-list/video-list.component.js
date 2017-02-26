(function () {
  'use strict';

  angular
    .module('videoList')
    .component('videoList', {
      templateUrl: 'video-list/video-list.template.html',
      controller: videoListController
    });

  videoListController.inject = ['videoService'];

  function videoListController(videoService) {
    const ctrl = this,
          modalWindow = document.querySelector('#modal'),
          modalMsgField = document.querySelector('#modal-msg-field'),
          searchErrorMsg = 'The "Search query" field should contain at least one character',
          noVideosErrorMsg = 'No results match your search criteria';
    ctrl.videoDefinitionsOptions = [{
        value: 'any',
        name: 'Any'
      },
      {
        value: 'high',
        name: 'HD'
      },
      {
        value: 'standard',
        name: 'SD'
      }
    ];
    ctrl.sortOptions = [{
        value: 'titleAsc',
        name: 'Title - ascending'
      },
      {
        value: 'titleDsc',
        name: 'Title - descending'
      },
      {
        value: 'dateAsc',
        name: 'Date - oldest first'
      },
      {
        value: 'dateDsc',
        name: 'Date - newest first'
      }
    ];
    ctrl.videoDurationOptions = [{
        value: 'any',
        name: 'Any'
      },
      {
        value: 'short',
        name: 'Less than 4 minutes'
      },
      {
        value: 'medium',
        name: 'Between 4 and 20 minutes'
      },
      {
        value: 'long',
        name: 'More than 20 minutes'
      }
    ];
    let publishedAfterPikaday = new Pikaday({
      field: document.querySelector('#publishedAfterInput'),
      format: 'YYYY-MM-DD',
      firstDay: 1,
      minDate: new Date('2005-04-23'),
      maxDate: new Date(),
      onSelect: function () {
        let selectedDay = this.getDate();
        let dayAfterSelectedDay = new Date(selectedDay.setDate(selectedDay.getDate() + 1));
        publishedBeforePikaday.setMinDate(dayAfterSelectedDay);
      }
    });
    let publishedBeforePikaday = new Pikaday({
      field: document.querySelector('#publishedBeforeInput'),
      format: 'YYYY-MM-DD',
      firstDay: 1,
      minDate: new Date('2005-04-24'),
      maxDate: new Date(),
      onSelect: function () {
        let selectedDay = this.getDate();
        let dayBeforeSelectedDay = new Date(selectedDay.setDate(selectedDay.getDate() - 1));
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
      window.addEventListener('click', (event) => {
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
        sortOptionsSelected(ctrl.sort);
      } else {
        showModalWindow(noVideosErrorMsg);
      }
    }

    function loadVideos() {
      videoService.getVideosList().then((data) => {
        showResponse(data);
      });
    }

    function searchVideos() {
      if (isSearchInputValid()) {
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