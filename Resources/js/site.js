// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

String.prototype.minsToHHMMSS = function() {
    var mins_num = parseFloat(this, 10); // don't forget the second param
    var hours = Math.floor(mins_num / 60);
    var minutes = Math.floor((mins_num - ((hours * 3600)) / 60));
    var seconds = Math.floor((mins_num * 60) - (hours * 3600) - (minutes * 60));

    // Appends 0 when unit is less than 10
    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds;
}

var _externalpersonalsettings = [];

$(document).ready(function() {
    //$(".toast-close-button").click(function () {
    //    $(this).parent().remove();
    //    $(this).parent().remove();
    //});
    ToggleSideBarColor();
    //setTimeout(function () {
    //    $(".toast").each(function () {
    //        $(this).remove();
    //    });
    //    //$(".toast-container > .toast").remove();
    //}, 1000 * 5);
});

function JsonArraySpliter(response) {
    var data = eval("(" + response + ")");
    var arrdata = new Array();
    arrdata = data;
    return arrdata;
}
//ExtractFirstMessage("Jsonstring");
function ExtractFirstMessage(messages) {
    var arrdata = JsonArraySpliter(messages);
    if (arrdata.length > 0) {
        return arrdata[0].message;
    } else {
        return "";
    }
}

function extendArrayProperty(target, source) {
    if (source) {
        for (var prop in source) {
            if (source.hasOwnProperty(prop)) {
                target[prop] = source[prop];
            }
        }
    }
    return target;
}


function removejscssfile(filename, filetype) {
    var targetelement = (filetype == "js") ? "script" : (filetype == "css") ? "link" : "none" //determine element type to create nodelist from
    var targetattr = (filetype == "js") ? "src" : (filetype == "css") ? "href" : "none" //determine corresponding attribute to test for
    var allsuspects = document.getElementsByTagName(targetelement)
    for (var i = allsuspects.length; i >= 0; i--) { //search backwards within nodelist for matching elements to remove
        if (allsuspects[i] && allsuspects[i].getAttribute(targetattr) != null && allsuspects[i].getAttribute(targetattr).indexOf(filename) != -1)
            allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
    }
}

//AjaxAlertMessage("Jsonstring");
function AjaxAlertMessage(messages, autotimeout = 0) {
    var arrdata = JsonArraySpliter(messages);
    ClearAlertMessage(0);
    for (var i = 0; i < arrdata.length; i++) {
        AlertMessage(arrdata[i].type, arrdata[i].title, arrdata[i].message, autotimeout);
    }
}
//AlertMessage("success", "Haha", "Oh Yeah!");
function AlertMessage(type, title, message, autotimeout = 0) {
    var theme = "";

    if (type == "warning") {
        theme = "warning";
    } else if (type == "success") {
        theme = "success";

    } else if (type == "error") {
        theme = "error";
    } else if (type == "danger") {
        theme = "error";
    } else {
        theme = "info";
    }

    if (title == "") {
        title = "Information"
    }

    if (autotimeout == 0) {
        autotimeout = 25000;
    }

    new Notify({
        status: theme,
        title: title,
        text: message,
        autoclose: true,
        autotimeout: autotimeout,
        effect: 'wiggle',
        speed: 300,
        gap: 15,
        distance: 30,
        position: 'right top'
    });
}

//ClearAlertMessage(120);
//ClearAlertMessage("slow");
function ClearAlertMessage(speed) {
    if (speed == 0) {
        $(".notifications-container div").remove();
        return;
    }

    //switch (speed) {
    //    case "slow":
    //        speed = 120;
    //        break;
    //    case "normal":
    //        speed = 90;
    //        break;
    //    case "fast":
    //        speed = 75;
    //        break;
    //}

}


//Check is there alerting message
function isAlerting() {
    var divs = $(".notifications-container");
    if (divs.has("div").length > 0) {
        return true;
    }
    return false;
}


function SetStatusSideBar() {
    if (!$("body").hasClass("sidebar-collapse")) {
        document.cookie = "_sbs=true; path=/";
        _externalpersonalsettings.push({ Key: "_sbs", Value: "true" });
    } else {
        document.cookie = "_sbs=false; path=/";
        _externalpersonalsettings.push({ Key: "_sbs", Value: "false" });
    }
}

function SaveZoomUserOptions(zoom, color) {
    if (zoom != "0" && zoom != "") {
        document.cookie = "_zmw=" + zoom + "; path=/";
    }
    if (color != "") {
        document.cookie = "_clw=" + color + "; path=/";
    }
    _externalpersonalsettings.push({ Key: "_zmw", Value: zoom });
    _externalpersonalsettings.push({ Key: "_clw", Value: color });
}

function MarkLoadedFirstUserPersonlizeSetting() {
    document.cookie = "_markpersonlizeloaded=1; path=/";
}

