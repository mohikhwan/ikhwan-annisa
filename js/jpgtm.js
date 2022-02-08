var kameraTamuVideo = document.querySelector("#video-camera");
var kameraTamuCanvas = document.querySelector("#canvas-camera");
const templateTamuBox = (data) => `
  <div class="ucapan-box">
    <a target="_blank" href="${ data.item.guestImg ? data.item.guestImg:'images/default-user.png'}">
      <img class="ucapan-img" src="${ data.item.guestImg ? data.item.guestImg:'images/default-user.png'}" style="object-fit:cover;border:5px solid ${(data.item.guestRef=='a')?'#ff66b0':'#007bff'}" />
    </a>
    <h3 class="ucapan-name">${data.item.guestName}</h3>
    <p class="ucapan-info">
      <small class="badge rounded-pill badge-${(data.item.guestRef=='a')?'pink':'primary'}">${(data.item.guestRef=='a')?'annisa':'ikhwan'}</small>
      <small class="badge rounded-pill bg-secondary">${data.item.guestPlace}</small>
    </p>
    <span class="ucapan-date">${new Date(data.item.timestamp).toLocaleString("en-US", {timeZone: "Asia/Jakarta"})}</span>
    <p class="ucapan-msg" style="clear:both">${data.item.guestMsg}</p>
  </div>
`;
const ucapanContainer = $('#ucapan-container');

function getTamuData() {
  ucapanContainer.html('');
  $.ajax({
    url: 'https://us-central1-ikhwan-annisa-wedding.cloudfunctions.net/api/bukutamu/read',
    type: 'get',
    dataType: 'json',
    beforeSend: function(){
    },
    complete: function(){
    },
    success: function(response){
      // console.log(response);
      if(response && Object.keys(response).length > 0){
        Object.keys(response).forEach(function(item){
          let dataItem = response[item];
          // console.log(dataItem);
          // console.log(dataItem.item.timestamp);
          ucapanContainer.append([dataItem].map(templateTamuBox));
        });
      }
    },
    error: function(e){
    }
  });
}
// getTamuData();

async function loadCamera(){
  let stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
  kameraTamuVideo.srcObject = stream;
  
  await navigator.mediaDevices.enumerateDevices()
  .then(function(devices) {
    $('#form-tamu-undangan select[name="tamu-camera"]').html('');
    devices.forEach(function(device) {
      if(device.kind === 'videoinput'){
        $('#form-tamu-undangan select[name="tamu-camera"]').append('<option value="'+device.deviceId+'">'+device.label+'</option>');
      }
      // console.log(device.kind + ": " + device.label + " id = " + device.deviceId);
    });
  })
  .catch(function(err) {
    console.log(err.name + ": " + err.message);
  });
}
loadCamera();

$(document).on('submit', '#form-tamu-undangan', async function(event){
  event.preventDefault();
  
  submitBukutamu();

  // $('#modal-tamu-camera').modal('show');

	// let form = $('#form-tamu-undangan');
	// $.ajax({
	// 	url: 'https://us-central1-ikhwan-annisa-wedding.cloudfunctions.net/api/bukutamu',
	// 	type: form.attr('method'),
	// 	data: form.serialize(),
	// 	dataType: 'json',
	// 	beforeSend: function(){
	// 		form.find('button').attr('disabled',true);
	// 		form.find('button').html('Processing...');
	// 	},
	// 	complete: function(){
	// 		form.find('button').attr('disabled',false);
	// 		form.find('button[type="reset"]').html('Batal');
	// 		form.find('button[type="submit"]').html('Simpan');
	// 	},
	// 	success: function(response){
  //     form[0].reset();
  //     form.find('input[type="radio"]').attr('checked', false);
  //     getTamuData();
	// 		Swal.fire({
	// 			title: 'Berhasil Input!',
	// 			icon: 'success',
	// 			html: 'Data tamu baru telah ditambahkan.',
  //       timer: 2000,
  //       timerProgressBar: true,
	// 		});
	// 	},
	// 	error: function(e){
	// 		Swal.fire({
	// 			title: 'Error',
	// 			icon: 'error',
	// 			html: 'Maaf, ada kendala saat mengirim data. Mohon coba lagi!',
  //       timer: 2000,
  //       timerProgressBar: true,
	// 		});
	// 	}
	// });
});

