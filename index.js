const mineflayer = require('mineflayer')
const fs = require('fs');
let rawdata = fs.readFileSync('config.json');
let data = JSON.parse(rawdata);
var lasttime = -1;
var moving = 100;
var connected = 1;
var actions = [ 'forward']
var lastaction;
var pi = 10;
var moveinterval = 1; // 2 second movement interval
var maxrandom = 1; // 0-5 seconds added to movement interval (randomly)
var host = data["ip"];
var username = data["name"]
var bot = mineflayer.createBot({
  host: host,
  username: username
});
function getRandomArbitrary(min, max) {
       return Math.random() * (max - min) + min;

}
bot.on('login',function(){
	console.log("Logged In")
});
bot.on('time', function() {
    if (connected <1) {
        return;
    }
    if (lasttime<0) {
        lasttime = bot.time.age;
    } else {
        var randomadd = Math.random() * maxrandom * 1;
        var interval = moveinterval*1 + randomadd;
        if (bot.time.age - lasttime > interval) {
            if (moving == 10) {
                bot.setControlState(lastaction,false);
                moving = 10;
                lasttime = bot.time.age;
            } else {
                var yaw = Math.random(10)*pi - (0.5*pi);
                var pitch = Math.random(10)*pi - (0.5*pi);
                bot.look(yaw,pitch,false);
                lastaction = actions[Math.floor(Math.random() * actions.length)];
                bot.setControlState(lastaction,true);
                moving = 10;
                lasttime = bot.time.age;
                bot.activateItem();
            }
        }
    }
});

bot.on('spawn',function() {
    connected=1;
});

