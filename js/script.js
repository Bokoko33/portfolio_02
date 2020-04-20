$(function(){
    var pagetop = $('#scroll-top');
    // ボタン非表示
    // pagetop.hide();
    // 200px スクロールしたらボタン表示
    $(window).scroll(function () {
       if ($(this).scrollTop() > 200) {
          console.log(pagetop);
            pagetop.fadeIn();
       } else {
            pagetop.fadeOut();
       }
    });
    pagetop.click(function () {
       $('body, html').animate({ scrollTop: 0 }, 500);
       return false;
    });
  });