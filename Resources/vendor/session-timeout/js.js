; (function($){
    DPGSessionMonitor = function(options){
        var st_sessServerAliveTime = 10 * 60 * 2;
        var Timeout = 0.1 * 60000;   //Change here
        var WaitingExpiryTimeout = 0.2 * 60000; //Change here
        // var st_sessLastActivity;
        // var st_idleTimer;
        var st_remainingTimer;
        
        var AutoLogoutAfterExpired = false;

        var st_sess_intervalID, st_idleIntervalID;
        // var st_sess_lastActivity;
        // var st_timer;
        
        localStorage.setItem('sessionSlide', 'isStarted');



        var defaults = {
            Timeout : 30 * 60000,
            WaitingExpiryTimeout : 5 * 60000,
            AutoLogoutAfterExpired : false
        }

        var opts=$.extend(defaults,options);

        initSessionMonitor();

        function initSessionMonitor() {
            $(document).bind('keypress.session', function (ed, e) {
                sessKeyPressed(ed, e);
            });
            $(document).bind('mousedown keydown', function (ed, e) {
                sessKeyPressed(ed, e);
            });
            // sessServerAlive();
            console.log("DPG session starting");
            console.log("DPG session timing started");
            startIdleTime();
        }
        
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
            st_idleIntervalID = setInterval('checkIdleTimeout('+Timeout+','+WaitingExpiryTimeout+','+AutoLogoutAfterExpired+')', 1000);
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
    }
})(jQuery);
var st_isTimout = false;
var st_isIdleTimerOn = false;
function checkIdleTimeout(Timeout,WaitingExpiryTimeout,AutoLogoutAfterExpired) {
    var st_idleTime = (parseInt(localStorage.getItem('sessIdleTimeCounter')) + (Timeout));
    var st_idleExpiredTime = st_idleTime + (WaitingExpiryTimeout);
    if(!st_isTimout){
        if ($.now() > st_idleExpiredTime) {
            $("#session-expire-warning-modal").modal('hide');
            $("#session-expired-modal").modal('show');
            clearInterval(st_sess_intervalID);
            clearInterval(st_idleIntervalID);
            $("#session-expired-modal").css('z-index', 2000);
            st_isTimout = true;
            
            //Auto logout after expired
            if(AutoLogoutAfterExpired){
                sessLogOut();
            }

        }
        else if ($.now() > st_idleTime) {
            if (!st_isIdleTimerOn) {
                localStorage.setItem('sessionSlide', false);
                countdownDisplay();
                $('#session-expire-warning-modal').css('z-index', 1500);

                $("#seconds-timer").empty();
                $("#session-expire-warning-modal").modal('show');
                st_isIdleTimerOn = true;
            }
        }
    }
}
function countdownDisplay() {
    var st_dialogDisplaySeconds = WaitingExpiryTimeout/1000;
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