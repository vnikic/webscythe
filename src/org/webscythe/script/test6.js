var wb = new WebBrowser();
var sys = new System();

var win = wb.createWindow("http://mail.yahoo.com/");
sys.sleep(2000);

win.evaluate(function() {
    document.querySelector("#login-username").value = "mail";
    document.querySelector("#login-passwd").value = "pass";
    document.querySelector("#mbr-login-form").submit();
});

win.download("https://us-mg4.mail.yahoo.com/ya/download?mid=2%5f0%5f0%5f1%5f9980507%5fAEd2w0MAACFpVqeGowNPqLOQL74&m=YaDownload&pid=3&fid=Inbox&inline=1&appid=yahoomail", "c:/temp/webscythe/yahooimg.gif");

sys.saveText(win.getContent(), "c:/temp/webscythe/yahoomail.html");
