var wb = new WebBrowser();
var sys = new System();

var w = wb.createWindow("http://www.blic.rs/");

sys.saveText(w.getContent(), "c:/temp/webscythe/blic.html");
var r = w.evaluate(function() {
    return document.querySelector("#f_wrap_box").getBoundingClientRect();
    //return document.querySelector("#f_wrap_box");
});
w.render("c:/temp/webscythe/blic.jpg", "JPEG", r);


