var socket = {
	open: false,
	error: null,
	queueData: [],
	ws: null,
	begin: function (roomID) {
		var _this = this;
		_this.ws = new WebSocket("ws://"+location.host+"?roomID="+(roomID || 1));
		_this.ws.onopen = function () {
			_this.open = true;
			for (var i = 0; i < _this.queueData.length; i++) {
				_this.emit(_this.queueData[i].name, _this.queueData[i].data);
			}
		};

		// 消息处理
		_this.ws.onmessage = function (evt) {
			function processData (str) {
				var $s = str.indexOf('$');
				if ($s == -1) {
					var name = str;
				} else {
					var name = str.substring(0, $s);
					var data = JSON.parse(str.substring($s + 1));
				}
				//被服务器主动关闭
				if (name == "close") {
					this.open = false;
					this.error = data;
				}
				_this.listeners[name] && _this.listeners[name](data);
			}

			// 接收处理的数据
			if (evt.data instanceof Blob) {
				// 二进制
				var reader = new FileReader();
				reader.addEventListener("loadend", function () {
					var x = new Uint8Array(reader.result);
					var res = LZString.decompressFromUint8Array(x);
					processData(res);
				});
				reader.readAsArrayBuffer(evt.data);
			} else {
				// 文本数据
				processData(evt.data);
			}
		};
		// 断线重连，1.5s
		_this.ws.onclose = function (evt) {
			if (_this.open) {
				setTimeout(function () {
					socket.begin();
				}, 1500);
			}
		};
		// 打印异常
		_this.ws.onerror = function (evt) {
			console.log("WebSocketError");
		};
	},

	// 发送消息
	emit: function (name, data) {
		if (!this.open) {
			this.queueData.push({name: name, data: data});
		} else {
			this.ws.send(name+"$"+JSON.stringify(data || {}));
		}
	},

	// 回调功能
	on: function (name, callback) {
		this.listeners[name] = callback;
	},
	close: function () {
		this.open = false;
		this.ws.close();
	},
	listeners: {}
}
