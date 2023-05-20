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