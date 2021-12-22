;(function () {
	
	'use strict';

	var mobileMenuOutsideClick = function() {

		$(document).click(function (e) {
	    var container = $("#fh5co-offcanvas, .js-fh5co-nav-toggle");
	    if (!container.is(e.target) && container.has(e.target).length === 0) {

	    	if ( $('body').hasClass('offcanvas') ) {

    			$('body').removeClass('offcanvas');
    			$('.js-fh5co-nav-toggle').removeClass('active');
	    	}
	    }
		});

	};


	var offcanvasMenu = function() {

		$('#page').prepend('<div id="fh5co-offcanvas" />');
		$('#page').prepend('<a href="#" class="js-fh5co-nav-toggle fh5co-nav-toggle fh5co-nav-white"><i></i></a>');
		var clone1 = $('.menu-1 > ul').clone();
		$('#fh5co-offcanvas').append(clone1);
		var clone2 = $('.menu-2 > ul').clone();
		$('#fh5co-offcanvas').append(clone2);

		$('#fh5co-offcanvas .has-dropdown').addClass('offcanvas-has-dropdown');
		$('#fh5co-offcanvas')
			.find('li')
			.removeClass('has-dropdown');

		// Hover dropdown menu on mobile
		$('.offcanvas-has-dropdown').mouseenter(function(){
			var $this = $(this);

			$this
				.addClass('active')
				.find('ul')
				.slideDown(500, 'easeOutExpo');				
		}).mouseleave(function(){

			var $this = $(this);
			$this
				.removeClass('active')
				.find('ul')
				.slideUp(500, 'easeOutExpo');				
		});


		$(window).resize(function(){

			if ( $('body').hasClass('offcanvas') ) {

    			$('body').removeClass('offcanvas');
    			$('.js-fh5co-nav-toggle').removeClass('active');
				
	    	}
		});
	};


	var burgerMenu = function() {

		$('body').on('click', '.js-fh5co-nav-toggle', function(event){
			var $this = $(this);


			if ( $('body').hasClass('overflow offcanvas') ) {
				$('body').removeClass('overflow offcanvas');
			} else {
				$('body').addClass('overflow offcanvas');
			}
			$this.toggleClass('active');
			event.preventDefault();

		});
	};



	var contentWayPoint = function() {
		var i = 0;
		$('.animate-box').waypoint( function( direction ) {

			if( direction === 'down' && !$(this.element).hasClass('animated-fast') ) {
				
				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function(){

					$('body .animate-box.item-animate').each(function(k){
						var el = $(this);
						setTimeout( function () {
							var effect = el.data('animate-effect');
							if ( effect === 'fadeIn') {
								el.addClass('fadeIn animated-fast');
							} else if ( effect === 'fadeInLeft') {
								el.addClass('fadeInLeft animated-fast');
							} else if ( effect === 'fadeInRight') {
								el.addClass('fadeInRight animated-fast');
							} else {
								el.addClass('fadeInUp animated-fast');
							}

							el.removeClass('item-animate');
						},  k * 200, 'easeInOutExpo' );
					});
					
				}, 100);
				
			}

		} , { offset: '85%' } );
	};


	var dropdown = function() {

		$('.has-dropdown').mouseenter(function(){

			var $this = $(this);
			$this
				.find('.dropdown')
				.css('display', 'block')
				.addClass('animated-fast fadeInUpMenu');

		}).mouseleave(function(){
			var $this = $(this);

			$this
				.find('.dropdown')
				.css('display', 'none')
				.removeClass('animated-fast fadeInUpMenu');
		});

	};


	var testimonialCarousel = function(){
		var owl = $('.owl-carousel-fullwidth');
		owl.owlCarousel({
			autoplay: true,
			autoplayTimeout:2000,
			items: 1,
			loop: true,
			margin: 0,
			responsiveClass: true,
			nav: false,
			dots: true,
			smartSpeed: 800,
			autoHeight: true,
		});
	};


	var goToTop = function() {

		$('.js-gotop').on('click', function(event){
			
			event.preventDefault();

			$('html, body').animate({
				scrollTop: $('html').offset().top
			}, 500, 'easeInOutExpo');
			
			return false;
		});

		$(window).scroll(function(){

			var $win = $(window);
			if ($win.scrollTop() > 200) {
				$('.js-top').addClass('active');
			} else {
				$('.js-top').removeClass('active');
			}

		});
	
	};


	// Loading page
	var loaderPage = function() {
		$(".fh5co-loader").fadeOut("slow");
	};

	var counter = function() {
		$('.js-counter').countTo({
			 formatter: function (value, options) {
	      return value.toFixed(options.decimals);
	    },
		});
	};

	var counterWayPoint = function() {
		if ($('#quote').length > 0 ) {
			$('#quote').waypoint( function( direction ) {
										
				if( direction === 'down' && !$(this.element).hasClass('animated') ) {
					setTimeout( counter , 400);					
					$(this.element).addClass('animated');
				}
			} , { offset: '90%' } );
		}
	};

	// Parallax
	var parallax = function() {
		$(window).stellar();
	};

	var ancor_link = function() {
    var lastId,
    topMenu = $("#bot-menu"),
    topMenuHeight = topMenu.outerHeight()+15,

    menuItems = topMenu.find("a"),

    scrollItems = menuItems.map(function(){
      var item = $($(this).attr("href"));
      if (item.length) { return item; }
    });

    $('.nav-link').on('click', function(){
      $('html, body').animate({
        scrollTop: $($.attr(this, 'href')).offset().top
      }, 500);
    });

    $(window).scroll(function(){
      var fromTop = $(this).scrollTop()+topMenuHeight;

      var cur = scrollItems.map(function(){
        if ($(this).offset().top < fromTop)
          return this;
      });

      cur = cur[cur.length-1];
      var id = cur && cur.length ? cur[0].id : "";

      if (lastId !== id) {
          lastId = id;

          menuItems
            .parent().removeClass("active")
            .end().filter("[href='#"+id+"']").parent().addClass("active");
      }
   });
  };

	
	$(function(){
		mobileMenuOutsideClick();
		parallax();
		offcanvasMenu();
		burgerMenu();
		contentWayPoint();
		dropdown();
		testimonialCarousel();
		goToTop();
		loaderPage();
		counter();
		counterWayPoint();
		ancor_link();
	});


}());

