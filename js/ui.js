(function () {
  var config = window.LoadingConfig;
  var progress = window.LoadingProgress;
  var title = document.getElementById("title");
  var subtitle = document.getElementById("subtitle");
  var tagline = document.getElementById("tagline");
  var build = document.getElementById("build");
  var statusLine = document.getElementById("status-line");
  var fileLine = document.getElementById("file-line");
  var barFill = document.getElementById("bar-fill");
  var steps = document.getElementById("steps");
  var player = document.getElementById("player");
  var playerAvatar = document.getElementById("player-avatar");
  var playerName = document.getElementById("player-name");
  var playerId = document.getElementById("player-id");

  var state = {
    total: 0,
    needed: 0,
    status: "",
    fileName: "",
    serverName: "",
    steam64: "",
    persona: "",
    avatar: "",
    build: ""
  };

  function buildSteps() {
    var index;
    steps.textContent = "";
    for (index = 0; index < config.steps.length; index += 1) {
      var item = document.createElement("li");
      var dot = document.createElement("span");
      var label = document.createElement("span");
      dot.className = "dot";
      label.textContent = config.steps[index];
      item.appendChild(dot);
      item.appendChild(label);
      steps.appendChild(item);
    }
  }

  function render() {
    var percent = progress.computePercent(state.total, state.needed);
    var current = progress.activeStep(percent, state.status);
    var items = steps.children;
    var index;

    title.textContent = config.title;
    subtitle.textContent = config.subtitle;
    tagline.textContent = config.tagline;
    build.textContent = "Build " + (state.build || config.build);
    document.title = config.title + " " + config.subtitle;

    var fileLabel = state.fileName || "";
    statusLine.textContent = state.status || "Connecting to server...";
    if (state.total > 0) {
      var done = Math.max(0, state.total - Math.max(0, state.needed));
      fileLabel = done + " / " + state.total + (fileLabel ? "  ·  " + fileLabel : "");
    }
    fileLine.textContent = fileLabel;
    fileLine.hidden = !fileLabel;
    fileLine.title = state.fileName || "";
    barFill.style.width = (percent == null ? 8 : percent) + "%";
    barFill.classList.toggle("is-waiting", percent == null);

    for (index = 0; index < items.length; index += 1) {
      items[index].classList.toggle("is-done", index < current);
      items[index].classList.toggle("is-active", index === current);
    }

    var steamLabel = progress.toSteam2(state.steam64);
    player.hidden = !state.steam64;
    playerName.textContent = state.persona || "Connecting";
    playerId.textContent = steamLabel;
    if (state.avatar) {
      playerAvatar.hidden = false;
      if (playerAvatar.getAttribute("src") !== state.avatar) playerAvatar.src = state.avatar;
    } else {
      playerAvatar.hidden = true;
      playerAvatar.removeAttribute("src");
    }
  }

  buildSteps();
  render();

  if (config.schemaUrl) {
    var schemaUrl = config.schemaUrl + (config.schemaUrl.indexOf("?") >= 0 ? "&" : "?") + "t=" + Date.now();
    fetch(schemaUrl, { cache: "no-store" })
      .then(function (response) {
        if (!response.ok) throw new Error(String(response.status));
        return response.json();
      })
      .then(function (body) {
        if (!body || !body.version) return;
        state.build = String(body.version);
        render();
      })
      .catch(function () {});
  }

  window.LoadingUI = {
    render: render,
    setDetails: function (details) {
      state.serverName = details.serverName || "";
      render();
    },
    setFilesTotal: function (total) {
      state.total = Number(total) || 0;
      render();
    },
    setFilesNeeded: function (needed) {
      state.needed = Number(needed) || 0;
      render();
    },
    setStatus: function (status) {
      state.status = status ? String(status) : "";
      render();
    },
    setFile: function (fileName) {
      state.fileName = fileName ? String(fileName) : "";
      render();
    },
    setPlayer: function (steam64) {
      var id = String(steam64 || "").replace(/\D/g, "");
      if (!/^\d{17}$/.test(id) || id === state.steam64) {
        state.steam64 = id || state.steam64;
        render();
        return;
      }
      state.steam64 = id;
      state.persona = "";
      state.avatar = "";
      render();
      fetch("https://playerdb.co/api/player/steam/" + id)
        .then(function (response) { return response.json(); })
        .then(function (body) {
          if (state.steam64 !== id) return;
          var profile = body && body.data && body.data.player;
          if (!profile) return;
          state.persona = profile.username || "";
          state.avatar = profile.avatar || "";
          render();
        })
        .catch(function () {});
    }
  };
})();
