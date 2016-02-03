var wb = new WebBrowser();
var sys = new System();

var w = wb.createWindow("https://www.facebook.com/");
w.includeJS("http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js");

w.evaluate(function() {
//    $("#email").val("u");
//    $("#pass").val("p");
//    $("#login_form").submit();
    document.querySelector("#email").value = "u";
    document.querySelector("#pass").value = "p";
    document.querySelector("#login_form").submit();
});
sys.saveText(w.getContent(), "c:/temp/webscythe/fb.html");

w.render("c:/temp/webscythe/fb.jpg");


