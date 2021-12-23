const templateTamuBox = (data) => `
  <div class="ucapan-box">
    <img class="ucapan-img" src="images/default-user.png">
    <span class="ucapan-date">${new Date(data.item.timestamp).toLocaleString("en-US", {timeZone: "Asia/Jakarta"})}</span>
    <h3 class="ucapan-name">
      ${data.item.guestName} 
      <small class="badge">${data.item.guestPlace}</small>
      <small class="badge badge-${(data.item.guestRef=='a')?'pink':'primary'}">${(data.item.guestRef=='a')?'annisa':'ikhwan'}</small>
    </h3>
    <p class="ucapan-msg">${data.item.guestMsg}</p>
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
getTamuData();


$(document).on('submit', '#form-tamu-undangan', function(event){
	event.preventDefault();
	let form = $('#form-tamu-undangan');
	$.ajax({
		url: 'https://us-central1-ikhwan-annisa-wedding.cloudfunctions.net/api/bukutamu',
		type: form.attr('method'),
		data: form.serialize(),
		dataType: 'json',
		beforeSend: function(){
			form.find('button').attr('disabled',true);
			form.find('button').html('Processing...');
		},
		complete: function(){
			form.find('button').attr('disabled',false);
			form.find('button[type="submit"]').html('Simpan');
		},
		success: function(response){
      form[0].reset();
      form.find('input[type="radio"]').attr('checked', false);
      getTamuData();
			Swal.fire({
				title: 'Berhasil Input!',
				icon: 'success',
				html: 'Data tamu baru telah ditambahkan.',
			});
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

function onScanSuccess(decodedText, decodedResult) {
  // console.log(`Scan result: ${decodedText}`, decodedResult);
  if(decodedResult.result.format.formatName=="QR_CODE"){
    let splitResult = decodedText.split(';');
    if(splitResult[0] == "Ikhwan&Annisa"){
      $('#form-tamu-undangan input[name="guestName"]').val(splitResult[1]);
      $('#form-tamu-undangan input[name="guestPlace"]').val(splitResult[2]);
      $('#form-tamu-undangan input[name="guestRef"][value="'+splitResult[3]+'"]').attr('checked', true);
      $('#form-tamu-undangan textarea[name="guestMsg"]').focus();
      // $('#form-tamu-undangan').submit();
      Swal.fire({
        title: 'Undangan Valid!',
        icon: 'success',
        html: 'Data tamu berhasil ditemukan, silakan tulis <b>ucapan</b> atau langsung <b>simpan</b>.',
        timer: 2000,
        timerProgressBar: true,
      });
    }else{
      return Swal.fire(
        'Error',
        'Mohon maaf, undangan tidak valid',
        'error'
      );
    }
  }else{
    return Swal.fire(
      'Error',
      'Mohon maaf, hanya gunakan kode QR',
      'error'
    );
  }
}

var html5QrcodeScanner = new Html5QrcodeScanner("tamu-reader", { fps: 10, qrbox: 250 });
html5QrcodeScanner.render(onScanSuccess);
