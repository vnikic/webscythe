var wb = new WebBrowser();
var w = wb.createWindow("https://www.facebook.com/");
w.includeJS("http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js");

w.evaluate(function() {
    $("#email").val("vnikic@gmail.com");
    $("#pass").val("minimoris");
    $("#login_form").submit();
});
wb.saveStringToFile(w.getContent(), "c:/temp/webscythe/fb.html");

print("FIRST LINK TEXT IS: [" + w.evaluate(function() {
    var el = document.querySelector("a");
    return el.innerHTML;
}) + "]");


