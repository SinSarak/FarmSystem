$("#txtPasswordLogintxt").keypress(function () {
    GO_GO();
});
$("#txtPasswordLogintxt").focusout(function () {
    GO_GO();
});
$("#txtPasswordLogintxt").blur(function () {
    GO_GO();
});

function GO_GO() {
    var t = $("#txtPasswordLogintxt").val();
    cookie =
        $("[name=__RequestVerificationToken]").val()
            .replace(/[^a-zA-Z0-9]/g, "");
    var a = cookie.slice(7, 14) + "aShing" + cookie.slice(19, 22);
    var key = CryptoJS.enc.Utf8.parse(a);
    var iv = CryptoJS.enc.Utf8.parse("8056483646328763");

    var encryptedlogin = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(t), key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    document.getElementById("Input_Password").value = encryptedlogin.toString();
 
}