define("ipr-www:widget/copyright/index/head-banner/index.js",[],function(){});define("ipr-www:widget/copyright/index/query-block/index.js",[],function(){});define("ipr-www:widget/copyright/index/left-nav/index.js",[],function(){var t={floorNum:9,ids:[],topArr:[],indexNum:null,$navUl:$(".J-left-nav"),$lists:$(".J-left-nav").find("li"),init:function(){var t=this;t.bind(),t.getIds(),t.getDomheight()},bind:function(){var t=this;$(window).on("scroll",function(){var i=$(window).scrollTop()+10,o=$(".J-guesslike"),n=o.offset().top-150;i>=t.topArr[0]?t.$navUl.attr("style","position:fixed;top:0"):i<=t.topArr[0]&&t.$navUl.attr("style","position:absolute;top:0"),i>n?t.$navUl.hide():t.$navUl.show();for(var s=0;s<t.topArr.length;s++)i>=t.topArr[s]&&($(t.$lists[s]).siblings("li").removeClass("active"),$(t.$lists[s]).addClass("active"))}),t.$lists.on("click",function(){t.indexNum=$(this).index(),$("html,body").animate({scrollTop:t.topArr[t.indexNum]},1e3)})},getIds:function(){for(var t=this,i=1;i<=t.floorNum;i++)t.ids.push("floor-"+i)},getDomheight:function(){for(var t,i=this,o=0;o<i.ids.length;o++)t=$("#"+i.ids[o]).offset().top,i.topArr.push(t)}};t.init()});define("ipr-www:widget/copyright/index/floor/art.js",[],function(){});define("ipr-www:widget/copyright/index/floor/computer.js",[],function(){});define("ipr-www:widget/copyright/index/floor/text.js",[],function(){});define("common:components/slider/slider.js",["common:components/slider/slider.less","arale/switchable/1.0.3/switchable"],function(e,s,t){e("common:components/slider/slider.less");var l=e("arale/switchable/1.0.3/switchable"),c=l.extend({attrs:{autoplay:!0,circular:!0,effect:"scrollx"},setup:function(){c.superclass.setup.call(this);var e=this;this.$("[data-role=prev]").on("click",function(){e.prev()}),this.$("[data-role=next]").on("click",function(){e.next()})}});t.exports=c});define("ipr-www:widget/copyright/index/middle-banner/index.js",["common:components/slider/slider.js"],function(e){!function(){var i=e("common:components/slider/slider.js"),n=$(".J-middleSlide").find("li").length;n&&new i({element:".J-middleSlide",effect:"fade",interval:2e3})}()});define("ipr-www:widget/copyright/index/floor/music.js",[],function(){});define("ipr-www:widget/copyright/index/floor/shoot-film.js",[],function(){});define("ipr-www:widget/copyright/index/floor/design.js",[],function(){});define("ipr-www:widget/copyright/index/floor/movie.js",[],function(){});define("ipr-www:widget/copyright/index/floor/other.js",[],function(){});define("ipr-www:widget/copyright/index/floor/more.js",[],function(){});define("ipr-www:widget/copyright/index/guesslike/index.js",[],function(){});define("ipr-www:widget/common/goodness/goodness.js",[],function(){});define("ipr-www:widget/2017index/mod_righttool.js",[],function(){$(".J-scroll-top").on("click",function(){$("html, body").animate({scrollTop:0},500)}),$(window).scroll(function(){$(window).scrollTop()>0?$(".J-scroll-top").show():$(".J-scroll-top").hide()}),$(".J-console").on("click",function(){$(".zbj-feedback").trigger("click")})});define("ipr-www:widget/common/2017-footer/footer.js",[],function(){$(".hover-panel i").hover(function(){var o=$(this);o.siblings(".hover-block").css({display:"block"})},function(){var o=$(this);o.siblings(".hover-block").css({display:"none"})}),$("i.weibo").on("click",function(){window.open("http://weibo.com/p/1006065419860650")})});define("ipr-www:widget/common/topbar/topbar.js",["ipr-www:components/placeholder/placeholder","ipr-www:components/util/util"],function(e){function a(){function e(e){e.next(".feedback-help-warning").addClass("warning"),f.addClass("disabled")}function a(e){e.next(".feedback-help-warning").removeClass("warning"),h.hasClass("warning")||f.removeClass("disabled")}function t(e){_gaq.push(["_trackEvent","bottom","submit-search"]);var a=$(".feedback-result-title");a.addClass(e),f.removeClass("disabled"),m.hide(),l.hide(),k.show()}function s(){$(".reset-input").val(""),$(".checked").removeClass("checked"),r.prop("checked",!1),$(".first-radio").addClass("checked"),$(".first-radio").find('input[name="opinionType"]').attr("checked","checked"),m.hide(),h.removeClass("warning"),f.removeClass("disabled"),k.hide(),l.show()}o();var c=$(".zbj-feedback"),d=$(".feedback-modal"),l=d.find(".feedback-form"),r=d.find('input[type="radio"]'),u=d.find(".feedback-close"),f=d.find(".feedback-submit"),p=d.find(".feedback-textarea"),h=d.find(".feedback-help-warning"),m=d.find(".feedback-loading"),k=d.find(".feedback-result"),w=d.find('input[name="phone"]');c.on("click",function(){d.fadeIn()}),r.on("click",function(){$(".checked").removeClass("checked"),$(this).parent("label").addClass("checked")}),u.on("click",function(){d.fadeOut(),setTimeout(s,500)}),p.on("blur keyup",function(){n($(this).val())?a($(this)):e($(this))}),w.on("blur keyup",function(){n($(this).val())?i($(this).val())?a($(this)):e($(this)):a($(this))}),f.on("click",function(){if(p.blur(),!h.hasClass("warning")){f.addClass("disabled"),m.show();var e=l.serialize();e+="&json=1",$.ajax({url:IPRInfor.www_ipr_url+"/opinion/createopinion",type:"get",data:e,dataType:"jsonp",jsonp:"jsonpcallback",success:function(e){var a=$(".feedback-result-title");1===e.state?(a.removeClass("success"),a.removeClass("fail"),t("success")):(a.removeClass("success"),a.removeClass("fail"),t("fail"))},error:function(){t("fail")}})}}),$(".top-bar-phone").placeholder()}function n(e){return!(""==$.trim(e))}function i(e){var a=/^1[3|4|5|8|7]\d{9}$/;return a.test(e)}function o(){var e=t.getcookie("_isLoaded"),a=$(".j-expand");e||(a.addClass("expand"),setTimeout(function(){a.removeClass("expand")},3e3),document.cookie="_isLoaded=true;path:/;domain="+window.IPRInfor.cookieDomain)}e("ipr-www:components/placeholder/placeholder");var t=e("ipr-www:components/util/util");"undefined"!=typeof isQQ&&($("#pig-head").attr("href","javascript:void(0);"),$("#right-tool-top-link").attr("href","javascript:void(0);"),$(".right-online-consult a").attr("href","javascript:void(0);"),BizQQWPA.addCustom({aty:"0",a:"0",nameAccount:800168238,selector:"pig-head"}),BizQQWPA.addCustom({aty:"0",a:"0",nameAccount:800168238,selector:"pig-head-detail"}),BizQQWPA.addCustom({aty:"0",a:"0",nameAccount:800168238,selector:"right-tool-top-link"}),BizQQWPA.addCustom({aty:"0",a:"0",nameAccount:800168238,selector:"right-online-consult"}));var s=$(".J-zbj-top"),c=$(window);c.scroll(function(){c.scrollTop()>0?s.attr("style","display:block"):s.hide()}),s.click(function(){$("html,body").animate({scrollTop:0})});var d=$(".brand-consult-wrap");d.addClass("brand-consult-flow"),a()});define("ipr-www:widget/common/global/global.js",["ipr-www:widget/common/topbar/topbar","ipr-www:widget/common/login/login","ipr-www:widget/common/baidu/baidu","ipr-www:widget/common/header/header","ipr-www:components/pop-alert/index","common:components/refer-statistics/refer-statistics"],function(e){e("ipr-www:widget/common/topbar/topbar"),e("ipr-www:widget/common/login/login"),e("ipr-www:widget/common/baidu/baidu"),e("ipr-www:widget/common/header/header"),e("ipr-www:components/pop-alert/index");var o=e("common:components/refer-statistics/refer-statistics"),i="http://";"https:"==location.protocol&&(i="https://"),o.init({mode:"write",domain:window.ZBJInfo.pageDomain,proxyUrl:i+"api."+window.ZBJInfo.baseURI+"/union/index"}),$("#md-submit-1yuan").animate({left:"16"},1e3);var t=$(".homepage-left-enter"),n=$(".home-page-enter-add");t.animate({left:"0"},1e3),$(".close-left-enter").on("click",function(){var e=$.Deferred();e.done(t.animate({left:"-118px"},1e3)).done(n.animate({left:"0"},1e3))})});