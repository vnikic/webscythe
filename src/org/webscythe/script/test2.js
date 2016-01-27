var wb = new WebBrowser();
var sys = new System();

var w = wb.createWindow("https://www.facebook.com/");
w.includeJS("http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js");

w.evaluate(function() {
    $("#email").val("email");
    $("#pass").val("mama");
    $("#login_form").submit();
});
sys.saveText(w.getContent(), "c:/temp/webscythe/fb.html");

sys.print("FIRST LINK TEXT IS: [" + w.evaluate(function() {
    var el = document.querySelector("a");
    return el.innerHTML;
}) + "]");


