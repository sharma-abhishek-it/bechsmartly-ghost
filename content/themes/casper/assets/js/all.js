//= require jquery-11.1.min
//= require bootstrap.min
//= require bootstrapValidator.min
//= require jquery.unveil.mod


var $d          = $(document);
var $w          = $(window);
var navOffset   = 19;

var scrolled       = false;
var lastScrollTime = Date.now();
var scrollEnd      = true;

var validator      = null;

setInterval(function(){
  if(scrolled) {
    $.event.trigger({
    	type: "human-scroll",
    	message: "Humanly scroll done",
    	time: new Date()
    })
    scrolled = false;
    lastScrollTime = Date.now();
    scrollEnd = false;
  }

  if(Date.now() - lastScrollTime > 50 && !scrollEnd) {
    scrollEnd = true;
    $.event.trigger({
      type: "human-scroll-end",
      message: "Humanly scroll end",
      time: new Date()
    })
    lastScrollTime = Date.now();
  }

}, 50);
$d.scroll(function(){scrolled = true;});

$w.load(function(){
  $('#map-container').append('<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3768.650527674107!2d72.83351365!3d19.166768900000005!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b65c014f4753%3A0x8659bbde56647301!2sBhanumati!5e0!3m2!1sen!2s!4v1395997120021" frameborder="0" height="350" width="450" class="map "></iframe>')
})

$d.ready(function(){
  var $register   = $('#register');
  var $navAnchors = $('nav ul li > a');

  setTimeout(function(){
    $('.lazy').each(function(){$(this).attr('src', $(this).data('src'))});
  }, 100);

  $('img').show();

  $w.scrollTop(0);
  $('.faq').click(function(e){
    e.preventDefault();
    e.stopPropagation();

    $('.faq').removeClass('current');
    $(this).addClass('current');
  });

  $('.series-row').click(function(e){
    if( $(this).hasClass('js-expanded') ) {
      $(this).removeClass('js-expanded');
    } else {
      $(this).addClass('js-expanded');
    }
  })

  $('.nav-logo').click(function(e){
    $w.scrollTop(0);
    e.preventDefault();
    e.stopPropagation();
  })

  $navAnchors.click(function(e){
    var sectionTop = $($(this).attr('href')).offset().top

    $w.scrollTop(sectionTop - navOffset);

    e.preventDefault();
    e.stopPropagation();
  })

  $('header, section.content-para').unveil(250, function(){
    var id = '#' + $(this).attr('id');

    var $el = $navAnchors.filter(function(){ return ($(this).attr('href') == id && !$(this).parent().hasClass('active')); })

    if($el.length > 0) {
      $navAnchors.parent().removeClass('active');
      $el.parent().addClass('active');
      window.location.hash = '#/' + $(this).attr('id');

      $.event.trigger({
        type: "custom-page-changed",
        message: $(this).attr('id'),
        time: new Date()
      })
    }

  });

  $d.on('human-scroll', function(){
    if ($d.scrollTop() < 710 ) {
      $register.removeClass('affix');
    } else {
      $register.addClass('affix');
    }
  })
  $('form.register')[0].reset();
  $('form.register').bootstrapValidator({
    message: 'This value is not valid',
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    submitHandler: function(validator, form, submitButton) {
      // Use Ajax to submit form data
      $('form.register input.btn').hide();
      $('form.register .loader').addClass('show');
      $.post(form.attr('action'), form.serialize(), function(result) {
        $('form.register input.btn').show();
        $('form.register .loader').removeClass('show');

        if(result.status == 1) {
          $('#successModal').modal();
        } else {
          $('#errorModal').modal();
        }

        $.event.trigger({
          type: "registration-done",
          message: result.status,
          time: new Date()
        });
      }, 'json');
    },
    fields: {
      fullname: {
        validators: {
          notEmpty: {
            message: 'Your name is required and cannot be empty'
          }
        }
      },
      email: {
        enabled: false,
        validators: {
          notEmpty: {
            message: 'The email is required and cannot be empty'
          },
          emailAddress: {
            message: 'The input is not a valid email address'
          },
          remote: {
            message: 'The email is already registered',
            url: 'http://app.bechsmartly.in/check-email',
          }
        }
      },
      mobile: {
        validators: {
          notEmpty: {
            message: 'The mobile no. is required and cannot be empty'
          },
          phone: {
            message: 'The input is not a valid mobile no.'
          }
        }
      },
    }
  });
  validator = $('form.register').data('bootstrapValidator');
  $('form.register input[name=email]').blur(function(){
    validator.enableFieldValidators('email', true);
    validator.validateField('email');
  }).focus(function(){
    validator.enableFieldValidators('email', false);
  })

  if (IS_PRODUCTION) {
    var sendAnalyticsTimeout = null;
    $d.on('custom-page-changed', function(e){
      clearTimeout(sendAnalyticsTimeout);
      sendAnalyticsTimeout = setTimeout(function(){
        ga('send', 'pageview', {'page': '/'+e.message, 'title': e.message});
      },2200);
    })
    $d.on('registration-done', function(e) {
      if(e.message == 1) {
        ga('send', 'event', 'Registration', 'Success');
      } else {
        ga('send', 'event', 'Registration', 'Error');
      }
    });
  }
})
