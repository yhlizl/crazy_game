
var DataSync = require('../lib/DataSync.js');

var Sign = function (game, data) {
	this.game = game;

	this.sync = new DataSync({
		id: data.id,
		type: "sign",
		x: data.x,
		y: data.y,
		working: 0, //執行
		workingTime: data.workingTime || 20, //工作耗時
		coolingTime: data.coolingTime || 200, //冷卻耗時
		cooling: 0, //冷卻
		openMax: data.openMax || 200,
		opening: data.opening || data.openMax || 200, //開啟狀態
	}, this);
}
Sign.prototype.update = function () {

}
Sign.prototype.getData = function () {
	return {
		id: this.id,
		type: "sign",
		x: this.x,
		y: this.y,
		message: this.message
	}
}
module.exports = Sign;