function getAllUrlParams(url) {

  // get query string from url (optional) or window
  var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

  // we'll store the parameters here
  var obj = {};

  // if query string exists
  if (queryString) {

    // stuff after # is not part of query string, so get rid of it
    queryString = queryString.split('#')[0];

    // split our query string into its component parts
    var arr = queryString.split('&');

    for (var i = 0; i < arr.length; i++) {
      // separate the keys and the values
      var a = arr[i].split('=');

      // set parameter name and value (use 'true' if empty)
      var paramName = a[0];
      var paramValue = typeof (a[1]) === 'undefined' ? true : a[1];

      // (optional) keep case consistent
      paramName = paramName.toLowerCase();
      if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

      // if the paramName ends with square brackets, e.g. colors[] or colors[2]
      if (paramName.match(/\[(\d+)?\]$/)) {

        // create key if it doesn't exist
        var key = paramName.replace(/\[(\d+)?\]/, '');
        if (!obj[key]) obj[key] = [];

        // if it's an indexed array e.g. colors[2]
        if (paramName.match(/\[\d+\]$/)) {
          // get the index value and add the entry at the appropriate position
          var index = /\[(\d+)\]/.exec(paramName)[1];
          obj[key][index] = paramValue;
        } else {
          // otherwise add the value to the end of the array
          obj[key].push(paramValue);
        }
      } else {
        // we're dealing with a string
        if (!obj[paramName]) {
          // if it doesn't exist, create property
          obj[paramName] = paramValue;
        } else if (obj[paramName] && typeof obj[paramName] === 'string'){
          // if property does exist and it's a string, convert it to an array
          obj[paramName] = [obj[paramName]];
          obj[paramName].push(paramValue);
        } else {
          // otherwise add the property
          obj[paramName].push(paramValue);
        }
      }
    }
  }

  return obj;
}
/************* Player *************/
document.addEventListener("DOMContentLoaded",()=>{
	var n=1;
	const t=new Plyr("#player");
	function i(){
		1==n&&t.play()
	}
	window.player=t,
	$(".open_invitation").click(function(){
		t.play()
	}),
	window.addEventListener("touchstart",function(n){i()}),
	window.addEventListener("scroll",function(n){i()}),
	$(".btn-play-pause").click(function(){0==n?(t.play(),n=1):(t.pause(),n=0)}),
	$(".open_invitation").click(function(){i()})
});
/************* custom *************/

$('.guestbook-open').on('click', function(event){
	event.preventDefault();
	$('html, body').animate({
		scrollTop: $('#guestbook').offset().top
	}, 'slow');
	return false;
});

var d = new Date(2022, 02, 12, 06, 00, 00, 0);

simplyCountdown('.simply-countdown-one', {
	year: d.getFullYear(),
	month: d.getMonth() + 1,
	day: d.getDate(),
	words: {
		days: 'hari',
		hours: 'jam',
		minutes: 'menit',
		seconds: 'detik',
		pluralLetter: ''
	},
});

//jQuery example
// $('#simply-countdown-losange').simplyCountdown({
//     year: d.getFullYear(),
//     month: d.getMonth() + 1,
//     day: d.getDate(),
//     enableUtc: false
// });

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const guestName = (urlParams.get('u'))? urlParams.get('u') : 'Tamu Undangan';
const guestPlace = (urlParams.get('p'))? urlParams.get('p') : 'Tempat';
const guestRef = (urlParams.get('r'))? urlParams.get('r') : '';
// const guest2 = getAllUrlParams(queryString);
// console.log(queryString);
// console.log(guestName);

