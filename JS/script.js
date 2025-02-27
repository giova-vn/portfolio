$(document).ready(function() {

    //intro
    $(".intro_from_bottom").css({
        position: "relative",
        bottom: "-100px",
        opacity: 0
    });
    
    $(".intro_from_bottom").animate({
        bottom: "0",
        opacity: 1
    }, 1000);

}); //end redy