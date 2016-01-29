var wb = new WebBrowser();
var sys = new System();

var w = wb.createWindow("http://www.bbc.co.uk/sport/0/");
sys.sleep(3000);
sys.saveText(w.getContent(), "c:/temp/webscythe/bbcsport.html");
var promRect = w.evaluate(function() {
    return document.getElementById("top-story");
});
sys.log(promRect);


w.render("c:/temp/webscythe/bbcsport.jpg", "JPEG", promRect);


