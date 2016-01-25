var wb = new WebBrowser();
var win1 = wb.createWindow("http://www.scoring.rs/");
wb.saveStringToFile(win1.getContent(), "c:/temp/webscythe/scoring.html");
var win2 = wb.createWindow("https://www.facebook.com/");
wb.saveStringToFile(win2.getContent(), "c:/temp/webscythe/fb.html");

println(win1.evaluate(function(o) {
    o.sasa = "Magarac";
    return o;
}, {koja:"petar", mica:[1, 2, 3, 4], sajko: 123.222}).sasa);

win1.evaluate(function() {
    setLanguage("en");
});

println("URL 1 = " + win1.getUrl());
println("URL 2 = " + win2.getUrl());

wb.saveStringToFile(win1.getContent(), "c:/temp/webscythe/scoring1.html");