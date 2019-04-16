/**
 * Created by EFIDA on 2017/4/27.
 */
$(".search_input").focus(function(){
    if($(this).val().length>0){
        $('.icon_search').addClass("active")
    }
});