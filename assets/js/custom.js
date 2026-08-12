jQuery(document).ready(function ($) {
  const $menuToggle = $(".menu-toggle");
  const $mobileMenu = $(".menu-mobile");
  const $wechat = $(".js-wechat");
  const $wechatTrigger = $(".js-wechat-trigger");
  const $wechatQr = $(".js-wechat-qr");

  $wechatTrigger.on("click", function (e) {
    if (window.innerWidth < 768) {
      e.preventDefault();
      e.stopPropagation();

      $wechatQr.toggleClass("hidden");
    }
  });
  // Toggle Menu - Start
  $menuToggle.on("click", function (e) {
    e.stopPropagation();

    $(this).toggleClass("active");
    $mobileMenu.toggleClass("active");

    if (!$mobileMenu.hasClass("active")) {
      $wechatQr.addClass("hidden");
    }
  });

  $mobileMenu.on("click", function (e) {
    if ($(e.target).closest(".js-wechat").length) {
      e.stopPropagation();
      return;
    }

    $wechatQr.addClass("hidden");

    e.stopPropagation();
  });

  $(document).on("click", function (e) {
    if (!$(e.target).closest(".menu-mobile").length) {
      $wechatQr.addClass("hidden");

      $menuToggle.removeClass("active");
      $mobileMenu.removeClass("active");
    }
  });

  $mobileMenu.find("a").on("click", function () {
    $wechatQr.addClass("hidden");

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

    const $timelinePrev = $(".timeline__btn--prev");
    const $timelineNext = $(".timeline__btn--next");

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

    function getCurrentHeroIndex() {
      const scrollY = homeHeroInner.scrollTop;

      const viewportCenter = scrollY + homeHeroInner.clientHeight / 2;

      let currentIndex = 0;

      heroItemElements.forEach(function (hero, index) {
        const heroTop = hero.offsetTop;
        const heroBottom = heroTop + hero.offsetHeight;

        if (viewportCenter >= heroTop && viewportCenter < heroBottom) {
          currentIndex = index;
        }
      });

      return currentIndex;
    }

    function scrollToHero(index) {
      if (index < 0 || index >= heroItemElements.length) {
        return;
      }

      const targetHero = heroItemElements[index];

      $homeHeroInner.stop().animate(
        {
          scrollTop: targetHero.offsetTop,
        },
        600,
      );
    }

    $timelinePrev.on("click", function () {
      const currentIndex = getCurrentHeroIndex();

      scrollToHero(currentIndex - 1);
    });

    $timelineNext.on("click", function () {
      const currentIndex = getCurrentHeroIndex();

      scrollToHero(currentIndex + 1);
    });

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
  // Sector Item Toggle - Start
  $('.sector-item').each(function () {
    const $item = $(this);
    const $toggle = $item.find('.sector-toggle');
    const $content = $item.find('.sector-content');
    const $icon = $item.find('.sector-icon');

    $toggle.on('click', function () {
      if ($(window).width() >= 768) return;

      const isOpen = $content.hasClass('is-open');

      if (isOpen) {
        $content
          .removeClass('is-open')
          .addClass('grid-rows-[0fr]');

        $icon.removeClass('rotate-180');
      } else {
        $content
          .addClass('is-open')
          .removeClass('grid-rows-[0fr]');

        $icon.addClass('rotate-180');
      }
    });
  });
  // Sector Item Toggle - End

  // Group Toggle - Start
  $('.group[data-tab]').on('click', function () {
    $(this).toggleClass('active');
  });
  // Group Toggle - End

  $('.btn-toggle').on('click', function (e) {
    e.preventDefault();

    $(this).toggleClass('bg-tertiary text-white border-tertiary');
  });

  // Form Popup - Start
  const $formPopup = $("[data-form-popup]");
  const $formContent = $(".form-content");

  $(".js-form-trigger").on("click", function () {
    const formType = $(this).data("form-type");

    $formContent.addClass("hidden");

    $(`[data-form-content="${formType}"]`).removeClass("hidden");

    $formPopup.addClass("is-open");
    $("body").addClass("popup-form-open");
  });

  $(".js-form-close").on("click", function () {
    closeFormPopup();
  });

  $(document).on("keydown", function (e) {
    if (e.key === "Escape") {
      closeFormPopup();
    }
  });

  function closeFormPopup() {
    $formPopup.removeClass("is-open");
    $("body").removeClass("popup-form-open");
  }
  // Form Popup - End

  // Map - Start
  const key = "QTfFDTPWze2jdhLgnmCb";

  const map = L.map("map").setView([22.1917797, 113.5403743], 16);

  const mtLayer = L.maptiler
    .maptilerLayer({
      apiKey: key,
      style: "base-v4",
    })
    .addTo(map);

  const locationIcon = L.divIcon({
    className: "custom-location-marker",
    html: `
           <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100%" height="100%" viewBox="0 0 48 48">
<path fill="#48b564" d="M35.76,26.36h0.01c0,0-3.77,5.53-6.94,9.64c-2.74,3.55-3.54,6.59-3.77,8.06	C24.97,44.6,24.53,45,24,45s-0.97-0.4-1.06-0.94c-0.23-1.47-1.03-4.51-3.77-8.06c-0.42-0.55-0.85-1.12-1.28-1.7L28.24,22l8.33-9.88	C37.49,14.05,38,16.21,38,18.5C38,21.4,37.17,24.09,35.76,26.36z"></path><path fill="#fcc60e" d="M28.24,22L17.89,34.3c-2.82-3.78-5.66-7.94-5.66-7.94h0.01c-0.3-0.48-0.57-0.97-0.8-1.48L19.76,15	c-0.79,0.95-1.26,2.17-1.26,3.5c0,3.04,2.46,5.5,5.5,5.5C25.71,24,27.24,23.22,28.24,22z"></path><path fill="#2c85eb" d="M28.4,4.74l-8.57,10.18L13.27,9.2C15.83,6.02,19.69,4,24,4C25.54,4,27.02,4.26,28.4,4.74z"></path><path fill="#ed5748" d="M19.83,14.92L19.76,15l-8.32,9.88C10.52,22.95,10,20.79,10,18.5c0-3.54,1.23-6.79,3.27-9.3	L19.83,14.92z"></path><path fill="#5695f6" d="M28.24,22c0.79-0.95,1.26-2.17,1.26-3.5c0-3.04-2.46-5.5-5.5-5.5c-1.71,0-3.24,0.78-4.24,2L28.4,4.74	c3.59,1.22,6.53,3.91,8.17,7.38L28.24,22z"></path>
</svg>
        `,
    iconSize: [48, 48],
    iconAnchor: [24, 48],
    popupAnchor: [0, -48],
  });

  L.marker([22.1917797, 113.5403743], {
    icon: locationIcon,
  })
    .addTo(map)
    .bindPopup(
      `
        <strong>Avenida Praia Grande No.325</strong><br>
        Edif. Cheong Fai 1ºA, Macau
    `,
    )
    .openPopup();

  // Map - End

});
