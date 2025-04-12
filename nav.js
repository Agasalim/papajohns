const panel = $("#topPanel");
function menuToggle() {
    $(".right_site").slideToggle()
    $(".menu_links").slideToggle()
    if (panel.hasClass("height_fit")) {
        panel.removeClass("height_fit").addClass("height_100");
        $(".line1").css("transform", "rotate(45deg)");
        $(".line1").css("position", "absolute");
        $(".line3").css("transform", "rotate(-45deg)");
        $(".line3").css("position", "absolute");
        $(".line2").css("opacity", "0")
    }
    else {
        panel.removeClass("height_100").addClass("height_fit");
        $(".line1").css("transform", "rotate(0deg)");
        $(".line1").css("position", "static");
        $(".line3").css("transform", "rotate(0deg)");
        $(".line3").css("position", "static");
        $(".line2").css("opacity", "1")
    }
}
$(".menu_bar").click(function () {
    menuToggle()
})
$(".post_form_btn").click(function () {
    $(".form_box").slideDown();
    $(".form_input").val("");
    $("#cat_select").val("");
    $(".form_img").focus();
    $(".edit_btn").hide();
    if (panel.hasClass("height_100")) {
        menuToggle();
    }
})
$(".fa-xmark").click(function () {
    $(".form_box").slideUp();
    $(".edit_btn").show();
    $(".submit").show();
})
