$(function(){
   //スクロールトップボタン
   if(screen.width>480){
      var pagetop = $('#scroll-top');
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
   }


    //スマホメニュー
    $('.hamburger-icon').click(function(){
       if($('.hamburger-icon').hasClass('is-open')){
         $('.menu').css('display','none');
         $('.hamburger-icon').removeClass('is-open');

         // スクロール防止解除
         $('html,body').removeAttr('style');
         $(window).off('touchmove.noscroll'); //スマホ
       }
       else{
         $('.menu').fadeIn(200);
         $('.hamburger-icon').addClass('is-open');

         // スクロール防止
         $('html,body').css('overflow','hidden');
         $(window).on('touchmove', function(event) { //スマホ
            event.preventDefault();
         });
       }
   })

   $('.menu').click(function(){
      if($('.hamburger-icon').hasClass('is-open')){
        $('.menu').css('display','none');
        $('.hamburger-icon').removeClass('is-open');

        // スクロール防止解除
        $('html,body').removeAttr('style');
        $(window).off('touchmove.noscroll'); //スマホ
      }
   })
  });