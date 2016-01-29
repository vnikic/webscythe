var wb = new WebBrowser();
var sys = new System();

var w = wb.createWindow("https://www.facebook.com/", {height:1000});
//w.includeJS("http://ajax.googleapis.com/ajax/libs/jquery/1.2.6/jquery.js");

w.evaluate(function() {
    //$("#email").val("e");
    //$("#pass").val("p");
    //$("#login_form").submit();
    document.querySelector("#email").value = "email ";
    document.querySelector("#pass").value = "pass";
    document.querySelector("#login_form").submit();
});
sys.saveText(w.getContent(), "c:/temp/webscythe/fb.html");

sys.println("FIRST LINK TEXT IS: [" + w.evaluate(function() {
    var el = document.querySelector("a");
    return el.innerHTML;
}) + "]");

sys.sleep(2000);
w.render("c:/temp/webscythe/fb.jpg");


