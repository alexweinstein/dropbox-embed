(function () {
  var script = document.currentScript;
  if (!script) return;

  var href = script.getAttribute("data-href");
  if (!href) {
    console.warn("dropbox-embed: missing data-href attribute on script tag");
    return;
  }
  var title = script.getAttribute("data-title");

  var src = new URL("index.html", script.src);
  src.searchParams.set("href", href);
  if (title) src.searchParams.set("title", title);

  var iframe = document.createElement("iframe");
  iframe.src = src.toString();
  iframe.width = "100%";
  iframe.height = "60";
  iframe.style.width = "100%";
  iframe.style.border = "0";
  iframe.frameBorder = "0";
  iframe.setAttribute("allow", "autoplay; fullscreen");
  iframe.allowFullscreen = true;

  script.parentNode.insertBefore(iframe, script.nextSibling);

  if (!window.__dropboxEmbedListener) {
    window.__dropboxEmbedListener = true;
    window.addEventListener("message", function (e) {
      if (!e.data || e.data.source !== "dropbox-embed") return;
      var iframes = document.getElementsByTagName("iframe");

      if (e.data.type === "resize") {
        for (var i = 0; i < iframes.length; i++) {
          if (iframes[i].contentWindow === e.source) {
            iframes[i].style.height = e.data.height + "px";
            break;
          }
        }
      } else if (e.data.type === "play") {
        for (var j = 0; j < iframes.length; j++) {
          if (iframes[j].contentWindow !== e.source) {
            iframes[j].contentWindow.postMessage({ source: "dropbox-embed", type: "pause" }, "*");
          }
        }
      }
    });
  }
})();
