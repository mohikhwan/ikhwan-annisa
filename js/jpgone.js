
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const guestName = (urlParams.get('u'))? urlParams.get('u') : 'Tamu Undangan';
const guestPlace = (urlParams.get('p'))? urlParams.get('p') : 'Tempat';
const guestRef = (urlParams.get('r'))? urlParams.get('r') : '';
let typingSound = 1;
let musicSound = 1;
let musicPlayer = new Plyr('#music-player');
let keyboardTyping = $('#keyboard-typing')[0];

/************* Player *************/
document.addEventListener("DOMContentLoaded",()=>{
  if(guestRef==="a"){
		$('.bank-jago-ikhwan').hide();
    //CHANGE MUSIC TO GIRL SINGER IF undangan FROM annisa
		$('#music-player source').attr('src','audio/ada-untukmu.mp3');
  }else if(guestRef==="i"){
		$('.bank-jago-annisa').hide();
    $('#music-player source').attr('src','audio/ada-untukmu.mp3');
  }else{
    $('#music-player source').attr('src','audio/ada-untukmu.mp3');
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
  musicSound==0? (musicPlayer.play(),musicSound=1,$('.btn-play-pause').html(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-music-note-beamed" viewBox="0 0 16 16"><path d="M6 13c0 1.105-1.12 2-2.5 2S1 14.105 1 13c0-1.104 1.12-2 2.5-2s2.5.896 2.5 2zm9-2c0 1.105-1.12 2-2.5 2s-2.5-.895-2.5-2 1.12-2 2.5-2 2.5.895 2.5 2z"/><path fill-rule="evenodd" d="M14 11V2h1v9h-1zM6 3v10H5V3h1z"/><path d="M5 2.905a1 1 0 0 1 .9-.995l8-.8a1 1 0 0 1 1.1.995V3L5 4V2.905z"/></svg>`)) : (musicPlayer.pause(),musicSound=0,$('.btn-play-pause').html(`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-volume-mute-fill" viewBox="0 0 16 16"><path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zm7.137 2.096a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/></svg>`));
});

$('#send-gift').on('click', function(event){
	event.preventDefault();
	$('html, body').animate({
		scrollTop: $('#amplop').offset().top
	}, 'slow');
	return false;
});

$('.guestbook-open').on('click', function(event){
	event.preventDefault();
	$('html, body').animate({
		scrollTop: $('#guestbook').offset().top
	}, 'slow');
	return false;
});

var d = new Date(2022, 01, 12, 06, 00, 00, 0);
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

$('#header .display-tc .guest-name').html(guestName);
$('#invitation b.guest-name').html((guestName=="Tamu Undangan")?'':guestName);
$('#header .display-tc .guest-place').html(guestPlace);
$('#formGuestBook input[name="guestName"]').val((guestName=="Tamu Undangan")?'':guestName);
$('#formGuestBook input[name="guestRef"]').val(guestRef);
$('#formGuestBook input[name="guestPlace"]').val(guestPlace);

// window.addEventListener("contextmenu", function(e) {
// 		e.preventDefault()
// }, !1);
var qrtext = 'Ikhwan&AnnisaWedding;'+guestName+';'+guestPlace+';'+guestRef;
var qrcode = new QRCode("qrcode", {
	width: 200,
	height: 200,
	colorDark : "#000000",
	colorLight : "#fff",
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


function copyToClipboard(elem) {
	var $temp = $("<input>");
	$("body").append($temp);
	$temp.val(elem).select();
	document.execCommand("copy");
	$temp.remove();
}

$(".btn-copy-norek").on("click", function() {
	var elem = $(this).data("norek");
	$(this).html('Rekening Berhasil Disalin!');
	$(this).prop('disabled', true);
	setTimeout(function(){
		$(".btn-copy-norek").html('Salin Nomor Rekening');
		$(".btn-copy-norek").prop('disabled', false);
	},1000);
	copyToClipboard(elem);
})