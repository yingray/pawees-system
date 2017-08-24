    var $window = $(window);
    var wrap = $(".wrap");
    var banner = $(".banner");
    var logo = $(".logo");
    var footer = $("footer");
    var head = $("head");


    // banner fixed 動畫

    $window.on("scroll", function(e) {
      if ($window.scrollTop() > 0) {
        banner.addClass("banner2");
      }
      else {
        banner.removeClass("banner2");
      }

      // 看捲軸高度
      // console.log($window.scrollTop());

    });



    var nav=$("nav");
    var sandwichclick=$(".sandwichclick");
    var sandwich=$(".sandwich");

    // 三明治選單收合
    sandwichclick.click(function(){
      if(nav.hasClass("navshow")){ //已經打開
        sandwich.removeClass("sandwich2");
        nav.removeClass("navshow");
      }else{ //還沒打開
        sandwich.addClass("sandwich2");
        nav.addClass("navshow");
      }
    });



    var joinicon=$(".joinicon");
    var Registration_Page=$(".Registration_Page");
    var Registration_Page_close=$(".Registration_Page_close");
    var fixed_shadowbg=$(".fixed_shadowbg");

    var ReigstrationStatus = true;
    function registractionError() {
        ReigstrationStatus = false;
    }

    // 註冊按鈕點擊
    joinicon.click(function(){
        if(ReigstrationStatus) {
            fixed_shadowbg.addClass("fixed_shadowbg2");
            Registration_Page.addClass("Registration_Page2");
            Registration_Page_close.addClass("Registration_Page_close2");
        } else {
            // 投稿系統先關閉
            alert("Registration system will be available in the near future.","Thank you for coming");
        }
    });

    Registration_Page_close.click(function(){
        fixed_shadowbg.removeClass("fixed_shadowbg2");
        Registration_Page.removeClass("Registration_Page2");
        Registration_Page_close.removeClass("Registration_Page_close2");
    });

    function showRegistractionPage() {
		fixed_shadowbg.addClass("fixed_shadowbg2");
		Registration_Page.addClass("Registration_Page2");
		Registration_Page_close.addClass("Registration_Page_close2");
    }



    var pre_step=$(".pre_step");
    var next_step=$(".next_step");
    var edit_info=$(".edit_information");
    var submit_info=$(".submit_info");
    var Registration_form=$(".Registration_Page form");
    var fixed_shadowbg_li=$(".fixed_shadowbg ul li");

    // 表單上下頁點擊
    next_step.click(function(){
        var n=$(this).parents("form").index();

        var valid = true;
        var $required = Registration_form.eq(n).find(".required");
        $required.each(function(){
            if(!($(this).next().val())){
                alert( "Please fill in the " + $(this).text() );
                valid = false
                return false;
            }
        });

        if(valid) {
            Registration_form.eq(n).addClass("write_done");
            Registration_form.removeClass("write_form");

            fixed_shadowbg_li.eq(n-1).addClass("write_done");
            fixed_shadowbg_li.removeClass("write");

            n=n+1;
            Registration_form.eq(n).addClass("write_form");

            fixed_shadowbg_li.eq(n-1).addClass("write");
        }
    });

    pre_step.click(function(){
        var n=$(this).parents("form").index();
        Registration_form.removeClass("write_form");

        fixed_shadowbg_li.removeClass("write");

        n=n-1;
        Registration_form.eq(n).addClass("write_form");
        Registration_form.eq(n).removeClass("write_done");

        fixed_shadowbg_li.eq(n-1).addClass("write");
        fixed_shadowbg_li.eq(n-1).removeClass("write_done");

    });



    // 捲動頁面
    var logo_img=$(".logo img");
    var nav_li=$("nav ul li");
    var section03 = $(".section03");
    var section05 = $(".section05");
    var section06 = $(".section06");
    var section08 = $(".section08");
    var section09 = $(".section09");


    logo_img.eq(1).click(function(){
        $('html,body').stop(true,false).animate({scrollTop:0},1000);

        sandwich.removeClass("sandwich2");
        nav.removeClass("navshow");
    });

    nav_li.eq(0).children("a").click(function(){
        $('html,body').stop(true,false).animate({scrollTop:section03.offset().top},1000);

        sandwich.removeClass("sandwich2");
        nav.removeClass("navshow");
    });

    nav_li.eq(1).children("a").click(function(){
        $('html,body').stop(true,false).animate({scrollTop:section05.offset().top-banner.outerHeight()-60},1000);

        sandwich.removeClass("sandwich2");
        nav.removeClass("navshow");
    });

    nav_li.eq(2).children("a").click(function(){
        $('html,body').stop(true,false).animate({scrollTop:section06.offset().top-banner.outerHeight()-5},1000);

        sandwich.removeClass("sandwich2");
        nav.removeClass("navshow");
    });

    nav_li.eq(3).children("a").click(function(){
        $('html,body').stop(true,false).animate({scrollTop:section08.offset().top},1000);

        sandwich.removeClass("sandwich2");
        nav.removeClass("navshow");
    });

    nav_li.eq(4).children("a").click(function(){
        $('html,body').stop(true,false).animate({scrollTop:section09.offset().top-banner.outerHeight()},1000);

        sandwich.removeClass("sandwich2");
        nav.removeClass("navshow");
    });



    // nav here

    $window.on("scroll", function(e) {
        if ($window.scrollTop()<section03.offset().top){
            nav_li.removeClass("here");
        }
        if ($window.scrollTop() >= section03.offset().top && $window.scrollTop()<(section05.offset().top-banner.outerHeight()-60)) {
            nav_li.removeClass("here");
            nav_li.eq(0).addClass("here");
        }
        if ($window.scrollTop()>=(section05.offset().top-banner.outerHeight()-60) && $window.scrollTop()<(section06.offset().top-banner.outerHeight()-5)) {
            nav_li.removeClass("here");
            nav_li.eq(1).addClass("here");
        }
        if ($window.scrollTop()>=(section06.offset().top-banner.outerHeight()-5) && $window.scrollTop()<section08.offset().top) {
            nav_li.removeClass("here");
            nav_li.eq(2).addClass("here");
        }
        if ($window.scrollTop()>=section08.offset().top && $window.scrollTop()<(section09.offset().top-banner.outerHeight())) {
            nav_li.removeClass("here");
            nav_li.eq(3).addClass("here");
        }
        if ($window.scrollTop()>=(section09.offset().top-banner.outerHeight())) {
            nav_li.removeClass("here");
            nav_li.eq(4).addClass("here");
        }

    });



    // 地圖防止捲動產生功能
    var map = $('.map');
    map.click(function(){
            $(this).find('iframe').addClass('clicked')});
    map.mouseleave(function(){
            $(this).find('iframe').removeClass('clicked')});



// 因為有可能載入畫面時，剛好停在有動畫元件的位置，這時就寫下面這行，window一載入就觸發scroll事件
$window.trigger('scroll');

function clickLegal(name) {
    $('.fixed_shadow[data-legal="' + name + '"]').addClass('fixed_shadow2');
}
