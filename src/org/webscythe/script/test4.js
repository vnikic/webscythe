var wb = new WebBrowser();
var sys = new System();

var win1 = wb.createWindow("http://www.scoring.rs/", {width:2000});
sys.saveText(win1.getContent(), "c:/temp/webscythe/scoring.html");
var win2 = wb.createWindow("https://www.facebook.com/");
sys.saveText(win2.getContent(), "c:/temp/webscythe/fb.html");

sys.println(win1.evaluate(function(o) {
    o.sasa = "Magarac";
    return o;
}, {koja:"petar", mica:[1, 2, 3, 4], sajko: 123.222}).sasa);

win1.evaluate(function() {
    setLanguage("en");
});

sys.println("URL 1 = " + win1.getUrl());
sys.println("URL 2 = " + win2.getUrl());

sys.sleep(1000);
win1.render("c:/temp/webscythe/scoring.jpg");
win2.render("c:/temp/webscythe/facebook.jpg");

sys.saveText(win1.getContent(), "c:/temp/webscythe/scoring1.html");