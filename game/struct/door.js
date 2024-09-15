"use strict"

var C = require('../../static/js/const.js');
var DataSync = require('../lib/DataSync.js');


var Door = function (game, data) {
	this.game = game;

	this.sync = new DataSync({
		id: data.id,
		type: "door",
		x: data.x,
		y: data.y,
		// message: "AI傳送門，使用空格鍵開啟/關閉",
		working: 0, //執行
		workingTime: data.workingTime || 80, //工作耗時
		coolingTime: data.coolingTime || 2000, //冷卻耗時
		cooling: 0, //冷卻
		opening: data.opening == undefined ? true : data.opening, //開啟狀態
	}, this);
	
	//最多使用幾次
	this.count = data.count;
	
	//同時最多控制多少npc
	this.liveCount = data.liveCount;

	this.npcConfig = data.npcConfig;

	this.users = [];
}
Door.prototype.act = function () {
	this.opening = !this.opening;
}
Door.prototype.createMob = function () {
	var npc = this.game.createNPC({name: "萌萌的AI", npc: true, AI: "auto"});
	npc.x = (this.x + .5) * C.TW;
	npc.y = (this.y + .5) * C.TH;
	return npc;
}
Door.prototype.update = function () {
	if ((!this.targetMob || this.targetMob.dead) && this.opening) {
		this.working++;
		if (this.working >= this.workingTime) {
			var item = this.createMob();
			this.targetMob = item;
			this.working = 0;
		}
	}
}
module.exports = Door;