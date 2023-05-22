$(document).ready(function (){
    const returned = Cookies.get('returned');
    const resume = Cookies.get('converted');
    const k = Cookies.get('form_k');
    const scale = Cookies.get('form_scale');
    const blur = Cookies.get('form_blur');
    const erode = Cookies.get('form_erode');
    const sat = Cookies.get('form_sat');
    const cont = Cookies.get('form_cont');
    const dither = Cookies.get('form_dither');
    const lang = Cookies.get('lang');
    if(returned == 1){
        $('#resume').val([resume]);
        $('#file_info').val([resume]);
        $('#k').val([k]);
        $('#scale').val([scale]);
        $('#blur').val([blur]);
        $('#erode').val([erode]);
        $('#saturation').val([sat]);
        $('#contrast').val([cont]);
        if(dither){
            $('#dither').val([dither]);
        }
        if(lang == 'ja'){
            $('#file_info').html('<strong>【選択中】</strong>' + resume)
        } else {
            $('#file_info').html('<strong>[selected]</strong>' + resume)
        }
    }
    $('#file_select').click(function (){
        $('#file').click();
    });
    $('#file').change(function (){
        const current_file = $(this)[0].files[0].name;
        if(lang == 'ja'){
            $('#file_info').html('<strong>【選択中】</strong>' + current_file);
        } else {
            $('#file_info').html('<strong>[selected]</strong>' + current_file);
        }
        $('#submit').removeAttr('disabled');
    });
    if($('#file').val() == false && returned == false){
        $('#submit').attr({'disabled':'disabled'});
    }
    $('#submit').click(function (){
        Cookies.set('form_file', $('#file').val());
        Cookies.set('form_k', $('#k').val());
        Cookies.set('form_scale', $('#scale').val());
        Cookies.set('form_blur', $('#blur').val());
        Cookies.set('form_erode', $('#erode').val());
        Cookies.set('form_sat', $('#saturation').val());
        Cookies.set('form_cont', $('#contrast').val());
        if ($('#dither').is(':checked')){
            Cookies.set('form_dither', 1);
        } else {
            Cookies.set('form_dither', 0);
        }
    });
 
});
   // ドラッグ&ドロップエリアの取得
   var fileArea = document.getElementById('dropArea');

   // input[type=file]の取得
   var fileInput = document.getElementById('uploadFile');

   var previw = document.querySelector('#preview-box img');
   
   // ドラッグオーバー時の処理
   fileArea.addEventListener('dragover', function(e){
       e.preventDefault();
       fileArea.classList.add('dragover');
   });
   
   // ドラッグアウト時の処理
   fileArea.addEventListener('dragleave', function(e){
       e.preventDefault();
       fileArea.classList.remove('dragover');
   });
   
   // ドロップ時の処理
   fileArea.addEventListener('drop', function(e){
       e.preventDefault();
       fileArea.classList.remove('dragover');
   
       // ドロップしたファイルの取得
       var files = e.dataTransfer.files;
       console.log(files);
   
       // 取得したファイルをinput[type=file]へ
       fileInput.files = files;
       
       if(typeof files[0] !== 'undefined') {
        console.log("セット!")
        console.log(fileInput.files[0])
        previw.src = URL.createObjectURL(files[0]);
           //ファイルが正常に受け取れた際の処理
       } else {
           //ファイルが受け取れなかった際の処理
       }
   });
   
   // input[type=file]に変更があれば実行
   // もちろんドロップ以外でも発火します
   fileInput.addEventListener('change', function(e){
       var file = e.target.files[0];
       
       if(typeof e.target.files[0] !== 'undefined') {
           // ファイルが正常に受け取れた際の処理
           console.log("変更あり！")
       } else {
           console.log("エラー!!");
           // ファイルが受け取れなかった際の処理
       }
   }, false);