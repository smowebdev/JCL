$(function () {
  $(".menu-toggle").on("click", function (e) {
    e.stopPropagation();

    $(this).toggleClass("active");
    $(".menu-mobile").toggleClass("active");
  });

  $(".menu-mobile").on("click", function (e) {
    e.stopPropagation();
  });

  $(document).on("click", function () {
    $(".menu-toggle").removeClass("active");
    $(".menu-mobile").removeClass("active");
  });

  $(".menu-mobile a").on("click", function () {
    $(".menu-toggle").removeClass("active");
    $(".menu-mobile").removeClass("active");
  });

  $(".hero-scroll-btn").on("click", function () {
    const $nextSection = $(".home-hero").next("section");

    if (!$nextSection.length) {
      return;
    }

    $("html, body").animate(
      {
        scrollTop: $nextSection.offset().top,
      },
      700,
      "swing",
    );
  });
  // =========================================================
  // Timeline Home Hero - GSAP
  // =========================================================

  const $hero = $(".home-hero");
  const $inner = $(".home-hero-inner");
  const $timelineYear = $(".timeline__year");
  const $heroItems = $(".hero-item");

  if (
    !$hero.length ||
    !$inner.length ||
    !$timelineYear.length ||
    !$heroItems.length
  ) {
    return;
  }

  if (typeof gsap === "undefined") {
    console.warn("GSAP is required.");
    return;
  }

  const STOP_OFFSET = 10;

  const inner = $inner[0];
  const timelineYear = $timelineYear[0];

  const heroItems = $heroItems.toArray();

  const floatingData = [];

  heroItems.forEach((hero) => {
    const floating = hero.querySelector(".hero-side__floating");
    const main = hero.querySelector(".hero-main");

    if (!floating || !main) {
      return;
    }

    floatingData.push({
      hero,
      floating,
      main,
    });
  });

  function calculate() {
    const scrollY = inner.scrollTop;

    gsap.set(timelineYear, {
      y: scrollY,
    });

    floatingData.forEach((item) => {
      const { hero, floating, main } = item;

      const heroTop = hero.offsetTop;
      const heroHeight = hero.offsetHeight;
      const heroBottom = heroTop + heroHeight;

      const floatingHeight = floating.offsetHeight;
      const floatingOriginalTop = floating.offsetTop;

      const mainTop = main.offsetTop;

      const stopTop = mainTop - floatingHeight - STOP_OFFSET;

      const maxMove = Math.max(0, stopTop - floatingOriginalTop);

      if (scrollY <= heroTop) {
        gsap.set(floating, {
          y: 0,
        });

        return;
      }

      if (scrollY >= heroBottom) {
        gsap.set(floating, {
          y: maxMove,
        });

        return;
      }
      const scrollInsideHero = scrollY - heroTop;

      const movement = Math.min(Math.max(scrollInsideHero, 0), maxMove);

      gsap.set(floating, {
        y: movement,
      });
    });
  }

  let ticking = false;

  function requestUpdate() {
    if (ticking) {
      return;
    }

    ticking = true;

    requestAnimationFrame(() => {
      calculate();

      ticking = false;
    });
  }

  $inner.on("scroll", function () {
    requestUpdate();
  });

  $inner.on("wheel", function (event) {
    const deltaY = event.originalEvent.deltaY;

    const maxScroll = inner.scrollHeight - inner.clientHeight;

    const scrollY = inner.scrollTop;

    const atTop = scrollY <= 0;

    const atBottom = scrollY >= maxScroll - 1;

    if (deltaY > 0 && atBottom) {
      event.preventDefault();

      window.scrollBy({
        top: deltaY,
        behavior: "auto",
      });

      return;
    }

    if (deltaY < 0 && atTop) {
      event.preventDefault();

      window.scrollBy({
        top: deltaY,
        behavior: "auto",
      });

      return;
    }
  });

  let resizeTimer;

  $(window).on("resize", function () {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(() => {
      calculate();
    }, 100);
  });

  calculate();
});
