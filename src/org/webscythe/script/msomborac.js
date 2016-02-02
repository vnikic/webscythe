var wb = new WebBrowser();
var sys = new System();

var w = wb.createWindow("http://www.blic.rs/");

sys.saveText(w.getContent(), "c:/temp/webscythe/blic.html");
w.render("c:/temp/webscythe/blic.jpg");

w.evaluate(function() {
    document.location.href = document.querySelectorAll("#blic_naslovna_print")[1].href;
});

for (var i = 1; i <= 100; i++) {
    var imgUrl = w.evaluate(function() {
        return document.querySelector(".mainPhotoImg").src;
    });
    var numStr = i > 99 ? "" + i : (i > 9 ? "0" + i : "00" + i);
    w.download(imgUrl, "c:/temp/webscythe/somborac" + numStr + ".jpg");

    var hasNextPic = w.evaluate(function() {
        var prevLink = document.querySelector("div.strip_prev a");
        if (prevLink) {
            document.location.href = prevLink.href;
            return true;
        }
        return false;
    });
    if (!hasNextPic) {
        break;
    }
}
