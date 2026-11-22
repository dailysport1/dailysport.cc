/* dailysport.cc — оценка статьи (1–5) и «Поделиться». Блок вставляет scripts/add-engage.py. */
(function () {
  var COUNTER = 113806735;
  var path = location.pathname;
  var key = "ds-rate:" + path;

  function goal(name, params) {
    if (typeof window.ym === "function") window.ym(COUNTER, "reachGoal", name, params);
  }

  function store(k, v) {
    try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; }
  }

  var rate = document.querySelector("[data-rate]");
  if (rate) {
    var stars = rate.querySelectorAll(".rate-star");
    var msg = rate.querySelector(".rate-msg");
    var paint = function (n) {
      for (var i = 0; i < stars.length; i++) {
        var on = i < n;
        stars[i].classList.toggle("is-on", on);
        stars[i].setAttribute("aria-checked", String(i === n - 1));
      }
    };
    var saved = parseInt(store(key), 10);
    if (saved >= 1 && saved <= 5) {
      paint(saved);
      msg.textContent = "Ваша оценка: " + saved + " из 5. Спасибо!";
    }
    for (var i = 0; i < stars.length; i++) {
      stars[i].addEventListener("click", function () {
        var n = parseInt(this.getAttribute("data-value"), 10);
        if (n === parseInt(store(key), 10)) return;
        store(key, String(n));
        paint(n);
        msg.textContent = "Ваша оценка: " + n + " из 5. Спасибо!";
        var p = {}; p[path] = n;
        goal("article_rating", { rating: n, page: path });
        if (typeof window.ym === "function") window.ym(COUNTER, "params", { article_rating: p });
      });
    }
    rate.hidden = false;
  }

  var links = document.querySelectorAll("[data-share]");
  for (var j = 0; j < links.length; j++) {
    links[j].addEventListener("click", function () {
      goal("share", { network: this.getAttribute("data-share"), page: path });
    });
  }

  var copy = document.querySelector("[data-copy]");
  if (copy && navigator.clipboard) {
    copy.hidden = false;
    copy.addEventListener("click", function () {
      var btn = this;
      navigator.clipboard.writeText(btn.getAttribute("data-copy")).then(function () {
        btn.textContent = "Ссылка скопирована";
        goal("share", { network: "copy", page: path });
        setTimeout(function () { btn.textContent = "Скопировать ссылку"; }, 2000);
      });
    });
  }

  var native = document.querySelector("[data-native]");
  if (native && navigator.share) {
    native.hidden = false;
    native.addEventListener("click", function () {
      var url = copy ? copy.getAttribute("data-copy") : location.href;
      navigator.share({ title: document.title, url: url }).then(function () {
        goal("share", { network: "native", page: path });
      }).catch(function () {});
    });
  }
})();
