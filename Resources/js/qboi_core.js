$.ajaxSetup({
    beforeSend: function (jqXHR, Obj) {
        if (this.data == null) {
            this.data = new FormData();
            this.data.append("qbocmp", getCurrentCompanyQBO());
        } else {
            this.data += '&' + $.param({
                qbocmp: getCurrentCompanyQBO()
            });
        }
        jqXHR.setRequestHeader("XSRF-TOKEN",
            $('input:hidden[name="__RequestVerificationToken"]').val());
        
    },
    error: function (jqXHR, exception) {
        //console.log("Internal error " + jqXHR.status +"  "+ jqXHR.responseText.substring(0, 300));
        console.log("Internal error " + jqXHR.status + "  " + jqXHR.responseText);
        AlertMessage("danger", "Internal error " + jqXHR.status, jqXHR.responseText.substring(0, 150));
    }
});
function changeCurrentCompanyQBO(company) {
    if (company == "" || company == null) {
        AlertMessage("danger", "Information", "An unexpected client error has occurred");
        return;
    }
    var url = new URL(window.location.href);
    var search_params = url.searchParams;
    search_params.set('qbocmp', company);
    window.location.href = url.toString();
}
function getCurrentCompanyQBO() {
    var url = new URL(window.location.href);
    var search_params = url.searchParams;
    var result = search_params.get('qbocmp');
    if (result == null) {
        result = "";
    }
    return result;
}

function QBOUserClaimedCompanies(ele) {
    console.log($(ele).data("loadedcompany"));
    if ($(ele).data("loadedcompany") == false) {
        $("#QBOUserClaimedCompaniesDropDown").empty();
        $.ajax({
            url: "/System/GetUserClaimedCompanies",
            type: "post",
            success: function (result) {
                console.log(result);
                $(result.data).each(function () {
                    var li = "<li>\
                                <a data-comp='"+ this.key + "' href = 'javascript:;' onclick = 'changeCurrentCompanyQBO(\"" + this.key + "\");'>\
                                    <div class='dataareaid'>"+ this.key +"</div>\
                                    <div class='dataareatext'>"+ this.value +"</div>\
                                </a>\
                             </li>";
                    $("#QBOUserClaimedCompaniesDropDown").append(li);
                });
                $(ele).data("loadedcompany", true);
            }
        });
    }
}

function TestingQBO() {
    $.ajax({
        url: "/System/Testing",
        type: "post",
        //data: { v1: "123", v2: "456" },
        success: function (result) {
            console.log(result);
        }
    });
}

