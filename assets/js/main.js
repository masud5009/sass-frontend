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

  // Password visibility toggle
  $('.password-toggle').on('click', function() {
    const input = $(this).siblings('input'); // Changed to siblings to target direct input
    const icon = $(this).find('i');
    
    if (input.attr('type') === 'password') {
      input.attr('type', 'text');
      icon.removeClass('fa-eye').addClass('fa-eye-slash');
    } else {
      input.attr('type', 'password');
      icon.removeClass('fa-eye-slash').addClass('fa-eye');
    }
  });

  // Login form submission
  $('#loginForm').on('submit', function(e) {
    e.preventDefault();
    // Add your login logic here
    
    // Example animation feedback
    const btn = $(this).find('button[type="submit"]');
    const originalText = btn.html();
    
    btn.prop('disabled', true)
       .html('<i class="fas fa-spinner fa-spin me-2"></i>Signing in...');
    
    // Simulate API call
    setTimeout(() => {
      btn.prop('disabled', false).html(originalText);
      // Add your redirect or success handling here
    }, 1500);
  });

  // init bootstrap carousel with fade, autoplay and pause-on-hover for testimonials
  $('#testimonialCarousel').carousel({ interval: 6000, pause: 'hover', ride: 'carousel' });

  // Contact form handling
  $('#contactForm').on('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
      name: $('#nameInput').val(),
      email: $('#emailInput').val(),
      subject: $('#subjectInput').val(),
      message: $('#messageInput').val()
    };
    
    // Get submit button
    const submitBtn = $(this).find('button[type="submit"]');
    const originalText = submitBtn.html();
    
    // Show loading state
    submitBtn.prop('disabled', true)
           .html('<i class="fas fa-spinner fa-spin me-2"></i>Sending...');
    
    // Simulate API call - Replace this with your actual API call
    setTimeout(() => {
      // Reset form
      this.reset();
      
      // Reset button
      submitBtn.prop('disabled', false).html(originalText);
      
      // Show success message (you can customize this)
      alert('Message sent successfully!');
    }, 1500);
  });

  // Blog search functionality
  $('.blog-search input').on('keyup', function() {
    const searchTerm = $(this).val().toLowerCase();
    
    $('.blog-card').each(function() {
      const title = $(this).find('h3').text().toLowerCase();
      const content = $(this).find('p').text().toLowerCase();
      
      if (title.includes(searchTerm) || content.includes(searchTerm)) {
        $(this).parent().fadeIn();
      } else {
        $(this).parent().fadeOut();
      }
    });
  });

  // Blog category filters
  $('.category-filter').on('click', function() {
    const category = $(this).text().toLowerCase();
    
    // Toggle active state
    $('.category-filter').removeClass('active');
    $(this).addClass('active');
    
    if (category === 'all') {
      $('.blog-card').parent().fadeIn();
    } else {
      $('.blog-card').each(function() {
        const cardCategory = $(this).data('category').toLowerCase();
        if (cardCategory === category) {
          $(this).parent().fadeIn();
        } else {
          $(this).parent().fadeOut();
        }
      });
    }
  });

});
