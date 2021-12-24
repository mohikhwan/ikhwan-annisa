
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const guestName = (urlParams.get('u'))? urlParams.get('u') : 'Tamu Undangan';
const guestPlace = (urlParams.get('p'))? urlParams.get('p') : 'Tempat';
const guestRef = (urlParams.get('r'))? urlParams.get('r') : '';
let typingSound = 1;
let musicSound = 1;
let musicPlayer = new Plyr('#music-player');
let keyboardTyping = $('#keyboard-typing')[0];
// const guest2 = getAllUrlParams(queryString);
// console.log(queryString);
// console.log(guestName);

/************* Player *************/
document.addEventListener("DOMContentLoaded",()=>{
  if(guestRef==="a"){
    //CHANGE MUSIC TO GIRL SINGER IF undangan FROM annisa
    $('#music-player source').attr('src','audio/adu-rayu-cover.mp3');
  }else{
    $('#music-player source').attr('src','audio/adu-rayu.mp3');
  }
	window.addEventListener("click",function(n){
    playTyping();
  });
	window.addEventListener("touchstart",function(n){
    playTyping();
  });
	window.addEventListener("scroll",function(n){
    playTyping();
  });
});

function playMusic(){
  musicSound==1;
  musicPlayer.play();
}

function playTyping(){
  typingSound==1? keyboardTyping.play() : keyboardTyping.pause();
}

$('.btn-play-pause').on('click', function(event){
  musicSound==0? (musicPlayer.play(),musicSound=1) : (musicPlayer.pause(),musicSound=0);
});

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

function typingCover(){
musicPlayer.pause();
playTyping();
let coding = `import { Undangan } from 'Pernikahan';
import { Ikhwan, Annisa } from 'Pekalongan';

function Acara() {
  const tanggalPernikahan = new Date('12 February 2022');
  return(
    <Undangan 
      mempelaiPria={Ikhwan}
      mempelaiWanita={Annisa}
      acara={tanggalPernikahan}
      di='Kesesi Pekalongan'/>
  )
}

export default Acara;`;
  // console.log(coding);
  let i = 0;
  $('#cover-undangan .editor-body').show();
  let intervalTyping = setInterval(function(){
    if(i < coding.length){
      let typing = coding.substring(0, i+1);
      $('#cover-undangan code').text(typing);
      Prism.highlightAll();
      i++;
    }else{
      typingSound = 0;
      keyboardTyping.pause();
      $('#cover-undangan button').fadeIn();
      clearInterval(intervalTyping);
      // CLICK ANYWHERE TO BUKA UNDANGAN
      // document.body.addEventListener('click', function(event){
      //   $('#cover-undangan').hide();
      // }, true); 
      $('#cover-undangan code').find('span.token:last').addClass('blink-typing');
    }
  }, 30);
}
typingCover();

$('#cover-undangan button').on('click', function(event){
  $('#cover-undangan').hide(function(){
    typingSound = 0;
    keyboardTyping.pause();
    playMusic();
  });
});
$('#cover-undangan a').on('click', function(event){
  $('#cover-undangan').hide(function(){
    typingSound = 0;
    keyboardTyping.pause();
    playMusic();
  });
});