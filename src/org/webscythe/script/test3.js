var companyPath = "TIPOPLASTIKA DOO GORNJI MILANOVAC_18720";
var username = "uuu";
var password = "ppp";

var wb = new WebBrowser();
var win = wb.createWindow("http://www.scoring.rs/");
win.evaluate(function() {
    setLanguage("en");
});
win.evaluate(function(u, p) {
    document.querySelector("#UserName").value = u;
    document.querySelector("#Password").value = p;
    document.querySelector("#loginform").submit();
}, username, password);

win.load("http://www.scoring.rs/Firma/" + companyPath);

wb.saveStringToFile(win.getContent(), "c:/temp/webscythe/" + companyPath + ".html");
