(function (root, factory) {
  if (typeof module === "object" && module.exports) {
    module.exports = factory();
  } else {
    root.LoadingProgress = factory();
  }
})(typeof self !== "undefined" ? self : this, function () {
  function computePercent(total, needed) {
    var files = Number(total);
    var remaining = Number(needed);
    if (!isFinite(files) || files <= 0) return null;
    if (!isFinite(remaining) || remaining < 0) remaining = 0;
    if (remaining > files) remaining = files;
    return Math.round(((files - remaining) / files) * 100);
  }

  function baseName(path) {
    var value = String(path || "");
    var parts = value.split(/[/\\]/);
    return parts[parts.length - 1] || value;
  }

  function toSteam2(steam64) {
    var id = String(steam64 || "").trim();
    if (!/^\d{17}$/.test(id)) return id;
    var account = BigInt(id) - BigInt("76561197960265728");
    if (account < 0n) return id;
    return "STEAM_0:" + (account % 2n).toString() + ":" + (account / 2n).toString();
  }

  function parseSchemaVersion(source) {
    var match = String(source || "").match(/Schema\.version\s*=\s*(?:"([^"]*)"|'([^']*)'|([0-9][0-9A-Za-z._-]*))/);
    if (!match) return "";
    return match[1] || match[2] || match[3] || "";
  }

  function activeStep(percent, status) {
    var text = String(status || "").toLowerCase();
    if (text.indexOf("lua") >= 0 || text.indexOf("client info") >= 0) return 3;
    if (text.indexOf("map") >= 0 || text.indexOf("workshop") >= 0) return 2;
    if (percent == null) return 0;
    if (percent >= 92) return 3;
    if (percent >= 55) return 2;
    if (percent >= 8) return 1;
    return 0;
  }

  return {
    computePercent: computePercent,
    baseName: baseName,
    toSteam2: toSteam2,
    parseSchemaVersion: parseSchemaVersion,
    activeStep: activeStep
  };
});
