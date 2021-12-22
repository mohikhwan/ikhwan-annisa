
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
    console.log('Message received. ', payload);
    // NotisElem.innerHTML =
    //     NotisElem.innerHTML + JSON.stringify(payload);

    if (enableForegroundNotification) {
        let notification = payload.notification;
        navigator.serviceWorker
            .getRegistrations()
            .then((registration) => {
                registration[0].showNotification(notification.title,
                {
                  body: notification.body
                });
            });
    }
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
  // INJECT CSS
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".txt-rotate > .wrap { border-right: 0.2em solid orange; animation: blink .8s infinite;}";
  document.body.appendChild(css);
};