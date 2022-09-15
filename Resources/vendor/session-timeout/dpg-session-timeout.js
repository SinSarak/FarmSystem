
var st_sessServerAliveTime = 10 * 60 * 2;
var st_sessionTimeout = 30 * 60000;   //Change here
var st_sessionWaitingExpireTimeout = 5 * 60000; //Change here
var st_sessLastActivity;
var st_idleTimer, st_remainingTimer;
var st_isTimout = false;
var st_autoLogoutAfterExpired = false;

var st_sess_intervalID, st_idleIntervalID;
var st_sess_lastActivity;
var st_timer;
var st_isIdleTimerOn = false;
localStorage.setItem('sessionSlide', 'isStarted');

function sessPingServer() {
    if (!st_isTimout) {
        $.ajax({
           url: '/home/keepalive',
           dataType: "json",
           async: false,
            success: function(result){
                console.log("Session Ping result: "+result);
            },
            error: function(result){
                sessLogOut();
            },
           type: "POST"
        });

        return true;
    }else{
        console.log("Ping Server: Timeout");
    }
}

function sessServerAlive() {
    st_sess_intervalID = setInterval('sessPingServer()', st_sessServerAliveTime);
}

function initSessionMonitor() {
    $(document).bind('keypress.session', function (ed, e) {
        sessKeyPressed(ed, e);
    });
    $(document).bind('mousedown keydown', function (ed, e) {
        sessKeyPressed(ed, e);
    });
    // sessServerAlive();
    console.log("Session timing started");
    startIdleTime();
}



$(window).scroll(function (e) {
    localStorage.setItem('sessionSlide', 'isStarted');
    startIdleTime();
});

function sessKeyPressed(ed, e) {
    var target = ed ? ed.target : window.event.srcElement;
    var st_sessionTarget = $(target).parents("#session-expire-warning-modal").length;

    if (st_sessionTarget != null && st_sessionTarget != undefined) {
        if (ed.target.id != "btnSessionExpiredCancelled" && ed.target.id != "btnSessionModal" && ed.currentTarget.activeElement.id != "session-expire-warning-modal" && ed.target.id != "btnExpiredOk"
             && ed.currentTarget.activeElement.className != "modal fade modal-overflow in" && ed.currentTarget.activeElement.className != 'modal-header'
    && st_sessionTarget != 1 && ed.target.id != "session-expire-warning-modal") {
            localStorage.setItem('sessionSlide', 'isStarted');
            startIdleTime();
        }
    }
}

function startIdleTime() {
    stopIdleTime();
    localStorage.setItem("sessIdleTimeCounter", $.now());
    st_idleIntervalID = setInterval('checkIdleTimeout()', 1000);
    st_isIdleTimerOn = false;
}

var st_sessionExpired = document.getElementById("session-expired-modal");
function sessionExpiredClicked(evt) {
    sessLogOut();
}


st_sessionExpired.addEventListener("click", sessionExpiredClicked, false);
function stopIdleTime() {
    clearInterval(st_idleIntervalID);
    clearInterval(st_remainingTimer);
}

