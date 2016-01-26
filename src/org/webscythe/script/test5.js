var wb = new WebBrowser();
var sys = new System();

var win = wb.createWindow("https://drive.google.com/drive/my-drive");
win.evaluate(function() {
    document.querySelector("#Email").value = "email";
    document.querySelector("#gaia_loginform").submit();
});
win.evaluate(function() {
    document.querySelector("#Passwd").value = "mama";
    document.querySelector("#gaia_loginform").submit();
});

win.load("https://drive.google.com/open?id=0B1hvMPqUAWYeSXZQT010NGktSms");

sys.sleep(2000);

sys.saveText(win.getContent(), "c:/temp/webscythe/gg.html");
