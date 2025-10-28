// Main JS for interactivity and animations
$(function () {
  // Initialize AOS (disable on small devices to reduce heavy effects)
  AOS.init({
    duration: 700,
    once: true,
    mirror: false,
    disable: function () { return window.innerWidth < 768; }
  });

  // Smooth scroll for anchor links
  $('a[href^="#"]').on('click', function (e) {
    var target = $(this.getAttribute('href'));
    if (target.length) {
      e.preventDefault();
      $('html, body').stop().animate({ scrollTop: target.offset().top - 70 }, 700, 'swing');
    }
  });

  // Hide scroll-down chevrons once user scrolls past hero
  function toggleScrollChev() {
    var heroBottom = $('#home').offset().top + $('#home').outerHeight();
    if ($(window).scrollTop() > heroBottom - 80) {
      $('.scroll-down-wrap').fadeOut(200);
    } else {
      $('.scroll-down-wrap').fadeIn(200);
    }
  }
  $(window).on('scroll resize', toggleScrollChev);
  toggleScrollChev();

  // Navbar shadow when scrolled
  function toggleNavbarShadow() {
    if ($(window).scrollTop() > 12) {
      $('#siteNavbar').addClass('navbar-scrolled');
    } else {
      $('#siteNavbar').removeClass('navbar-scrolled');
    }
  }
  $(window).on('scroll resize', toggleNavbarShadow);
  toggleNavbarShadow();

  // Animated counters
  var ideasCounter = new countUp.CountUp('counter-ideas', 12450, { duration: 2.2, separator: ',' });
  var predCounter = new countUp.CountUp('counter-predictions', 3240, { duration: 2.2, separator: ',' });
  // Start counters when hero visible
  function startCounters() {
    var el = document.getElementById('counter-ideas');
    if (el && el.getBoundingClientRect().top < window.innerHeight) {
      if (!ideasCounter.error) ideasCounter.start();
      if (!predCounter.error) predCounter.start();
      $(window).off('scroll', startCounters);
    }
  }
  $(window).on('scroll', startCounters);
  startCounters();

  // Pricing toggle
  $('#billingToggle').on('change', function () {
    var yearly = $(this).is(':checked');
    $('.pricing-card .amount').each(function () {
      var $t = $(this);
      var monthly = Number($t.data('monthly'));
      var yearlyVal = Number($t.data('yearly'));
      var display = yearly ? yearlyVal : monthly;
      $t.text(display);
    });
  });

  // Feature modal
  $('.feature-more').on('click', function (e) {
    e.preventDefault();
    var feature = $(this).data('feature') || 'Feature';
    $('#featureModalLabel').text(feature);
    $('#featureModalBody').html('<p>Detailed information about <strong>' + feature + '</strong>. This modal can show charts, examples, or links to docs.</p>');
    var modal = new bootstrap.Modal(document.getElementById('featureModal'));
    modal.show();
  });

  // Subscribe form (footer) - simple front-end feedback
  $('#subscribeForm').on('submit', function (e) {
    e.preventDefault();
    var email = $('#subscribeEmail').val();
    if (!email || email.indexOf('@') === -1) {
      $('#subscribeMessage').text('Please enter a valid email').css('color', '#ffb4c6');
      return;
    }
    $('#subscribeMessage').text('Thanks! You are subscribed.').css('color', '#bde4ff');
    $('#subscribeEmail').val('');
  });

  // Create a sample Validation Score chart for demonstration in a modal or future section
  // We'll append a small canvas to the body hidden and show when needed
  var scoreChartCanvas = $('<canvas id="scoreChart" width="220" height="220" style="display:none"></canvas>');
  $('body').append(scoreChartCanvas);
  var ctx = document.getElementById('scoreChart').getContext('2d');
  var scoreChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Validation', 'Risk'],
      datasets: [{
        data: [72, 28],
        backgroundColor: ['#7f00ff', '#ff5a7d']
      }]
    },
    options: {
      cutout: '75%',
      plugins: { legend: { display: false }, tooltip: { enabled: false } }
    }
  });

  // If user clicks a feature that mentions validation score, show chart in modal
  $('.feature-more[data-feature*="Validation"]').on('click', function () {
    $('#featureModalBody').html('<div class="text-center p-3"><canvas id="modalScoreChart" width="240" height="240"></canvas><p class="mt-3">Your current validation score: <strong>72%</strong></p></div>');
    // small timeout to ensure modal in DOM
    setTimeout(function () {
      var ctx2 = document.getElementById('modalScoreChart').getContext('2d');
      new Chart(ctx2, {
        type: 'doughnut',
        data: { labels: ['Valid', 'Risk'], datasets: [{ data: [72, 28], backgroundColor: ['#7f00ff', '#ff5a7d'] }] },
        options: { cutout: '70%', plugins: { legend: { display: false } } }
      });
    }, 80);
  });

  // Animated pulse on hero CTAs (subtle)
  setInterval(function () {
    $('.hero-cta').each(function (i, el) {
      $(el).animate({ opacity: 0.92 }, 120).animate({ opacity: 1 }, 120);
    });
  }, 2500);

  // Accessibility: keyboard focus for feature cards
  $('.feature-card .stretched-link').on('focus', function () {
    $(this).closest('.feature-card').addClass('focus');
  }).on('blur', function () {
    $(this).closest('.feature-card').removeClass('focus');
  });

  // init bootstrap carousel with fade, autoplay and pause-on-hover for testimonials
  $('#testimonialCarousel').carousel({ interval: 6000, pause: 'hover', ride: 'carousel' });

});