function checkIdleTimeout() {
     // $('#sessionValue').val() * 60000;
    var st_idleTime = (parseInt(localStorage.getItem('sessIdleTimeCounter')) + (st_sessionTimeout));
    var st_idleExpiredTime = st_idleTime + (st_sessionWaitingExpireTimeout);
    // console.log("st_idleTime: "+ ($.now() - st_idleExpiredTime));
    if(!st_isTimout){
        if ($.now() > st_idleExpiredTime) {
            $("#session-expire-warning-modal").modal('hide');
            $("#session-expired-modal").modal('show');
            clearInterval(st_sess_intervalID);
            clearInterval(st_idleIntervalID);

            // $('.modal-backdrop').css("",);
            $("#session-expired-modal").css('z-index', 2000);
            // $('#btnExpiredOk').css('background-color', '#428bca');
            // $('#btnExpiredOk').css('color', '#fff');

            st_isTimout = true;
            
            //Auto logout after expired
            if(st_autoLogoutAfterExpired){
                sessLogOut();
            }

        }
        else if ($.now() > st_idleTime) {
            ////var isDialogOpen = $("#session-expire-warning-modal").is(":visible");
            if (!st_isIdleTimerOn) {
                ////alert('Reached idle');
                localStorage.setItem('sessionSlide', false);
                countdownDisplay();

                // $('.modal-backdrop').css("z-index", parseInt($('.modal-backdrop').css('z-index')) + 500);
                $('#session-expire-warning-modal').css('z-index', 1500);
                // $('#btnSessionOk').css('background-color', '#428bca');
                // $('#btnSessionOk').css('color', '#fff');
                // $('#btnSessionExpiredCancelled').css('background-color', '#428bca');
                // $('#btnSessionExpiredCancelled').css('color', '#fff');
                // $('#btnLogoutNow').css('background-color', '#428bca');
                // $('#btnLogoutNow').css('color', '#fff');

                $("#seconds-timer").empty();
                $("#session-expire-warning-modal").modal('show');
                st_isIdleTimerOn = true;
            }
        }
    }
}

$("#btnSessionExpiredCancelled").click(function () {
    $('.modal-backdrop').css("z-index", parseInt($('.modal-backdrop').css('z-index')) - 500);
});

$("#btnSessionOk").click(function () {
    $("#session-expire-warning-modal").modal('hide');
    $('.modal-backdrop').css("z-index", parseInt($('.modal-backdrop').css('z-index')) - 500);
    startIdleTime();
    sessPingServer();
    clearInterval(st_remainingTimer);
    localStorage.setItem('sessionSlide', 'isStarted');
});

$("#btnLogoutNow").click(function () {
    localStorage.setItem('sessionSlide', 'loggedOut');
    // window.location = "Logout.html";
    sessLogOut();
    $("#session-expired-modal").modal('hide');

});
$('#session-expired-modal').on('shown.bs.modal', function () {
    $("#session-expire-warning-modal").modal('hide');
    $(this).before($('.modal-backdrop'));
    $(this).css("z-index", parseInt($('.modal-backdrop').css('z-index')) + 1);
});

$("#session-expired-modal").on("hidden.bs.modal", function () {
    // window.location = "Logout.html";
    sessLogOut();
});
$('#session-expire-warning-modal').on('shown.bs.modal', function () {
    $("#session-expire-warning-modal").modal('show');
    $(this).before($('.modal-backdrop'));
    $(this).css("z-index", parseInt($('.modal-backdrop').css('z-index')) + 1);
});


function countdownDisplay() {
    var st_dialogDisplaySeconds = st_sessionWaitingExpireTimeout/1000;
    st_remainingTimer = setInterval(function () {
        if (localStorage.getItem('sessionSlide') == "isStarted") {
            $("#session-expire-warning-modal").modal('hide');
            startIdleTime();
            clearInterval(st_remainingTimer);
        }
        else if (localStorage.getItem('sessionSlide') == "loggedOut") {         
            $("#session-expire-warning-modal").modal('hide');
            $("#session-expired-modal").modal('show');
        }
        else {
            const duration = moment.duration(st_dialogDisplaySeconds, 'seconds');
            const format = Math.floor(duration.asMinutes()) + ':' + duration.seconds();
            $('#seconds-timer').html(format);
            st_dialogDisplaySeconds -= 1;
        }
    }
    , 1000);
};

function sessLogOut() {
    $.ajax({
        url: '/home/keepalive',
        dataType: "json",
        async: false,
         success: function(result){
            $('#frmsignoutsystem').attr('action',"/Identity/Account/Logout?returnUrl="+window.location.pathname).submit();
         },
         error: function(result){
            window.location.href ="/Identity/Account/Login?returnUrl="+window.location.pathname;
         },
        type: "POST"
     });

    
	// window.location = "Logout.html";
}
