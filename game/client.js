"use strict"
var Pack = require('../static/js/JPack.js');
var C = require('../static/js/const.js');
var DataSync = require('./lib/DataSync.js');

var banedip = {};

var concount = 0;
var Client = function (socket, game, UUID) {
	this.id = concount++;
	this.p1 = null;
	this.socket = socket;
	this.game = game;
	this.UUID = UUID;
	this.admin = false;
	this.name = '工程師';
	this.joinTime = new Date().getTime();
	this.ip = socket.ip;
	
	this.kill = 0;
	this.death = 0;
	this.highestKill = 0;

	//會與客戶端同步的資料
	this.sync = new DataSync({
		me: null,
		onStruct: null,
		canClimb: false
	}, this);

	if (banedip[this.ip]) {
		this.banned = true;
	} else {
		this.banned = false;
	}
	this.connect();
}
Client.prototype.sendMap = function () {

	this.socket.emit("init", {
		props: this.game.props,
		map: this.game.map.getData(),
		bodies: [],
	});

	this.socket.emit("globalSync", this.game.sync.all());
}
Client.prototype.isAdmin = function () {
	var admin = null;
	for (let client of this.game.clients) {
		if (client.p1 && !client.p1.dieing && !client.p1.dead) {
			admin = client;
			break;
		}
	}
	return this == admin;
}
Client.prototype.connect = function () {
	var socket = this.socket;
	//接收初始化資料
	socket.on('init', data => {
		// console.log("init", data);
		//admin
		if (data.code != undefined) {
			// console.log("admin code:", data.code);
			if (data.code != this.game.adminCode) {
				console.log("admin fail");
				socket.emit('initFail');
				return;
			} else {	
				this.admin = true;
				socket.on('createItem', type => {
					var item = this.game.createItem(type);
					item.x = Math.random()*C.TW;
					item.y = Math.random()*C.TH;
				});
				socket.on('ban', cliID => {
					var client = this.game.getClient(cliID);
					client.banned = true;
					banedip[client.ip] = true;
				});
				socket.on('unban', cliID => {
					var client = this.game.getClient(cliID);
					client.banned = false;
					banedip[client.ip] = false;
				});
				socket.on('start', type => {
					// console.log(this.game)
					// console.log("data", data)
					// console.log("this",this)
					// console.log(this.game.sync)
					
					this.game.status= 2
					this.game.sync.schema.maxUser=0
					// this.game.sync.obj.store.maxUser=0
				});
				socket.on('addRoom', type => {
					// console.log("add room:",this.game)
					this.game.sync.schema.maxUser=200
					this.game.createMap();
					this.game.update();
					this.game.status= 1
					// this.game.sync.obj.store.maxUser=0
					console.log("add room end")
				});
			}
		}
		if (data.userName) {
			this.name = data.userName.replace(/[<>]/g, '').substring(0, 8);
		}

		//初始化資料
		var bodiesData = [];
		for (let body of this.game.bodies) {
			bodiesData.push(body.getData());
		}
		this.sendMap();
	});

	//加入
	socket.on('join', data => {
		if (this.banned) {
			socket.emit('joinFail', "you are banned");
			return;
		}
		var playerCount = 0;
		for (let user of this.game.users) {
			if (!user.npc) {
				playerCount++;
			}
		}
		if (playerCount >= this.game.maxUser) {
			socket.emit('joinFail', "加入失敗，伺服器已滿");
			return;
		}
		if (this.game.status===2){
			socket.emit('joinFail', "遊戲已經開始");
			return;
		}
		if (this.p1 && !this.p1.dieing && !this.p1.dead) {return}

		this.name = data.userName.replace(/[<>]/g, '').substring(0, 8);
		this.team = data.team;
		this.p1 = this.game.createUser(this);
		this.me = this.p1.id;
		socket.emit('joinSuccess');
	});
	//接收控制
	socket.on("control", data => {
		if (this.p1 && data) {
			var p1 =  Pack.controlPack.decode(data);
			this.p1.leftDown = p1.leftDown;
			this.p1.rightDown = p1.rightDown;
			this.p1.upDown = p1.upDown;
			this.p1.downDown = p1.downDown;
			this.p1.itemDown = p1.itemDown;
			this.p1.spaceDown = p1.spaceDown;

			this.p1.leftPress = p1.leftPress;
			this.p1.rightPress = p1.rightPress;
			this.p1.upPress = p1.upPress;
			this.p1.downPress = p1.downPress;
			this.p1.itemPress = p1.itemPress;
			this.p1.spacePress = p1.spacePress;
		}
	});

	socket.on("changeMap", data => {
		if (this.isAdmin()) {
			this.game.createMap();
		} else {
			this.game.announce('message', [this.p1.id,"希望更換地圖"]);
		}
	})
}
Client.prototype.getData = function () {
	return {
		p1: this.p1 && this.p1.id,
		id: this.id,
		admin: this.admin,
		name: this.name,
		banned: this.banned,
		joinTime: this.joinTime,
		ip: this.ip,
		kill: this.kill,
		death: this.death,
		highestKill: this.highestKill
	}
}
module.exports = Client;