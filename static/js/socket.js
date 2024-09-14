var socket = {
    open: false,
    error: null,
    queueData: [],
    ws: null,
    begin: function (roomID) {
        var _this = this;
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        _this.ws = new WebSocket(protocol + "//" + location.host + "?roomID=" + (roomID || 1));
        _this.ws.onopen = function () {
            _this.open = true;
            for (var i = 0; i < _this.queueData.length; i++) {
                _this.emit(_this.queueData[i].name, _this.queueData[i].data);
            }
        };

        // 訊息處理
        _this.ws.onmessage = function (evt) {
            function processData (str) {
                var $s = str.indexOf('$');
                if ($s == -1) {
                    var name = str;
                } else {
                    var name = str.substring(0, $s);
                    var data = JSON.parse(str.substring($s + 1));
                }
                //被伺服器主動關閉
                if (name == "close") {
                    this.open = false;
                    this.error = data;
                }
                _this.listeners[name] && _this.listeners[name](data);
            }

            // 接收處理的資料
            if (evt.data instanceof Blob) {
                // 二進位制
                var reader = new FileReader();
                reader.addEventListener("loadend", function () {
                    var x = new Uint8Array(reader.result);
                    var res = LZString.decompressFromUint8Array(x);
                    processData(res);
                });
                reader.readAsArrayBuffer(evt.data);
            } else {
                // 文字資料
                processData(evt.data);
            }
        };
        // 斷線重連，1.5s
        _this.ws.onclose = function (evt) {
            if (_this.open) {
                setTimeout(function () {
                    socket.begin();
                }, 1500);
            }
        };
        // 列印異常
        _this.ws.onerror = function (evt) {
            console.log("WebSocketError");
        };
    },

    // 傳送訊息
    emit: function (name, data) {
		console.log("emit",name,data)
        if (!this.open) {
            this.queueData.push({name: name, data: data});
        } else {
            this.ws.send(name + "$" + JSON.stringify(data || {}));
        }
    },

    // 回撥功能
    on: function (name, callback) {
        this.listeners[name] = callback;
    },
    close: function () {
        this.open = false;
        this.ws.close();
    },
    listeners: {}
}