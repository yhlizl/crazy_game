

### 遊戲目標:
	把其他人推下水
	使用道具消滅其他人
	have fun

### 加入:
	透過瀏覽器開啟後可以檢視目前的遊戲狀態，選擇加入後可以進行遊戲
	
	加入前給自己起個有個性的名字吧
	
	自己的角色頂部有黃色名稱，敵人角色頂部有紅色名稱

### 移動碰撞：
	wasd控制移動，當玩家處於平臺上時，w為跳躍，d為下蹲；當玩家處於梯子附近時（頭頂出現上下箭頭），w,d為爬梯子上下
	
    ** 手機上使用虛擬按鍵控制 **

	兩個玩家接觸後會產生碰撞，將兩個玩家彈開，使用這個機制把敵人推下平臺吧
	
	通常情況下，兩個玩家碰撞時，跳起或者蹲下的一方會有優勢

### 道具：
	遊戲中有紫色的能量球，玩家吃到後會產生各種能力或者效果，有些道具的效果能力強大，好好使用他們。詳情在道具部分介紹。

![demo](https://raw.githubusercontent.com/guanyuxin/baogame/master/doc/demo2.gif)

# 道具
### 毒藥:
![drug](https://raw.githubusercontent.com/guanyuxin/baogame/master/doc/drug.png)

*大部分道具是強大而有益的，但是看到毒藥你還是離他遠一些為好，他會讓吃到他的玩家立即死亡*

### 手槍:
![drug](https://raw.githubusercontent.com/guanyuxin/baogame/master/doc/gun.png)

*按q向面前發射一顆子彈，消滅任何敢於正面對抗你的敵人，注意：只有三發子彈，請節約使用。無法消滅下蹲或者跳起的敵人*

### 無敵:
![drug](https://raw.githubusercontent.com/guanyuxin/baogame/master/doc/power.png)

*並不是真正的無敵，但是會讓你直接消滅所有敢於觸碰你的敵人，並且他們無法給你造成碰撞*

### 隱身:
![drug](https://raw.githubusercontent.com/guanyuxin/baogame/master/doc/hide.png)

*使用後慢慢從你的敵人視野裡面消失，誰能和看不見的敵人戰鬥呢？*

### 驚喜:
![drug](https://raw.githubusercontent.com/guanyuxin/baogame/master/doc/random.png)

*surprise !*

### 噴氣揹包:
![drug](https://raw.githubusercontent.com/guanyuxin/baogame/master/doc/flypack.png)

*跳的不夠高？幹嘛不飛呢！跳起後再次按w進入飛航模式，讓那些只會蹦躂的人羨慕吧。等等,好像沒油了...*

### 手雷:
![drug](https://raw.githubusercontent.com/guanyuxin/baogame/master/doc/grenade.png)

*按住act扔出，按住的時間越久，扔的越遠，扔出後一段時間爆炸；蹲下時扔出的手雷會貼著地滾。手雷扔出的速度受角色影響，所以跑動時手雷速度更快，跳起時仍的更高*

--

![demo](https://raw.githubusercontent.com/guanyuxin/baogame/master/doc/demo3.gif)

# 搭建私服方法--透過npm [穩定版]

1.安裝node4.2.4(或者以上版本)和npm
# **如果安裝出現問題請嘗試將node升級至最新版本

2.shell中執行以下程式碼：

```
npm install fuzion-game &&
cd node_modules/fuzion-game/ &&
node app.js
```

3.開啟http://localhost:8030  就可以開始玩了

4.把localhost替換成你的域名或者ip，然後分享給你的朋友，一起玩吧

--

# 搭建私服方法--使用github [最新版]

將上面方法的第二部替換為：

```
git clone https://github.com/guanyuxin/baogame
cd baogame
npm install
node app.js
```
--

# 伺服器管理

```
#啟動引數：
node app.js [port=埠，預設8030] [code=管理員口令，預設admin] [room=房間數目，預設1]
```
http://localhost:port/admin  可以進入管理介面，需要localStorage中設定code=管理員口令，然後可以建立物品或者封禁使用者ip
