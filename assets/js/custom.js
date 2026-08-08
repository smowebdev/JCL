$(function () {
  "use strict";

  // Toggle Menu - Start
  const $menuToggle = $(".menu-toggle");
  const $mobileMenu = $(".menu-mobile");

  $menuToggle.on("click", function (e) {
    e.stopPropagation();

    $(this).toggleClass("active");
    $mobileMenu.toggleClass("active");
  });

  $mobileMenu.on("click", function (e) {
    e.stopPropagation();
  });

  $(document).on("click", function () {
    $menuToggle.removeClass("active");
    $mobileMenu.removeClass("active");
  });

  $mobileMenu.find("a").on("click", function () {
    $menuToggle.removeClass("active");
    $mobileMenu.removeClass("active");
  });
  // Toggle Menu - End

  // Hero Scroll Button - Start
  const $heroScrollButton = $(".hero-scroll-btn");

  $heroScrollButton.on("click", function () {
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
  // Hero Scroll Button - End

  // Timeline Home Hero - GSAP - Start
  const $homeHero = $(".home-hero");
  const $homeHeroInner = $(".home-hero-inner");
  const $timelineYear = $(".timeline__year");
  const $heroItems = $(".hero-item");

  if (
    $homeHero.length &&
    $homeHeroInner.length &&
    $timelineYear.length &&
    $heroItems.length &&
    typeof gsap !== "undefined"
  ) {
    const STOP_OFFSET = 10;

    const homeHeroInner = $homeHeroInner[0];
    const timelineYearElement = $timelineYear[0];
    const heroItemElements = $heroItems.toArray();

    const floatingItems = [];

    heroItemElements.forEach(function (heroItem) {
      const floating = heroItem.querySelector(".hero-side__floating");

      const main = heroItem.querySelector(".hero-main");

      if (!floating || !main) {
        return;
      }

      floatingItems.push({
        hero: heroItem,
        floating: floating,
        main: main,
      });
    });

    function calculateTimeline() {
      const scrollY = homeHeroInner.scrollTop;

      gsap.set(timelineYearElement, {
        y: scrollY,
      });

      floatingItems.forEach(function (item) {
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

    let timelineTicking = false;

    function requestTimelineUpdate() {
      if (timelineTicking) {
        return;
      }

      timelineTicking = true;

      requestAnimationFrame(function () {
        calculateTimeline();
        timelineTicking = false;
      });
    }

    $homeHeroInner.on("scroll", function () {
      requestTimelineUpdate();
    });

    $homeHeroInner.on("wheel", function (event) {
      const deltaY = event.originalEvent.deltaY;

      const maxScroll = homeHeroInner.scrollHeight - homeHeroInner.clientHeight;

      const scrollY = homeHeroInner.scrollTop;

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
      }
    });

    let timelineResizeTimer;

    $(window).on("resize", function () {
      clearTimeout(timelineResizeTimer);

      timelineResizeTimer = setTimeout(function () {
        calculateTimeline();
      }, 100);
    });

    calculateTimeline();
  }
  // Timeline Home Hero - GSAP - End

  // Counter Animation - Start
  const $counterElements = $(".js-counter");

  if ($counterElements.length) {
    function animateCounter($counter) {
      const target = parseInt($counter.data("count"), 10);

      if (isNaN(target)) {
        return;
      }

      const duration = 1200;
      const startTime = performance.now();

      function update(currentTime) {
        const progress = Math.min((currentTime - startTime) / duration, 1);

        const ease = 1 - Math.pow(1 - progress, 3);

        const value = Math.floor(target * ease);

        $counter.text(value);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          $counter.text(target);
        }
      }

      requestAnimationFrame(update);
    }

    const counterObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          const $counter = $(entry.target);

          animateCounter($counter);

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.5,
      },
    );

    $counterElements.each(function () {
      counterObserver.observe(this);
    });
  }
  // Counter Animation - End

  // Client Logo Marquee - Start
  $(".client-logo-marquee").each(function () {
    const $marquee = $(this);
    const $originalTrack = $marquee.children(".client-logo-track").first();

    if (!$originalTrack.length) {
      return;
    }

    const duplicate = Math.max(
      3,
      parseInt($marquee.data("duplicate"), 10) || 2,
    );

    for (let i = 1; i < duplicate; i++) {
      const $clone = $originalTrack.clone();

      $clone.addClass("client-logo-track-clone");

      $marquee.append($clone);
    }
  });
  // Client Logo Marquee - End
});
