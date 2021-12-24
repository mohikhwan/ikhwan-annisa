const templateUndangan1 = (data) => `
  <p class="text-center" style="padding-top:20px">
    Assalamu'alaikum Warahmatullahi Wabarakaatuh
    <br>
    Tanpa mengurangi rasa hormat, izinkan kami mengundang Bapak/Ibu/Saudara/i <b>${data.guestName}</b>, untuk hadir serta memberikan do'a restu pada acara pernikahan kami.
    <br>
    Untuk detail acara, lokasi, dan ucapan bisa klik link di bawah ini:
    <br>
    <br>
    <b>https://mohikhwan.github.io/ikhwan-annisa/?u=${encodeURI(data.guestName)}&r=${encodeURI(data.guestRef)}&p=${encodeURI(data.guestPlace)}</b>
    <br>
    <br>
    Merupakan suatu kehormatan dan kebahagiaan bagi kami, apabila Bapak/Ibu/Saudara/i <b>${data.guestName}</b>, berkenan hadir.
    <br>
    Do'a restu Anda merupakan hadiah terindah bagi kami.
    <br>
    Atas kehadiran dan do'a restu yang telah diberikan, kami ucapkan terima kasih.
    <br>
    Wassalamu'alaikum Warahmatullahi Wabarakatuh.
  </p>
`;

const form = $('#form-bikin-undangan');

$(document).on('keyup', '#form-bikin-undangan input', function(event){
  let guestData = {
    guestName: form.find('input[name="guestName"]').val(),
    guestPlace: form.find('input[name="guestPlace"]').val(),
    guestRef: form.find('input[name="guestRef"]:checked').val(),
  };
  $('#undangan-msg').html([guestData].map(templateUndangan1));
});

$(document).on('change', '#form-bikin-undangan input[type="radio"]', function(event){
  let guestData = {
    guestName: form.find('input[name="guestName"]').val(),
    guestPlace: form.find('input[name="guestPlace"]').val(),
    guestRef: form.find('input[name="guestRef"]:checked').val(),
  };
  $('#undangan-msg').html([guestData].map(templateUndangan1));
});

$('#undangan-copy').on('click',function(event){
  navigator.clipboard.writeText($("#undangan-msg").text()).then(
    function() {
      window.alert('Teks berhasil dicopy');
    }, 
    function() {
      window.alert('Teks gagal dicopy');
    }
  );
});
form.find('select[name="guestRef"]').change();