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

  // Timeline Home Hero - Start
  const $floatingItems = $(".hero-side__floating");

  const isMobile = window.matchMedia("(max-width: 767px)").matches;
  const STOP_OFFSET = isMobile ? 30 : 40;

  $floatingItems.each(function () {
    const $floating = $(this);

    $floating.data("original-top", this.offsetTop);
  });

  function update() {
    const scrollY = $(window).scrollTop();

    $floatingItems.each(function () {
      const floating = this;
      const $floating = $(floating);

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

      $floating.removeClass("is-fixed is-stop").css("top", "");

      if (scrollY < heroTop) {
        return;
      }

      if (scrollY >= heroTop && scrollY < stopPoint) {
        $floating.addClass("is-fixed");

        return;
      }

      if (scrollY >= stopPoint && scrollY <= heroBottom) {
        console.log(1);

        $floating
          .addClass("is-stop")
          .css("top", $main[0].offsetTop - floatingHeight - STOP_OFFSET + "px");

        return;
      }
    });
  }

  let ticking = false;

  $(window).on("scroll", function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        update();

        ticking = false;
      });

      ticking = true;
    }
  });

  $(window).on("resize", function () {
    update();
  });

  update();
  // Timeline Home Hero - End
});
