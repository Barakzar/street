"use strict";

// Reveal hidden text of introduction.
let readMoreBtn = document.querySelector(".btn.read-more");
let hiddenSection = document.querySelector(".hidden-section");
readMoreBtn.addEventListener(
  "click",
  (e) => {
    hiddenSection.classList.remove("hidden-section");
    readMoreBtn.remove();
  },
  { once: true }
);

// IntersectionObserver for images animation.
let option = {
  root: null,
  rootMargin: "30% 0px -10px",
  threshold: [0.7],
};
let imgAnimationObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      let figure = document.createElement("figure");

      let img = document.createElement("img");
      img.src = entry.target.dataset.src;
      img.alt = img.title = entry.target.dataset.text;
      figure.append(img);

      let figcaption = document.createElement("figcaption");
      figcaption.innerHTML = entry.target.dataset.text;
      figure.append(figcaption);

      let leftDistance = entry.target.getBoundingClientRect().left;
      let topDistance = (innerHeight - entry.target.offsetHeight) / 2;
      figure.style.position = "fixed";
      figure.style.left = leftDistance + "px";
      figure.style.top = topDistance + "px";

      figure.style.width = entry.target.offsetWidth + "px";
      figure.style.height = entry.target.offsetHeight + "px";
      figure.style.zIndex = entry.target.dataset.zIndex;
      document.body.append(figure);

      document.addEventListener("scroll", (e) => {
        let ratio =
          // The distance of original figure from window's top
          //(start by zero, end by 1 when encounter the window's top)
          1 -
          entry.target.getBoundingClientRect().top /
            entry.boundingClientRect.top;
        ratio = ~~(ratio * 100) / 100;
        console.log(ratio);
        let isWide = innerWidth > 1200;
        let direction = isWide
          ? `${ratio < 0.5 ? 0 : (ratio - 0.5) * 2000}px, 0`
          : `0,${ratio < 0.5 ? 0 : (ratio - 0.5) * 2000}px`;
        figure.style.transform =
          ratio > 1 || ratio < 0
            ? figure.remove() //"translateX(2000px)"
            : `perspective(1000px)  translate(${direction})  scale(${Math.min(
                ratio + 0.5,
                1
              )})`;
      });
    }
  });
}, option);
document.querySelectorAll(".point__images > figure").forEach((figure) => {
  imgAnimationObserver.observe(figure);
});

// IntersectionObserver for point/segment location on the map.
let mapObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      if (entry.target.classList[0] == "segment__intro") {
        document.querySelectorAll("[id^='point']").forEach((point) => {
          point.classList.remove("currentDot");
        });
      }
      if (entry.target.classList[0] == "segment") {
        document.querySelectorAll("[id^='segment']").forEach((segment) => {
          segment.classList.remove("squiggle");
        });
        document
          .getElementById(entry.target.classList[1])
          .classList.add("squiggle");
      }

      if (entry.target.classList[0] == "segment__point") {
        document.querySelectorAll("[id^='point']").forEach((point) => {
          point.classList.remove("currentDot");
        });
        document
          .getElementById(entry.target.classList[1])
          .classList.add("currentDot");
      }
    });
  },
  { rootMargin: "0px 0px -30%" }
);
[
  ...document.querySelectorAll(".segment"),
  ...document.querySelectorAll(".segment__point"),
  ...document.querySelectorAll(".segment__intro"),
].forEach((elem) => mapObserver.observe(elem));
