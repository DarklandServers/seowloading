(function () {
  var host = window.location.hostname;
  var params = new URLSearchParams(window.location.search);
  var previewFlag = params.get("preview");
  var enabled = previewFlag === "1" ||
    (previewFlag !== "0" && (host === "localhost" || host === "127.0.0.1" || window.location.protocol === "file:"));

  if (!enabled || window.__gmodSawCall) return;

  var ui = window.LoadingUI;
  if (!params.get("steamid")) ui.setPlayer("76561197960287930");
  var total = 200;
  var needed = total;
  var files = [
    "materials/models/props/warehouse_wall.vmt",
    "models/props/dock_container.mdl",
    "sound/ambient/harbor_horn.wav",
    "maps/rp_downtown.bsp"
  ];
  var timer = window.setInterval(function () {
    if (window.__gmodLive) {
      window.clearInterval(timer);
      return;
    }
    needed = Math.max(0, needed - 2);
    ui.setFilesTotal(total);
    ui.setFilesNeeded(needed);
    ui.setFile(files[Math.floor(((total - needed) / total) * files.length) % files.length] || "");
    if (needed === 0) {
      ui.setFile("");
      ui.setStatus("Starting Lua...");
      window.clearInterval(timer);
    }
  }, 80);
})();
