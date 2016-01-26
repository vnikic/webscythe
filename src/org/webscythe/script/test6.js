var wb = new WebBrowser();
var sys = new System();

var win = wb.createWindow("http://mail.yahoo.com/");


win.evaluate(function() {
    document.querySelector("#login-username").value = "yyy";
    document.querySelector("#login-passwd").value = "mama";
    //document.querySelector("#mbr-login-form").submit();
});

//win.load("https://drive.google.com/open?id=0B1hvMPqUAWYeSXZQT010NGktSms");

//sys.sleep(2000);

sys.saveText(win.getContent(), "c:/temp/webscythe/yahoomail.html");
