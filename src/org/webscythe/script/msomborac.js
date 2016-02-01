var wb = new WebBrowser();
var sys = new System();

var w = wb.createWindow("http://www.blic.rs/");

w.evaluate(function() {
    document.location.href = document.querySelectorAll("#blic_naslovna_print")[1].href;
});

sys.sleep(500);

for (var i = 1; i <= 200; i++) {
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
