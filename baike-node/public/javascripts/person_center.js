$(function(){
    $(".pc_nav li").click(function (){
        $(this).addClass("on").siblings("li").removeClass("on")
    })
    $(".pc_nav li:nth-child(2)").click(function(){
        $(".entry_sit a").slideDown();
    })
     /*要有数求据才能起作用哦*/
  $(".hyp").click(function(){
       $(".entry_sit a").slideDown();
    })
    $("#news-atyle div").click(function(){
        $(this).addClass("on").siblings("div").removeClass("on");
        $(".pc_template1").hide();
        $(".change").show();
    })
    $(".messageStyle_w").on('click','.base1_detail_news',function(){
        $(".pc_template1").show();//事件委托；
        $(".change").hide();
    })

	$(".agreen .pc_btn").click(function(){
		$(this).addClass("on").siblings('.pc_btn').removeClass('on');
	})
	$(".refuse_btnOut .refuse_btn").click(function(){
		$(this).addClass("on").siblings('.refuse_btn').removeClass('on');
	})
	var body_height=$('body').height();
	var window_height=$(window).height();

	if(body_height<window_height){
        $('.bottom').addClass("pc_fixed");

	}else{
        $('.bottom').removeClass("pc_fixed");
	}
	$(".margin_right20").click(function(){
	    if($(this).hasClass("on")){
	        console.log("hason")
	        $(this).removeClass("on");
        }else{
            $(this).addClass("on");
        }
    })


    $(".password_parent").on('click','.pad_h5 span',function(){
        $(".modle-wrap").hide();
        $(".prompt").html("").hide();
        $("#old_password").val("请输入当前密码");
        $("#new_password").val("请输入新密码");
        $("#renew_password").val("请确认密码 ");
    })
    $(".password_parent").on('click','.x_passsword',function(){
        $(".modle-wrap.password_x").show();
    })
   /* 模板增加js*/
})