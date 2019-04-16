/**
 * Created by EFIDA on 2017/5/10.
 */
(function($) {
    var hint=function (msg) {
        var $this=this;
        this.modle_box=$('<div class="hint-wrap">');
        this.modle_content=$('<div class="clearfix">');
        this.modle_loading=$('<div id="preloader_1"><span></span><span></span><span></span><span></span><span></span></div>');
        this.modle_text=$('<p>');
        this.modle_text.html(msg+'...');
        this.initialize();
    };

    hint.prototype= {
        initialize:function (){
            var _this=this;
            $(this.modle_box).css({"opacity":"0","position":"fixed", "top":"10%", "left":"50%", "margin-left":"-300px","z-index":"99999","width":"600px","color":"#666666" ,"background":"#fff", "height":"60px", "margin-top":"-157px", "margin-left":"-230px","font-size": "14px","box-shadow": "0 0 20px 0 rgba(0,0,0,0.50)","line-height":"60px","text-align":"center"});
            $(this.modle_loading).css({"float":"left","height":"60px","width":"70px","position":"relative","top":"-26px"});
            $(this.modle_text).css({"float":"left"});
            $(this.modle_content).css({"text-align":"center","display": "inline-block"});
        },
        openMdole:function () {
            $(this.modle_content).append(this.modle_loading);
            $(this.modle_content).append(this.modle_text);
            $(this.modle_box).append(this.modle_content);
            $("body").append(this.modle_box);
            $(this.modle_box).animate({
                opacity:"1",
                top:"30%"
            },800)
        },
        closeModle:function () {
            $(this.modle_box).animate({
                opacity:"0",
                top:"10%"
            },1000,function () {
                $(this.modle_box).remove();
            });
        }
    };
    var modle;
    hint.open=function (str) {
        if(modle){
            modle.closeModle()
        }
        modle=new hint(str);
        modle.openMdole();
        setTimeout(function () {
            modle.closeModle()
        },3000)
    };
    window["$hint"]=hint;
})(jQuery);