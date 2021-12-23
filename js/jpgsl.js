
// MsgElem = document.getElementById('msg');
// TokenElem = document.getElementById('token');
// NotisElem = document.getElementById('notis');
// ErrElem = document.getElementById('err');

// TODO: Replace firebaseConfig you get from Firebase Console
var firebaseConfig = {
  apiKey: "AIzaSyC52uuRy7yPlv_tiqCEM3319uvO8xGoxSs",
  authDomain: "ikhwan-annisa-wedding.firebaseapp.com",
  projectId: "ikhwan-annisa-wedding",
  storageBucket: "ikhwan-annisa-wedding.appspot.com",
  messagingSenderId: "970967747202",
  appId: "1:970967747202:web:d6f10dec3975283947429b"
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
messaging
    .requestPermission()
    .then(function () {
        // MsgElem.innerHTML = 'Notification permission granted.';
        console.log('Notification permission granted.');

        // get the token in the form of promise
        return messaging.getToken();
    })
    .then(function (token) {
        // TokenElem.innerHTML = 'Device token is : <br>' + token;
        console.log('DeviceToken = '+ token);
    })
    .catch(function (err) {
        // ErrElem.innerHTML = ErrElem.innerHTML + '; ' + err;
        console.log('Unable to get permission to notify.', err);
    });

let enableForegroundNotification = true;
messaging.onMessage(function (payload) {
    // console.log('Message received. ', payload);
    // NotisElem.innerHTML =
    //     NotisElem.innerHTML + JSON.stringify(payload);
    showGreeting(payload);
    // queueGreeting(payload);

    // TO SHOW PUSH NOTIFICATION VIA BROWSER
    // if (enableForegroundNotification) {
    //     let notification = payload.notification;
    //     navigator.serviceWorker
    //         .getRegistrations()
    //         .then((registration) => {
    //             registration[0].showNotification(notification.title,
    //             {
    //               body: notification.body
    //             });
    //         });
    // }
});

var TxtRotate = function(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

  var that = this;
  var delta = 300 - Math.random() * 100;

  if (this.isDeleting) { delta /= 2; }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function() {
    that.tick();
  }, delta);
};

window.onload = function() {
  var elements = document.getElementsByClassName('txt-rotate');
  for (var i=0; i<elements.length; i++) {
    var toRotate = elements[i].getAttribute('data-rotate');
    var period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TxtRotate(elements[i], JSON.parse(toRotate), period);
    }
  }
}

const delayGreeting = 5000;
// var isGreeting = false;
// var stackGreeting = 0;

// function queueGreeting(payload){
//   stackGreeting++;
//   if(stackGreeting==1){
//     showGreeting(payload);
//     console.log('exec now');
//   }else{
//     setTimeout( showGreeting(payload) , (delayGreeting * stackGreeting) );
//     console.log('stack '+stackGreeting+' '+(delayGreeting * stackGreeting));
//   }
// }

function showGreeting(payload){
  $('.greeting-msg')
  .slideDown( function() {
    $('.greeting-msg .guest-place').text(payload.data.guestPlace);
    let fullName = payload.data.guestName;
    let i = 0;
    let intervalTyping = setInterval(function(){
      if(i < fullName.length){
        let typing = fullName.substring(0, i+1);
        $('.greeting-msg .guess-name').text(typing);
        i++;
      }else{
        $('.greeting-msg p').slideDown('slow');
        clearInterval(intervalTyping);
      }
    }, 100);
  })
  .delay(delayGreeting)
  .slideUp('slow', function() { 
    let randomNumber = Math.floor(Math.random() * 5) + 1; // Random number between 1-5
    $('.greeting-msg').css("background-image","url('../images/img-greeting-"+randomNumber+".jpg')");
    $('.greeting-msg p').hide();
    $('.greeting-msg .guess-name').text('');
  });
}