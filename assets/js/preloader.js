// Remove this code in sage theme
import { gsap } from "../../node_modules/gsap/index.js";
import Cookies from "../../node_modules/js-cookie/dist/js.cookie.mjs";

// Use this code in sage
// import { gsap } from "gsap";
// import Cookies from "js-cookie";

function preloaderPlay() {
    let preloader = document.getElementById('preloader');

    if (!preloader) return;

    let jclPreloaderLoaded = Cookies.get('jclPreloaderLoaded') || '';

    const prlLogoWrapper = document.getElementById('prlLogoWrapper');

    if (Number(jclPreloaderLoaded) === 1) {
        gsap.timeline()
            .to(
                prlLogoWrapper,
                {
                    opacity: 0,
                    duration: 0.5,
                },
            )
            .to(
                preloader,
                {
                    opacity: 0,
                    duration: 0.5,
                    onComplete: function () {
                        preloader.style.display = 'none';
                    }
                },
            );
        return;
    };

    const svgBoxContainer = document.getElementById('svgBoxContainer');
    const prlLogoText = document.getElementById('prlLogoText');
    const prlLogoContainer = document.getElementById('prlLogoContainer');
    let prlLogoContainerRect = prlLogoContainer.getBoundingClientRect();
    let prlLogoWrapperRect = prlLogoWrapper.getBoundingClientRect();

    let svgBoxFirstText = document.getElementById('svgBoxFirstText');
    let svgBoxSecondText = document.getElementById('svgBoxSecondText');
    let svgBoxBorder = document.getElementById('svgBoxBorder');
    let svgRectange = document.getElementById('svgRectange');
    let svgBorder = document.getElementById('svgBorder');
    let svgBoxVerticalLine = document.getElementById('svgBoxVerticalLine');
    let svgBoxHorizontalLine = document.getElementById('svgBoxHorizontalLine');
    let svgBoxBorderSize = 300;

    const tl = gsap.timeline();

    tl
        .to(
            prlLogoText,
            {
                clipPath: `inset(0px 100% 0px 0px)`,
                duration: 1,
            }
        )
        .to(
            prlLogoContainer,
            {
                x: `${prlLogoWrapperRect.width / 2 - prlLogoContainerRect.width / 2}px`,
                duration: 1.5,
            }
        )
        .to(
            svgBoxFirstText,
            {
                opacity: 1,
                duration: 0.5
            }
        )
        .to(
            svgBoxFirstText,
            {
                opacity: 1,
                duration: 0.5,
                onComplete: function () {
                    svgBorder.style.opacity = 0;
                }
            }
        )
        .to(
            svgBoxBorder,
            {
                duration: 1.5,
                width: svgBoxBorderSize,
                height: svgBoxBorderSize,
                borderWidth: 2
            }
        )
        .to(
            svgBoxSecondText,
            {
                delay: 0.3,
                opacity: 1,
            },
            '<'
        )
        .to(
            svgBoxFirstText,
            {
                opacity: 0,
            },
            '<'
        )
        .to(
            svgBoxContainer,
            {
                duration: 1.5,
                width: window.innerWidth + 10,
                height: window.innerHeight + 10
            },
            '<'
        )
        .to(
            svgBoxSecondText,
            {
                delay: 0.2,
                opacity: 0,
            },
        )
        .to(
            svgBoxBorder,
            {
                duration: 1,
                width: window.innerWidth,
                height: window.innerHeight,
                onComplete: function () {
                    svgBoxBorder.style.borderColor = 'rgb(0 0 0 / 0%)';
                }
            }
        )
        .to(
            svgBoxContainer,
            {
                delay: 0.5,
                opacity: 0,
                duration: 1
            }
        )
        .to(
            svgBoxContainer,
            {
                opacity: 0,
                duration: 1
            },
            '<'
        )
        .to(
            svgRectange,
            {
                opacity: 0,
                duration: 1
            },
            '<'
        )
        .to(
            preloader,
            {
                opacity: 0,
                duration: 1,
                onComplete: function () {
                    preloader.style.display = 'none';
                    // Cookies.set('jclPreloaderLoaded', 1, {});
                }
            },
        );
};

preloaderPlay();