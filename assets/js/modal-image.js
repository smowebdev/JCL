jQuery(document).ready(function ($) {
  $('.project-image').on('click', function () {
    const imageSrc = $(this).find('img').attr('src');
    const imageAlt = $(this).find('img').attr('alt');
    console.log("12121");

    $('#image-modal-img')
      .attr('src', imageSrc)
      .attr('alt', imageAlt);

    $('#image-modal')
      .removeClass('invisible opacity-0')
      .addClass('visible opacity-100');

    $('#image-modal-img')
      .removeClass('scale-95')
      .addClass('scale-100');

    $('body').addClass('overflow-hidden');
  });



  $('#image-modal-close, #image-modal').on('click', function (e) {
    if (e.target !== this && !$(e.target).is('#image-modal-close')) {
      return;
    }

    $('#image-modal')
      .removeClass('visible opacity-100')
      .addClass('invisible opacity-0');

    $('#image-modal-img')
      .removeClass('scale-100')
      .addClass('scale-95');

    $('body').removeClass('overflow-hidden');
  });

  const $slider = $('#drag-scroll');

  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  $slider.on('mousedown', function (e) {
    if ($(window).width() < 1024) return;

    isDown = true;

    startX = e.pageX - this.offsetLeft;
    scrollLeft = this.scrollLeft;

    $(this)
      .removeClass('cursor-grab')
      .addClass('cursor-grabbing');
  });

  $slider.on('mousemove', function (e) {
    if (!isDown) return;

    e.preventDefault();

    const x = e.pageX - this.offsetLeft;
    const walk = (x - startX) * 2;

    this.scrollLeft = scrollLeft - walk;
  });

  $slider.on('mouseup mouseleave', function () {
    isDown = false;

    $(this)
      .removeClass('cursor-grabbing')
      .addClass('cursor-grab');
  });


});