function IsLoadedFirstUserPersonlizeSetting() {
    //console.log(getCookie("_markpersonlizeloaded"));
    if (getCookie("_markpersonlizeloaded") == "1") {
        return true;
    }
    return false;
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function SaveSizeUserOptions(size) {
    document.cookie = "_smw=" + size + "; path=/";
    _externalpersonalsettings.push({ Key: "_smw", Value: size });
}

function SaveMenuTypeOptions(type) {
    document.cookie = "_scm=" + type + "; path=/";
    _externalpersonalsettings.push({ Key: "_scm", Value: type });
}

function SaveCatUserOptions(allow) {
    document.cookie = "_eecat=" + allow + "; path=/";
    _externalpersonalsettings.push({ Key: "_eecat", Value: allow });
}

function CountDistinctValue(arr) {
    const counts = {};
    for (var i = 0; i < arr.length; i++) {
        counts[arr[i]] = 1 + (counts[arr[i]] || 0);
    };
    return counts;
}

function SyncUserOptions() {
    //console.log(_externalpersonalsettings);
    $.ajax({
        url: "/Home/InsertUpdateUserPersonlizeSetting",
        type: "post",
        data: { modal: _externalpersonalsettings },
        error: function(jqXHR, exception) {
            console.log(jqXHR.status + " " + jqXHR.responseText);
        }
    });
    _externalpersonalsettings = [];
}

function LoadUserPersonlizeSetting(forceLoad) {
    var allowload = false;

    if (forceLoad) {
        allowload = true;
    } else if (!IsLoadedFirstUserPersonlizeSetting()) {
        MarkLoadedFirstUserPersonlizeSetting();
        allowload = true;
    }

    if (allowload) {
        $.ajax({
            url: "/Home/GetUserPersonlizeSettings",
            type: "get",
            success: function(result) {
                if (result.success) {
                    //console.log(result);
                }
            },
            error: function(jqXHR, exception) {
                console.log(jqXHR.status + " " + jqXHR.responseText);
            }
        });
    }

}


function AjaxIndexLoadDataUntilEmpty(ajaxUrl, ajaxSendData, startIndex, callBackProcessFunction, callBackDoneFunction) {
    var index = startIndex;
    var promises = [];
    var copyAjaxSendData = ajaxSendData;
    copyAjaxSendData.Index = index;
    var request = $.ajax({
        url: ajaxUrl,
        data: copyAjaxSendData,
        type: "post",
        success: function(result) {

            callBackProcessFunction(result.data);

            index = index + 1;
            if (result.data.length > 0) {
                AjaxIndexLoadDataUntilEmpty(ajaxUrl, ajaxSendData, index, callBackProcessFunction);
            }
        }
    })

    promises.push(request);
    $.when.apply(null, promises).done(function() {
        if (typeof callBackDoneFunction === 'function' && callBackDoneFunction()) {
            callBackDoneFunction();
        }
    })
}

function ToggleSideBarColor() {
    var groupitem = $("[name=groupsidebaritems]");
    groupitem.removeClass("active");
    var selectmenuCookie = getCookie("_SIS");

    if (selectmenuCookie != "") {
        //document.cookie = "_SBS=true; path=/";
    }
}
//$(document).on("change", "#input", function () {
//    PreviewImage(this, $("#img"));
//});
function PreviewImage(file, image) {
    if (file.files && file.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            image.show();
            image.attr('src', e.target.result);
        }
        reader.readAsDataURL(file.files[0]);
    }
}

function getCookieStartWithName(cname) {
    var name = cname + "=";
    //console.log(document.cookie);
    var ca = document.cookie.split(';');

    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];

        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function PrintDirectly(url) {
    window.open(url, "_blank");
}

//GlobalLoadSubContainMenu("/Control/Action/?Id=1");
function GlobalLoadSubContainMenu(partialurl) {
    $.ajax({
        url: partialurl,
        type: "GET",
        //data: { Id: id},
        dataType: 'html',
        success: function(data) {
            //console.log(data);
            $(".subcontainerlayout").hide();
            $("#maindivcontent").prepend("<div class='page-body subcontainerlayout' data-root='" + partialurl + "' >" + data + "</div>");
        },
    });
}

//ToggleContainerLayout(this,'/Paying/ListSettlementTest');
//params: elem for current button, returlurl for return if have only 1 layer, forceStay for stay current url if have 1 layer
function ToggleContainerLayout(elem, returnUrl, forceStay) {
    forceStay = (typeof forceStay !== 'undefined') ? forceStay : false;
    var allContainer = $(".subcontainerlayout");
    if (allContainer.length > 1) {
        var main = $(elem).closest(".subcontainerlayout");
        main.remove();
        $($(".subcontainerlayout")[0]).show();
    } else if (!forceStay) {
        window.location.href = returnUrl;
    }
}

function ReloadSubContainerLayout() {
    var firstContainer = $(".subcontainerlayout")[0];
    var root = $(firstContainer).data("root");

    if (root == undefined) {
        location.reload();
    } else {
        //Allow only sub container
        if ((typeof root !== 'undefined') && root != "") {
            $.ajax({
                url: root,
                type: "GET",
                //data: { Id: id},
                dataType: 'html',
                success: function(data) {
                    $(firstContainer).empty().append(data);
                    $('.modal-backdrop').remove();
                },
                error: function(jqXHR, exception) {
                    ClearAlertMessage(0);
                    AlertMessage("danger", "System", jqXHR.status + " " + jqXHR.responseText);
                }
            });
        }
    }

}

function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}