function onScanSuccess(decodedText, decodedResult) {
  if(decodedResult.result.format.formatName=="QR_CODE"){
    let splitResult = decodedText.split(';');
    if(splitResult[0] == "Ikhwan&AnnisaWedding"){
      $('#form-tamu-undangan input[name="guestName"]').val(splitResult[1]);
      $('#form-tamu-undangan input[name="guestPlace"]').val(splitResult[2]);
      $('#form-tamu-undangan input[name="guestRef"][value="'+splitResult[3]+'"]').attr('checked', true);
      $('#form-tamu-undangan textarea[name="guestMsg"]').focus();
      // $('#form-tamu-undangan').submit();
      $('.form-tamu-container .form-tamu-msg').html('<div class="alert alert-success">Data tamu berhasil ditemukan, silakan tulis <b>ucapan</b> dan <b>simpan</b>.</div>');
    }else{
      $('.form-tamu-container .form-tamu-msg').html('<div class="alert alert-danger">Mohon maaf, undangan tidak valid</div>');
    }
  }else{
    $('.form-tamu-container .form-tamu-msg').html('<div class="alert alert-danger">Mohon maaf, hanya gunakan kode QR</div>');
  }
  setTimeout(function(){
    $('.form-tamu-container .form-tamu-msg div').fadeOut();
  }, 2000);
}

var html5QrcodeScanner = new Html5QrcodeScanner("tamu-reader", { fps: 10, qrbox: 250 });
html5QrcodeScanner.render(onScanSuccess);

function submitBukutamu(){ 
  // kameraTamuCanvas.getContext('2d').drawImage(kameraTamuVideo, 0, 0, 1280, 720);
  kameraTamuCanvas.getContext('2d').drawImage(kameraTamuVideo, 0, 0, kameraTamuCanvas.width, kameraTamuCanvas.height);
  let image_data_url = kameraTamuCanvas.toDataURL('image/jpeg');

  let form = $('#form-tamu-undangan');
  form.append('<input type="hidden" name="guestImg" value="'+image_data_url+'">');
	$.ajax({
		url: 'https://us-central1-ikhwan-annisa-wedding.cloudfunctions.net/api/bukutamu',
		type: form.attr('method'),
		data: form.serialize(),
		dataType: 'json',
		beforeSend: function(){
			form.find('button').attr('disabled',true);
			form.find('button').html('Processing...');
			$('#capture-image').attr('disabled',true);
			$('#capture-image').html('Processing...');
		},
		complete: function(){
			form.find('button').attr('disabled',false);
			form.find('button[type="reset"]').html('Batal');
			form.find('button[type="submit"]').html('Simpan');
			$('#capture-image').attr('disabled',false);
			$('#capture-image').html('Foto & Simpan');
		},
		success: function(response){
      form[0].reset();
      form.find('input[type="radio"]').attr('checked', false);
      getTamuData();
      form.find('input[name="guestImg"]').remove();
      $('#modal-tamu-camera').modal('hide');
			Swal.fire({
				title: 'Berhasil Input!',
				icon: 'success',
				html: 'Data tamu baru telah ditambahkan.',
        timer: 2000,
        timerProgressBar: true,
			});
		},
		error: function(e){
			Swal.fire({
				title: 'Error',
				icon: 'error',
				html: 'Maaf, ada kendala saat mengirim data. Mohon coba lagi!',
        timer: 2000,
        timerProgressBar: true,
			});
		}
	});
};

$(document).on('change', '#form-tamu-undangan select[name="tamu-camera"]', async function(event){
  let cameraId = $(this).val();
  let stream = await navigator.mediaDevices.getUserMedia({ video: {deviceId:{exact:cameraId}}, audio: false });
  kameraTamuVideo.srcObject = stream;
});
