(function () {
  var ui = window.LoadingUI;
  var params = new URLSearchParams(window.location.search);

  function useSteamId(steamId) {
    if (steamId) ui.setPlayer(steamId);
  }

  window.__gmodHandlers = {
    GameDetails: function (serverName, serverUrl, mapName, maxPlayers, steamId) {
      window.__gmodLive = true;
      ui.setDetails({ serverName: serverName });
      useSteamId(steamId);
    },
    SetFilesTotal: function (total) {
      window.__gmodLive = true;
      ui.setFilesTotal(total);
    },
    SetFilesNeeded: function (needed) {
      window.__gmodLive = true;
      ui.setFilesNeeded(needed);
    },
    DownloadingFile: function (fileName) {
      window.__gmodLive = true;
      ui.setFile(fileName);
    },
    SetStatusChanged: function (status) {
      window.__gmodLive = true;
      var text = String(status || "");
      if (!text.trim() || window.LoadingProgress.isPhaseStatus(text)) {
        ui.setStatus(text);
        return;
      }
      ui.setFile(window.LoadingProgress.contentLabel(text));
    }
  };

  window.__gmodReady = true;
  while (window.__gmodQueue.length) {
    var entry = window.__gmodQueue.shift();
    window.__gmodHandlers[entry[0]].apply(null, entry[1]);
  }

  useSteamId(params.get("steamid"));
})();