$('#header .display-tc .guest-name').html(guestName);
$('#invitation b.guest-name').html((guestName=="Tamu Undangan")?'':guestName);
$('#header .display-tc .guest-place').html(guestPlace);
$('#formGuestBook input[name="guestName"]').val((guestName=="Tamu Undangan")?'':guestName);
$('#formGuestBook input[name="guestRef"]').val(guestRef);
$('#formGuestBook input[name="guestPlace"]').val(guestPlace);

// window.addEventListener("contextmenu", function(e) {
// 		e.preventDefault()
// }, !1);
var qrtext = 'Ikhwan&Annisa;'+guestName+';'+guestPlace+';'+guestRef;
var qrcode = new QRCode("qrcode", {
	width: 200,
	height: 200,
	colorDark : "#000000",
	colorLight : "#f5f5f5",
});
qrcode.makeCode(qrtext);

var guestInfo = "";
$.getJSON('https://json.geoiplookup.io/?callback=?', function(data) {
	// let guestInfo = JSON.stringify(data, null, 2);
	guestInfo = {
		ip: data.ip,
		isp: data.isp,
		hostname: data.hostname,
		latitude: data.latitude,
		longitude: data.longitude,
		country_name: data.country_name,
		city: data.city,
		district: data.district,
		asn: data.asn,
	};
	$('#formGuestBook input[name="guestInfo"]').val(JSON.stringify(guestInfo));
});

$.ajax({
	url: 'https://us-central1-ikhwan-annisa-wedding.cloudfunctions.net/api/visitor',
	type: 'post',
	data: {
		userInfo: guestInfo, 
		userAgent: navigator.userAgent,
		urlReferrer: document.referrer,
		urlLocation: window.location.href,
	},
	dataType: 'json'
});

$(document).on('click', '#formGuestBook button', function(event){
	event.preventDefault();
	let guestPresence = $(this).data('presence');
	let form = $('#formGuestBook');
	$.ajax({
		url: 'https://us-central1-ikhwan-annisa-wedding.cloudfunctions.net/api/ucapan',
		type: form.attr('method'),
		data: form.serialize()+'&guestPresence='+guestPresence+'&guestAgent='+navigator.userAgent+'&urlReferrer='+document.referrer+'&urlLocation='+window.location.href,
		dataType: 'json',
		beforeSend: function(){
			form.find('button').attr('disabled',true);
			form.find('button').html('Processing...');
		},
		complete: function(){
			form.find('button').attr('disabled',false);
			form.find('button[data-presence="berhalangan"]').html('Saya berhalangan hadir');
			form.find('button[data-presence="hadir"]').html('Saya akan hadir');
		},
		 // statusCode: {
		// 	201: function(data, textStatus, jqXHR) {
		// 		let greeting = "";
		// 		if(guestPresence=="hadir"){
		// 			greeting = 'Terima kasih <b>'+form.find('input[name="guestName"]').val()+'</b> telah menulis ucapan.<br>Sampai jumpa di hari bahagia kami..';
		// 		}else if(guestPresence=="berhalangan"){
		// 			greeting = 'Terima kasih <b>'+form.find('input[name="guestName"]').val()+'</b> telah menulis ucapan.<br>Kami maklum akan kehadiranmu,<br>Sampai jumpa dikesempatan lain ya!';
		// 		}
		// 		Swal.fire({
		// 			title: 'Terima asih!',
		// 			icon: 'success',
		// 			html: greeting,
		// 		});
		// 		form[0].reset();
		// 	},
		// 	500: function(jqXHR, textStatus, errorThrown) {
		// 		Swal.fire(
		// 			'Error',
		// 			'Maaf, ada kendala saat mengirim data. Mohon coba lagi!',
		// 			'error'
		// 		)
		// 	},
		// },
		success: function(response){
			let greeting = "";
			if(guestPresence=="hadir"){
				greeting = 'Terima kasih <b>'+form.find('input[name="guestName"]').val()+'</b> telah menulis ucapan.<br>Sampai jumpa di hari bahagia kami..';
			}else if(guestPresence=="berhalangan"){
				greeting = 'Terima kasih <b>'+form.find('input[name="guestName"]').val()+'</b> telah menulis ucapan.<br>Kami maklum akan kehadiranmu,<br>Sampai jumpa dikesempatan lain ya!';
			}
			Swal.fire({
				title: 'Terima asih!',
				icon: 'success',
				html: greeting,
			});
			form[0].reset();
		},
		error: function(e){
			Swal.fire(
				'Error',
				'Maaf, ada kendala saat mengirim data. Mohon coba lagi!',
				'error'
			);
		}
	});
});