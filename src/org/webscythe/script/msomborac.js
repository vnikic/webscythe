var wb = new WebBrowser();
var sys = new System();

var w = wb.createWindow("http://www.blic.rs/");

w.evaluate(function() {
    document.location.href = document.querySelectorAll("#blic_naslovna_print")[1].href;
});

for (var i = 1; i <= 10; i++) {
    var imgUrl = w.evaluate(function() {
        return document.querySelector(".mainPhotoImg").src;
    });
    w.download(imgUrl, "c:/temp/webscythe/somborac" + i + ".jpg");

    var hasNextPic = w.evaluate(function() {
        var all = document.querySelectorAll('a[href*="blic-strip-crta-i-pise-marko-somborac"]');
        if (all.length > 1) {
            document.location.href = all[1].href;
            //return true;
        }
        return all.length;
    });
    sys.println(hasNextPic);
    //if (!hasNextPic) {
    //    break;
    //}
}
