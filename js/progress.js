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

  function isFileStatus(status) {
    var text = String(status || "").trim();
    if (!text) return false;
    if (/[/\\]/.test(text)) return true;
    if (/^downloading\b/i.test(text)) return true;
    return /\.(vmt|vtf|mdl|phy|vtx|vvd|ani|bsp|nav|ain|wav|mp3|ogg|png|jpg|jpeg|tga|lua|txt|pcf|gma|bz2|ztmp|res|cache|duv)$/i.test(text);
  }

  function isPhaseStatus(status) {
    var text = String(status || "").trim();
    if (!text) return false;
    return /^(connecting|connection|retrying|lost connection|retrieving server|getting addon info|error getting addon|no addon|mounting addons|workshop complete|received all files|sending client info|client info sent|starting lua|lua started|fully connected|no files|disconnect)/i.test(text);
  }

  function contentLabel(status) {
    return String(status || "")
      .replace(/^downloading\s+/i, "")
      .replace(/\s+via workshop$/i, "")
      .replace(/^'+|'+$/g, "")
      .trim();
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
    isFileStatus: isFileStatus,
    isPhaseStatus: isPhaseStatus,
    contentLabel: contentLabel,
    toSteam2: toSteam2,
    parseSchemaVersion: parseSchemaVersion,
    activeStep: activeStep
  };
});
