$(function () {
  // =========================================================
  // Timeline Home Hero - Start
  // =========================================================

  const $floatingItems = $(".hero-side__floating");
  const $timelineYear = $(".timeline__year");
  const $heroItems = $(".hero-item");

  if (!$floatingItems.length || !$timelineYear.length || !$heroItems.length) {
    return;
  }

  // =========================================================
  // SETTINGS
  // =========================================================

  const isMobile = window.matchMedia("(max-width: 767px)").matches;

  const STOP_OFFSET = isMobile ? 30 : 40;

  /*
   * Timeline year chỉ được add is-fixed
   * một lần khi bắt đầu scroll vào hero.
   *
   * Sau đó giữ nguyên is-fixed xuyên suốt
   * các hero-item.
   */
  let timelineYearFixed = false;

  // =========================================================
  // UPDATE
  // =========================================================

  function update() {
    const scrollY = $(window).scrollTop();

    // =======================================================
    // FIRST / LAST HERO
    // =======================================================

    const $firstHero = $heroItems.first();
    const $lastHero = $heroItems.last();

    const firstHeroTop = $firstHero[0].offsetTop;

    const lastHeroTop = $lastHero[0].offsetTop;

    const lastHeroHeight = $lastHero.outerHeight();

    const lastHeroBottom = lastHeroTop + lastHeroHeight;

    // =======================================================
    // FLOATING ITEMS
    // =======================================================

    $floatingItems.each(function () {
      const floating = this;
      const $floating = $(floating);

      const $hero = $floating.closest(".hero-item");

      const $main = $hero.find(".hero-main").first();

      if (!$hero.length || !$main.length) {
        return;
      }

      // =====================================================
      // HERO DIMENSIONS
      // =====================================================

      const heroTop = $hero[0].offsetTop;

      const heroHeight = $hero.outerHeight();

      const heroBottom = heroTop + heroHeight;

      const floatingHeight = $floating.outerHeight();

      const mainTop = heroTop + $main[0].offsetTop;

      /*
       * Điểm floating chạm vùng hero-main
       */
      const stopPoint = mainTop - floatingHeight - STOP_OFFSET;

      // =====================================================
      // RESET FLOATING
      // =====================================================

      $floating.removeClass("is-fixed is-stop").css("top", "");

      // =====================================================
      // HERO CHƯA TỚI
      // =====================================================

      if (scrollY < heroTop) {
        return;
      }

      // =====================================================
      // CHECK HERO CUỐI
      // =====================================================

      const isLastHero = $hero[0] === $lastHero[0];

      // =====================================================
      // HERO CUỐI CÙNG
      // =====================================================

      if (isLastHero) {
        /*
         * -----------------------------------------------
         * FLOATING
         * -----------------------------------------------
         *
         * is-fixed
         *     ↓
         * remove
         *     ↓
         * is-stop
         */

        $floating.removeClass("is-fixed").addClass("is-stop");

        /*
         * -----------------------------------------------
         * TIMELINE YEAR
         * -----------------------------------------------
         *
         * is-fixed
         *     ↓
         * remove
         *     ↓
         * is-stop
         */

        $timelineYear.removeClass("is-fixed").addClass("is-stop");

        timelineYearFixed = false;

        /*
         * Floating vẫn dừng tại hero-main.
         */

        return;
      }

      // =====================================================
      // HERO BÌNH THƯỜNG
      // =====================================================

      // =====================================================
      // FLOATING → FIXED
      // =====================================================

      if (scrollY >= heroTop && scrollY < stopPoint) {
        $floating.addClass("is-fixed");

        /*
         * Timeline year chỉ add is-fixed
         * lần đầu tiên.
         */

        if (!timelineYearFixed) {
          $timelineYear.removeClass("is-stop").addClass("is-fixed");

          timelineYearFixed = true;
        }

        return;
      }

      // =====================================================
      // FLOATING → STOP
      // =====================================================

      if (scrollY >= stopPoint && scrollY <= heroBottom) {
        $floating
          .addClass("is-stop")
          .css("top", $main[0].offsetTop - floatingHeight - STOP_OFFSET + "px");

        /*
         * QUAN TRỌNG:
         *
         * Không remove is-fixed của timeline year.
         *
         * Timeline year vẫn:
         *
         * .is-fixed
         */

        return;
      }
    });

    // =======================================================
    // RESET TIMELINE KHI SCROLL RA KHỎI HOME HERO
    // =======================================================

    /*
     * Chỉ reset khi scroll ngược lên
     * phía trên Home Hero.
     */

    /*
     * Không reset timeline khi scroll xuống
     * qua đáy hero cuối.
     *
     * Hero cuối đã tự chuyển:
     *
     * is-fixed → is-stop
     */
  }

  // =========================================================
  // SCROLL
  // =========================================================

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

  // =========================================================
  // RESIZE
  // =========================================================

  $(window).on("resize", function () {
    update();
  });

  // =========================================================
  // INITIAL
  // =========================================================

  update();

  // =========================================================
  // Timeline Home Hero - End
  // =========================================================
});
