//移動的控制器
var p1 = {
    upDown: 0,
    downDown: 0,
    leftDown: 0,
    rightDown: 0,
    itemDown: 0,
    team: 0
}

// 檢測是否為手機設備
function isMobileDevice() {
    return /Mobi|Android/i.test(navigator.userAgent);
}

document.body.addEventListener('touchmove', function (e) {
    e.preventDefault();
});

// 根據設備類型顯示或隱藏 .mobileController
if (isMobileDevice()) {
    $('.mobileController').show();
} else {
    $('.mobileController').hide();
}

$('.notice').hide();

$('.mobileController .moreBtn').on('touchstart', function (e) {
    var t = $(e.currentTarget).data('act');
    if (t == 'a') {
        if (!p1.itemDown) {
            p1.itemPress = true;
        }
        p1.itemDown = 20000;
    } else if (t == 'l') {
        if (!p1.leftDown) {
            p1.leftPress = true;
        }
        p1.leftDown = 20000;
    } else if (t == 'r') {
        if (!p1.rightDown) {
            p1.rightPress = true;
        }
        p1.rightDown = 20000;
    } else if (t == 'u') {
        if (!p1.upDown) {
            p1.upPress = true;
        }
        p1.upDown = 20000;
    } else if (t == 'd') {
        if (!p1.downDown) {
            p1.downPress = true;
        }
        p1.downDown = 20000;
    }
});

$('.mobileController .moreBtn').on('touchend', function (e) {
    var t = $(e.currentTarget).data('act');
    if (t == 'a') {
        p1.itemDown = 0;
    } else if (t == 'l') {
        p1.leftDown = 0;
    } else if (t == 'r') {
        p1.rightDown = 0;
    } else if (t == 'u') {
        p1.upDown = 0;
    } else if (t == 'd') {
        p1.downDown = 0;
    }
});

$('.joining .joinBtn').click(function () {joing(true)});
$('.joining .dismissBtn').click(function () {
    $('.joining').hide();
});

initDone && initDone();