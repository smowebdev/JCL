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

  // =========================================================
  // Timeline Home Hero
  // =========================================================

  const $homeHero = $(".home-hero");
  const $heroInner = $(".home-hero-inner");
  const $floatingItems = $(".hero-side__floating");
  const $timelineYear = $(".timeline__year");
  const $heroItems = $(".hero-item");
  const $heroScroll = $(".home-hero__scroll");

  if (
    !$homeHero.length ||
    !$heroInner.length ||
    !$floatingItems.length ||
    !$timelineYear.length ||
    !$heroItems.length
  ) {
    return;
  }

  const isMobile = window.matchMedia("(max-width: 767px)").matches;

  const STOP_OFFSET = 10;

  let timelineYearFixed = false;

  function getTimelineEarlyOffset() {
    return $heroScroll.length ? $heroScroll.outerHeight() : 0;
  }

  function update() {
    const scrollY = $heroInner.scrollTop();

    const $firstHero = $heroItems.first();
    const $lastHero = $heroItems.last();

    if (!$firstHero.length || !$lastHero.length) {
      return;
    }

    const firstHeroTop = $firstHero[0].offsetTop;

    const lastHeroTop = $lastHero[0].offsetTop;
    const lastHeroHeight = $lastHero.outerHeight();

    const lastHeroBottom = lastHeroTop + lastHeroHeight;

    const TIMELINE_EARLY_OFFSET = getTimelineEarlyOffset();

    const timelineStart = lastHeroTop - TIMELINE_EARLY_OFFSET;

    if (scrollY < firstHeroTop) {
      $timelineYear.removeClass("is-fixed is-stop").css("top", "");

      timelineYearFixed = false;
    }

    $floatingItems.each(function () {
      const $floating = $(this);

      const $hero = $floating.closest(".hero-item");
      const $main = $hero.find(".hero-main").first();

      if (!$hero.length || !$main.length) {
        return;
      }

      const heroTop = $hero[0].offsetTop;
      const heroHeight = $hero.outerHeight();

      const heroBottom = heroTop + heroHeight;

      const floatingHeight = $floating.outerHeight();

      const mainTop = heroTop + $main[0].offsetTop;

      const stopPoint = mainTop - floatingHeight - STOP_OFFSET;

      const isLastHero = $hero[0] === $lastHero[0];

      if (!isLastHero) {
        $floating.removeClass("is-fixed is-stop").css("top", "");
      }

      if (scrollY < heroTop) {
        return;
      }

      if (isLastHero) {
        return;
      }

      if (scrollY >= heroTop && scrollY < stopPoint) {
        $floating.addClass("is-fixed");

        if (!timelineYearFixed) {
          $timelineYear
            .removeClass("is-stop")
            .addClass("is-fixed")
            .css("top", "");

          timelineYearFixed = true;
        }

        return;
      }

      if (scrollY >= stopPoint && scrollY <= heroBottom) {
        $floating
          .addClass("is-stop")
          .css("top", $main[0].offsetTop - floatingHeight - STOP_OFFSET + "px");

        return;
      }
    });

    if (scrollY >= timelineStart && scrollY <= lastHeroBottom) {
      const $lastFloating = $lastHero.find(".hero-side__floating").first();

      if ($lastFloating.length) {
        const lastFloatingTop = lastHeroTop + $lastFloating[0].offsetTop;

        $timelineYear
          .removeClass("is-fixed is-stop")
          .css("top", lastFloatingTop + "px");

        timelineYearFixed = false;
      }
    }

    if (scrollY < timelineStart && scrollY >= firstHeroTop) {
      $timelineYear.css("top", "").removeClass("is-stop").addClass("is-fixed");

      timelineYearFixed = true;
    }

    if (scrollY > lastHeroBottom) {
      const $lastFloating = $lastHero.find(".hero-side__floating").first();

      if ($lastFloating.length) {
        const lastFloatingTop = lastHeroTop + $lastFloating[0].offsetTop;

        $timelineYear
          .removeClass("is-fixed is-stop")
          .css("top", lastFloatingTop + "px");
      }

      timelineYearFixed = false;
    }
  }

  let ticking = false;

  $heroInner.on("scroll", function () {
    if (ticking) {
      return;
    }

    ticking = true;

    window.requestAnimationFrame(function () {
      update();

      ticking = false;
    });
  });

  $(window).on("resize", function () {
    update();
  });

  update();
});
