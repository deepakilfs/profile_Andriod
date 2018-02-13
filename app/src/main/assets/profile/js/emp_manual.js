/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function () {
    $('.index_menu').change(function () {
        $(".index_menu option:selected").each(function () {
            window.location.href = $(this).val();
            var aTag = $(this).val();
            var atagtop = $(aTag).offset().top;
            var wrapper_top = $('.wrapper').offset().top;
            // alert(atagtop + wrapper_top);
            $('html,body').scrollTop(atagtop + wrapper_top);

        });
    });

});