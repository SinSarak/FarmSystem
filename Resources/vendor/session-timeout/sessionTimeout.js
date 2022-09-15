
var st_sessServerAliveTime = 10 * 60 * 2;
var st_sessionTimeout = 15 * 1000;
var st_sessLastActivity;
var st_idleTimer, st_remainingTimer;
var st_isTimout = false;

var st_sess_intervalID, st_idleIntervalID;
var st_sess_lastActivity;
var st_timer;
var st_isIdleTimerOn = false;
localStorage.setItem('sessionSlide', 'isStarted');

function sessPingServer() {
    console.log("Ping Server: starting");
    if (!st_isTimout) {
        console.log("Ping Server: Not timeout");
        $.ajax({
           url: '/home/keepalive',
           dataType: "json",
           async: false,
            success: function(result){
                console.log("Ping result:"+result);
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
    sessServerAlive();
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
    window.location = "Logout.html";
}


st_sessionExpired.addEventListener("click", sessionExpiredClicked, false);
function stopIdleTime() {
    clearInterval(st_idleIntervalID);
    clearInterval(st_remainingTimer);
}

function checkIdleTimeout() {
     // $('#sessionValue').val() * 60000;
    var st_idleTime = (parseInt(localStorage.getItem('sessIdleTimeCounter')) + (st_sessionTimeout)); 
    if ($.now() > st_idleTime + 60000) {
        $("#session-expire-warning-modal").modal('hide');
        $("#session-expired-modal").modal('show');
        clearInterval(st_sess_intervalID);
        clearInterval(st_idleIntervalID);

        $('.modal-backdrop').css("z-index", parseInt($('.modal-backdrop').css('z-index')) + 100);
        $("#session-expired-modal").css('z-index', 2000);
        $('#btnExpiredOk').css('background-color', '#428bca');
        $('#btnExpiredOk').css('color', '#fff');

        st_isTimout = true;

        sessLogOut();

    }
    else if ($.now() > st_idleTime) {
        ////var isDialogOpen = $("#session-expire-warning-modal").is(":visible");
        if (!st_isIdleTimerOn) {
            ////alert('Reached idle');
            localStorage.setItem('sessionSlide', false);
            countdownDisplay();

            $('.modal-backdrop').css("z-index", parseInt($('.modal-backdrop').css('z-index')) + 500);
            $('#session-expire-warning-modal').css('z-index', 1500);
            $('#btnSessionOk').css('background-color', '#428bca');
            $('#btnSessionOk').css('color', '#fff');
            $('#btnSessionExpiredCancelled').css('background-color', '#428bca');
            $('#btnSessionExpiredCancelled').css('color', '#fff');
            $('#btnLogoutNow').css('background-color', '#428bca');
            $('#btnLogoutNow').css('color', '#fff');

            $("#seconds-timer").empty();
            $("#session-expire-warning-modal").modal('show');


            st_isIdleTimerOn = true;
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
    clearInterval(st_remainingTimer);
    localStorage.setItem('sessionSlide', 'isStarted');
});

$("#btnLogoutNow").click(function () {
    localStorage.setItem('sessionSlide', 'loggedOut');
    window.location = "Logout.html";
    sessLogOut();
    $("#session-expired-modal").modal('hide');

});
$('#session-expired-modal').on('shown.bs.modal', function () {
    $("#session-expire-warning-modal").modal('hide');
    $(this).before($('.modal-backdrop'));
    $(this).css("z-index", parseInt($('.modal-backdrop').css('z-index')) + 1);
});

$("#session-expired-modal").on("hidden.bs.modal", function () {
    window.location = "Logout.html";
});
$('#session-expire-warning-modal').on('shown.bs.modal', function () {
    $("#session-expire-warning-modal").modal('show');
    $(this).before($('.modal-backdrop'));
    $(this).css("z-index", parseInt($('.modal-backdrop').css('z-index')) + 1);
});


function countdownDisplay() {

    var st_dialogDisplaySeconds = 10;
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

            $('#seconds-timer').html(st_dialogDisplaySeconds);
            st_dialogDisplaySeconds -= 1;
        }
    }
    , 1000);
};

function sessLogOut() {
   // $.ajax({
   //     url: 'Logout.html',
   //     dataType: "json",
  //      async: false,
  //      type: "POST"
 //   });
	
	window.location = "Logout.html";

}
