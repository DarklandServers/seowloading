(function () {
  var queue = [];
  window.__gmodQueue = queue;
  window.__gmodReady = false;
  window.__gmodSawCall = false;

  function enqueue(name, args) {
    window.__gmodSawCall = true;
    if (window.__gmodReady && window.__gmodHandlers && window.__gmodHandlers[name]) {
      window.__gmodHandlers[name].apply(null, args);
      return;
    }
    queue.push([name, args]);
  }

  window.GameDetails = function () { enqueue("GameDetails", arguments); };
  window.SetFilesTotal = function () { enqueue("SetFilesTotal", arguments); };
  window.SetFilesNeeded = function () { enqueue("SetFilesNeeded", arguments); };
  window.DownloadingFile = function () { enqueue("DownloadingFile", arguments); };
  window.SetStatusChanged = function () { enqueue("SetStatusChanged", arguments); };
})();
