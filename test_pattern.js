// 17 chapter: adpter
var googleMap = {
    show: function() {
        console.log('google map');
    }
};

var baiduMap = {
    show: function(){
        console.log('baidu');
    }
};

var renderMap = function(map) {
    if (map.show instanceof Function) {
        map.show();
    }
};
renderMap(googleMap);
renderMap(baiduMap);

// adpater
var baiduMap = {
    display: function(){
        console.log('baidu');
    }
};

var baiduMapAdapter = {
    show: function(){
        return baiduMap.display();
    }
};
renderMap(googleMap);
renderMap(baiduMapAdapter);

//getGuangdongCity
var getGuangdongCity = function(){
    var guangdongCity = [
        {
            name: 'shenzhen',
            id: 11,
        },
        {
            name: 'guangzhou',
            id: 12,
        }
    ];
    return guangdongCity;
};

var render = function(fn) {
    console.log('rendering...');
    document.write(JSON.stringify(fn()));
};
render(getGuangdongCity);
//数据格式变化,增加适配器
var addressAdapter = function (oldAddressfn) {
    var address = {},
        oldAddress = oldAddressfn();
    
    for (var i = 0, c; c = oldAddress[i++];){
        address[c.name] = c.id;
    }
    return function(){
        return address;
    }
};

render(addressAdapter(getGuangdongCity));


// 16 chapter 状态模式
//非状态模式（电灯程序）
var Light = function(){
    this.stae = 'off';
    this.button = null;
}

Light.prototype.init = function(){
    var button = document.createElement('button'),
        self = this;
    
    button.innerHTML = 'onOrOff';
    this.button = document.body.appendChild(button);
    this.button.onclick = function(){
        self.buttonWaspressed();
    }
};
//变动部分
Light.prototype.buttonWaspressed = function() {
    if (this.state === 'off') {
        console.log('on');
        this.state = 'on';
    } else if (this.state === 'on') {
        console.log('off');
        this.state = 'off';
    }
};

var light = new Light();
light.init();

//变动部分
Light.prototype.buttonWaspressed = function() {
    if (this.state === 'off') {
        console.log('weaklight');
        this.state = 'weaklight';
    } else if (this.state === 'weaklight') {
        console.log('stronglight');
        this.state = 'stronglight';
    } else if (this.state === 'stronglight') {
        console.log('off');
        this.state = 'off';
    }
};

//引入状态模式
//OffLightState
var OffLightState = function(light) {
    this.light = light;
};

OffLightState.prototype.buttonWaspressed = function(){
    console.log('weaklight');  //offlightState对应的行为
    this.light.setState(this.light.weakLightState);  //状态切换
};

//WeakLightState:
var WeakLightState = function(light) {
    this.light = light;
}
WeakLightState.prototype.buttonWaspressed = function(){
    console.log('stonglight');  //WeakLightState对应的行为
    this.light.setState(this.light.strongLightState);  //状态切换
};
//StrongLightState:
var StrongLightState = function(light) {
    this.light = light;
}
StrongLightState.prototype.buttonWaspressed = function(){
    console.log('offlight');  //StrongLightState对应的行为
    this.light.setState(this.light.offLightState);  //状态切换
};

var Light = function(){
    this.offLightState = new offLightState(this);
    this.weakLightState = new WeakLightState(this);
    this.strongLightState = new StrongLightState(this);
    this.button = null;
};

Light.prototype.init = function (){
    var button = document.createElement('button'),
        self = this;

    this.button = document.body.appendChild(button);
    this.button.innerHTML = 'onOrOff';

    this.currState = this.offLightState;    //当前状态

    this.button.onclick = function(){
        self.currState.buttonWaspressed();
    }
};

Light.prototype.setState = function(newState) {
    this.currState = newState;
};

var light = new Light();
light.init();

//新增加类
var SuperStrongLightState = function(light) {
    this.light = light;
};

SuperStrongLightState.prototype.buttonWaspressed = function(){
    console.log('off');
    this.light.setState(this.light.offLightState);
};

var Light = function(){
    //...
    this.SuperStrongLightState = new SuperStrongLightState(this); //新增SuperStrongLightState对象
}

//状态模式的通用结构
var Light = function(){
    this.offLightState = new OffLightState(this);
    this.weakLightState = new WeakLightState(this);
    this.strongLightState = new StrongLightState(this);
    this.SuperStrongLightState = new SuperStrongLightState(this);
    this.button = null;
};

Light.prototype.init = function(){
    var button = document.createElement('button'),
        self = this;
    
    this.button = document.body.appendChild(button);
    this.button.innerHTML = 'onOrOff';
    this.currState = this.offLightState;   //设置默认初始状态

    this.button.onclick = function(){ //定义用户的请求动作
        self.currState.buttonWaspressed();
    }
};
//编写各种状态类
var OffLightState = function(light) {
    this.light = light;
};

OffLightState.prototype.buttonWaspressed = function(){
    console.log('weaklight');
    this.light.setState(this.light.weakLightState);
};

//缺少抽象类的变通方式
var State = function() {};

State.prototype.buttonWaspressed = function(){
    throw new Error('父类的 buttonWasPressed 方法必须被重写');
};
var SuperStrongLightState = function(light) {
    this.light = light;
};

SuperStrongLightState.prototype = new State();  //原型继承抽象父类

SuperStrongLightState.prototype.buttonWaspressed = function(){ //重写buttonWasPressed方法    
    console.log('off');
    this.light.setState(this.light.offLightState);
}

//状态模式示例：文件上传
window.external.upload = function(state) {
    console.log(state); // maybe state: sign, uploading, done, error
}

//上传插件对象
var plugin = (function(){
    var plugin = document.createElement('embed');
    plugin.style.display = 'none';

    plugin.type = 'application/txftn-webkit';

    plugin.sign = function(){
        console.log('scan');
    }
    plugin.pause = function(){
        console.log('pause');
    }
    plugin.uploading = function(){
        console.log('uploading');
    }
    plugin.del = function(){
        console.log('del');
    }
    plugin.done = function(){
        console.log('done');
    }
    document.body.appendChild(plugin);

    return plugin;
})();

//编码
var Upload = function(fileName) {
    this.plugin = plugin;
    this.fileName = fileName;
    this.button1 = null;
    this.button2 = null;
    this.state = 'sign';
};
Upload.prototype.init = function(){
    var that = this;
    this.dom = document.createElement('div');
    this.dom.innerHTML = 
        '<span>文件名称:'+ this.fileName +'</span>\
        <button data-action="button1">扫描中 </button>\
        <button data-action="button2">删除</button>';
    
    document.body.appendChild(this.dom);
    this.button1 = this.dom.querySelector('[data-action="button1"]'); 
    this.button2 = this.dom.querySelector('[data-action="button2"]'); 
    this.bindEvent();
};

Upload.prototype.bindEvent = function(){
    var self = this;
    this.button1.onclick = function(){
        if (self.state === 'sign') { //扫描状态下，任何操作无效
            console.log('scan');
        } else if (self.state === 'uploading') { 
            self.changeState('pause');
        } else if (self.state === 'pause') {
            self.changeState('uploading');
        } else if (self.state === 'done') {
            console.log('done');
        } else if (self.state === 'error') {
            console.log('fail, error');
        }
    };

    this.button2.onclick = function(){
        if (self.state === 'done' || self.state === 'error'
            || self.state === 'pause'
        ) {
            self.changeState('del');
        } else if (self.state === 'sign') {
            console.log('scan');
        } else if (self.state === 'uploading') {
            console.log('uploading');
        }
    };
};

Upload.prototype.changeState = function(state) {
    switch (state) {
        case 'sign':
            this.plugin.sign();
            this.button1.innerHTML = 'scan';
            break;
        case 'uploading':
            this.plugin.uploading();
            this.button1.innerHTML = 'uploading';
            break;
        case 'pause':
            this.plugin.pause();
            this.button1.innerHTML = 'pause';
            break;
        case 'done':
            this.plugin.done();
            this.button1.innerHTML = 'done';
            break;
        case 'error':
            this.button1.innerHTML = 'error';
            break;
        case 'del':
            this.plugin.del();
            this.dom.parentNode.removeChild(this.dom);
            console.log('del');
            break;
    }
    this.state = state;
}

//test work
var uploadObj = new Upload('some test');
uploadObj.init();

window.external.upload = function (state) { //插件调用javascript方法
    uploadObj.changeState(state);
};
window.external.upload('sign'); //文件开始扫描

setTimeout(function(){
    window.external.upload('uploading');
},1000);

setTimeout(function(){
    window.external.upload('done');
}, 5000);

//状态模式重构文件上传程序
//改造Upload构造函数
var Upload = function( fileName ) {
    this.plugin = plugin;
    this.fileName = fileName;
    this.button1 = null;
    this.button2 = null;
    this.signState = new signState(this); //设置初始状态为waiting
    this.uploadingState = new uploadingState(this);
    this.pauseState = new pauseState(this);
    this.doneState = new DoneState(this);
    this.errorState = new ErrorState(this);
    this.curState = this.signState;  //设置当前状态
}
//Upload.prototype.init无需改变

//具体的按钮事件, Context 并不做任何具体的操作，而是把请求委托给当前的状态类来执行
Upload.prototype.bindEvent = function(){
    var self = this;
    this.button1.onclick = function(){
        self.currState.clickHandler1();
    }
    this.button2.onclick = function(){
        self.currState.clickHandler2();
    }
};

//把状态对应的逻辑行为放在Upload类中
Upload.prototype.sign = function(){
    this.plugin.sign();
    this.currState = this.signState;
};

Upload.prototype.uploading = function(){
    this.button1.innerHTML = 'uploading';
    this.plugin.uploading();
    this.curState = this.uploadingState;
};
Upload.prototype.pause = function() {
    this.button1.innerHTML = 'pause';
    this.plugin.pause();
    this.currState = this.pauseState;
};
Upload.prototype.done = function(){
    this.button1.innerHTML = 'done';
    this.plugin.done();
    this.currState = this.doneState;
};
Upload.prototype.error = function(){
    this.button1.innerHTML = 'error';
    this.currState = this.errorState;
};
Upload.prototype.del = function(){
    this.plugin.del();
    this.dom.parentNode.removeChild(this.dom);
};

//编写各个状态类的实现，使用StaeFactory,
//避免因为Javascript没有抽象类所带来的问题
var StateFactory = (function(){
    var State = function(){};

    State.prototype.clickHandler1 = function (){
        throw new Error('rewrite clickHander1');
    }
    State.prototype.clickHandler2 = function (){
        throw new Error('rewrite clickHander2');
    }

    return function(param) {
        var F = function(uploadObj) {
            this.uploadObj = uploadObj;
        };

        F.prototype = new State();

        for (var i in param) {
            F.prototype[i] = param[i];
        }
        return F;
    }
})();

var SignState = StateFactory({
    clickHandler1: function(){
        console.log('scan');
    },
    clickHandler2: function(){
        console.log('uploading');
    }
});

var UploadingState = StateFactory({
    clickHandler1: function(){
        this.uploadObj.pause();
    },
    clickHandler2: function(){
        console.log('uploading');
    }
}); 

var PauseState = StateFactory({
    clickHandler1: function(){
        this.uploadObj.uploading();
    },
    clickHandler2: function(){
        this.uploadObj.del();
    }
}); 

var DoneState = StateFactory({
    clickHandler1: function(){
       console.log('done');
    },
    clickHandler2: function(){
        this.uploadObj.del();
    }
}); 

var ErrorState = StateFactory({
    clickHandler1: function(){
       console.log('error');
    },
    clickHandler2: function(){
        this.uploadObj.del();
    }
}); 

//test
var uploadObj = new Upload('some test');
uploadObj.init();

window.external.upload = function(state) {
    uploadObj[state]();
};

window.external.upload('sign');
setTimeout(function() {
    window.external.upload('uploading');
}, 1000);
setTimeout(function() {
    window.external.upload('done');
}, 5000);

//JavaScript版本的状态机
//Function.prototype.call 
//状态模式是状态机的实现之一，但在 JavaScript 这种“无类”语言中，没有规定让状态对象
//一定要从类中创建而来
//call实现 
var Light = function(){
    this.currState = FSM.off;
    this.button = null;
};

Light.prototype.init = function(){
    var button = document.createElement('button'),
        self = this;
    
    button.innerHTML = 'done';
    this.button = document.body.appendChild(button);
    this.button.onclick = function(){
        self.currState.buttonWaspressed.call(self); //把请求委托给FSM状态机
    }
};

var FSM = {
    off:{
        buttonWaspressed: function(){
            console.log('off');
            this.button.innerHTML = 'on next time';
            this.currState = FSM.on;
        }
    },
    on: {
        buttonWasPressed: function(){
            console.log('on');
            this.button.innerHTML = 'off next time';
            this.currState = FSM.off;
        }
    }
};

var light = new Light();
light.init();

// delegate 函数来完成这个状态机编写。这是面向对
//象设计和闭包互换的一个例子，前者把变量保存为对象的属性，而后者把变量封闭在闭包形成的环境中
// apply实现
var delegate = function(client, delegation) {
    return {
        buttonWaspressed: function(){ //将客户的操作委托给delegation对象
            return delegation.buttonWasPressed.apply(client, arguments);
        }
    }
};

var FSM = {
    off:{
        buttonWaspressed: function(){
            console.log('off');
            this.button.innerHTML = 'on next time';
            this.currState = FSM.onState;
        }
    },
    on: {
        buttonWasPressed: function(){
            console.log('on');
            this.button.innerHTML = 'off next time';
            this.currState = FSM.offState;
        }
    }
};

var Light = function() {
    this.offState = delegate(this, FSM.off);
    this.onState = delegate(this, FSM.on);
    this.currState = this.offState; //设置初始状态为关闭状态
    this.button = null;
};

Light.prototype.init = function(){
    var button = document.createElement('button'),
        self = this;
    button.innerHTML = 'off';
    this.button = document.body.appendChild(button);
    this.button.onclick = function(){
        self.currState.buttonWasPressed();
    }
};
var light = new Light();
light.init();

//表驱动的有限状态机
var fsm = StateMachine.create({
    initial: 'off',
    exvents: [
        {name: 'buttonWasPressed', from: 'off', to: 'on'},
        {name: 'buttonWasPressed', from: 'on', to: 'off'}
    ],
    callbacks: {
        onbuttonWasPressed: function(event, from, to) {
            console.log(arguments);
        }
    },
    error: function(eventName, from, to, args, errorCode, errorMessage) {
        console.log(arguments); // 从一种状态试图切换到一种不可能到达的状态的时候
    }
});
button.onclick = function(){
    fsm.buttonWaspressed();
}


//装饰器模式
var Plane = function(){}

Plane.prototype.fire = function(){
    console.log('common fire.');
}

var MissileDecorator = function(plane) {
    this.plane = plane;
}

MissileDecorator.prototype.fire = function(){
    this.plane.fire();
    console.log('missile fire.');
}

var AtomDecorator = function(plane) {
    this.plane = plane;
}
AtomDecorator.prototype.fire = function(){
    this.plane.fire();
    console.log('atom fire');
}
//装饰器测试
var plane = new Plane();
plane = new MissileDecorator(plane);
plane = new AtomDecorator(plane);

plane.fire();

//JavaScript装饰器
var plane = {
    fire: function(){
        console.log('common fire');
    }
}

var missileDecorator = function(){
    console.log('missile fire');
}

var atomDecorator = function(){
    console.log('atom fire.');
}

var fire1 = plane.fire;

plane.fire = function(){
    fire1();
    missileDecorator();
}

var fire2 = plane.fire;

plane.fire = function(){
    fire2();
    atomDecorator();
}

plane.fire();

//通过保存原引用的方式就可以改写某个函数
var a = function(){
    alert(1);
}
var _a = a;

a = function(){
    _a();
    alert(2);
}
a();
//----
window.onload = function(){
    alert(1);
}

var _onload = window.onload || function(){};
window.onload = function(){
    _onload();
    alert(2);
}
//this被劫持的问题
var _getElementById = document.getElementById;

document.getElementById = function(id){
    alert(1);
    return _getElementById(id);
}
var button = document.getElementById('button');

//修改后,采用apply or call绑定执行环境
document.getElementById = function(id){
    alert(1);
    return _getElementById.apply(document, arguments);
}

//用AOP装饰函数
Function.prototype.before = function(beforefn) {
    var __self = this;                   //保存原函数的引用
    return function(){                   //返回包含了原函数和新函数的“代理”函数
        beforefn.apply(this, arguments); //执行新函数，且保证this不被劫持,新函数接受的参数也会被原样传入原函数，新函数在原函数之前执行
        return __self.apply(this, arguments); //执行原函数并返回原函数的执行结果，并且保证this不被劫持
    }
}

Function.prototype.after = function(afterfn) {
    var __self = this;
    return function(){
        var ret = __self.apply(this, arguments);
        afterfn.apply(this, arguments);
        return ret;
    }
}

document.getElementById = document.getElementById.before(function(){
    alert(1);
});
var button = document.getElementById('button');

//---
window.onload = function(){
    alert(1);
}

window.onload = (window.onload || function(){}).after(function(){
    alert(2);
}).after(function(){
    alert(3);
}).after(function(){
    alert(4)
});

//避免污染原型的方式
var before = function(fn, beforefn) {
    return function(){
        beforefn.apply(this, arguments);
        return fn.apply(this, arguments);
    }
}

var a = before(
    function(){alert(3)},
    function(){alert(2)}
);
a = before(a, function(){alert(1);});
a();

//装饰器模式之登录数据上报案例
//原始做法：登录+上报
var showLogin = function(){
    console.log('open layer');
    log(this.getAttribute('tag'));
}

var log = function(tag) {
    console.log('tag: ' + tag);
    //(new Image).src = 'http://xxx/com/report?tag=' + tag;
}
document.getElementById('button').onclick = showLogin;

//AOP分离
Function.prototype.after = function(afterfn) {
    var __self = this;
    return function(){
        var ret = __self.apply(this, arguments); //__self替换this
        afterfn.apply(this, arguments);          //afterfn替换this
        return ret;
    }
}

var showLogin = function(){
    console.log('open layer');
}

var log = function(){
    console.log('tag: ' + this.getAttribute('tag'));
}

showLogin = showLogin.after(log); // 打开登录浮层之后上报数据
document.getElementById('button').onclick = showLogin;


//如何通过 Function.prototype.before 方法给函数 func 的参数 param 动态地添加属性 b
Function.prototype.before = function(beforefn) {
    var __self = this;
    return function(){
        beforefn.apply(this, arguments);
        return __self.apply(this, arguments);
    }
}

var func = function(param) {
    console.log(param);
}

func = func.before(function(param){
    param.b = 'b';
});
func({a: 'a'});

//ajax增加参数
//初始处理方式
var ajax = function(type, url, parm) {
    console.dir(param);
    //...
}
ajax('get', 'http://xxx.com/userinfo', {name: 'testname'});

//token
var getToken = function(){
    return 'Token';
}
//常规处理,代码僵硬
var ajax = function(type, url, param) {
    param = param || {};
    Param.Token = getToken();
    // ...
}
//干净的处理方式
var ajax = function(tyoe, url, param) {
    console.log(param);  
    //发送ajax请求的代码
}
var getToken = function(){
    return 'Token';
}
ajax = ajax.before(function(type, url, param){
    param.Token = getToken();
});
ajax('get', 'http://xxx.com/userinfo', {name: 'testname'});

//装饰器模式-插件式表单验证
//原始处理方式
var username = document.getElementById('username'),
    password = document.getElementById('password'),
    submitBtn = document.getElementById('submitBtn'),

var formSubmit = function(){
    if (username.value ===''){
        return alert('username is null');
    }
    if (password.value ===''){
        return alert('password is null');
    }    
    var param = {
        username: username.value,
        password: password.value
    }
    ajax('http://xxx.com/login',param); 
}    
submitBtn.onclick = function(){
    formSubmit();
}
//升级：职责分离
var validata = function(){
    if (username.value === '') {
        alert('username is null');
        return false;
    }
    if (password.value === '') {
        alert('password is null');
        return false;
    }
}

var formSubmit = function(){
    if (validata() === false) {
        return ;
    }
    var param = {
        username: username.value,
        password: password.value
    }
    ajax('http://xxx.com/login',param); 
}
submitBtn.onclick = function(){
    formSubmit();
}
//代码升级：代码进一步分离
Function.prototype.before = function(beforefn) {
    var __self = this;
    return function(){
        if (beforefn.apply(this, arguments) === false) {
            return ;
        }
        return __self.apply(this, arguments);
    }
}

var validata = function(){
    if (username.value === '') {
        alert('username is null');
        return false;
    }
    if (password.value === '') {
        alert('password is null');
        return false;
    }
}

var formSubmit = function(){    
    var param = {
        username: username.value,
        password: password.value
    }
    ajax('http://xxx.com/login',param); 
}

formSubmit = formSubmit.before(validata);
submitBtn.onclick = function(){
    formSubmit();
}
//值得注意的是，因为函数通过 Function.prototype.before 或者 Function.prototype.after 被装
//饰之后，返回的实际上是一个新的函数，如果在原函数上保存了一些属性，那么这些属性会丢失
var func = function(){
    alert(1);
}
func.a = 'a';

func = func.after(function(){
    alert(2);
});
alert(func.a); // undefined

//中介模式
//泡泡堂游戏
//原始版本 玩家2人
function Player( name ) {
    this.name = name;
    this.enemy = null;
};

Player.prototype.win = function() {
    console.log(this.name + ' won ');
};

Player.prototype.lose = function() {
    console.log(this.name + ' lost ');
};

Player.prototype.die = function() {
    this.lose();
    this.enemy.win();
};

var player1 = new Player('play1');
var player2 = new Player('play2');

player1.enemy = player2;
player2.enemy = player1;

player1.die();

//为游戏增加队伍
//低效的设计方式
player1.partners= [player1,player2,player3,player4];
player1.enemies = [player5,player6,player7,player8];
Player5.partners= [player5,player6,player7,player8];
Player5.enemies = [player1,player2,player3,player4];
//other way
var players = [];
function Player( name, teamColor ) {
    this.partners = [];
    this.enemies = [];
    this.state = 'live';    //状态
    this.name = name;       
    this.teamColor = teamColor; //队伍颜色
};
Player.prototype.win = function(){ //玩家团队胜利
    console.log('winner: ' + this.name);
}
Player.prototype.lose = function(){ //玩家团队失败
    console.log('loser: ' + this.name);
}
Player.prototype.die = function() { //玩家死亡
    var all_dead = true;
    this.state = 'dead'; //设置玩家状态为死亡

    for(var i = 0, partner; partner = this.partners[i++]; ) { //遍历队友列表
        if(partner.state !== 'dead' ){ //游戏未结束
            all_dead = false;
            break;
        }
    }
    //必须要显式地遍历通知其他对象
    if (all_dead === true) {
        this.lose();  //over
        for (var i = 0, partner; partner = this.partners[i++]; ) {
            //通知所有队友玩家游戏失败
            partner.lose();
        }
        for (var i = 0, enemy; enemy = this.enemies[i++]; ) {
            //通知所有队友玩家游戏胜利
            enemy.win();
        }
    }
};
//定义一个工厂方法创建玩家
var playerFactory = function(name, teamColor) {
    var newPlayer = new Player(name, teamColor); //创建新玩家

    for (var i = 0, player; player = players[i++]; ) { //通知所有的玩家，有新角色加入
        if(player.teamColor === newPlayer.teamColor) {
            player.partners.push(newPlayer);  //相互为队友
            newPlayer.partners.push(player);
        } else {
            player.enemies.push(newPlayer);  //相互为敌人
            newPlayer.enemies.push(player);
        }
    }
    players.push(newPlayer);   //加入所有玩家队列

    return newPlayer;
};
//红队：
var player1 = playerFactory( ' 皮蛋', 'red' ),
player2 = playerFactory( ' 小乖', 'red' ),
player3 = playerFactory( ' 宝宝', 'red' ),
player4 = playerFactory( ' 小强', 'red' );
//蓝队：
var player5 = playerFactory( ' 黑妞', 'blue' ),
player6 = playerFactory( ' 葱头', 'blue' ),
player7 = playerFactory( ' 胖墩', 'blue' ),
player8 = playerFactory( ' 海盗', 'blue' );

player1.die();
player2.die();
player4.die();
player3.die();

//玩家增多带来的困扰
//用中介模式升级代码
//首先仍然是定义 Player 构造函数和 player 对象的原型方法，
//在 player 对象的这些原型方法中，不再负责具体的执行逻辑，而是把操作转交给中介者对象。
function Player( name, teamColor ) {
    this.state = 'alive';    //状态
    this.name = name;       
    this.teamColor = teamColor; //队伍颜色
};
Player.prototype.win = function(){ //玩家团队胜利
    console.log('winner: ' + this.name);
}
Player.prototype.lose = function(){ //玩家团队失败
    console.log('loser: ' + this.name);
}
//玩家死亡
Player.prototype.die = function(){
    this.state = 'dead';
    playerDirector.reciveMessage('playerDead', this); //给中介者发送消息，玩家死亡
};
//移除玩家
Player.prototype.remove = function(){
    playerDirector.reciveMessage('removePlayer', this); //给中介者发送消息，移除一个玩家
}
//玩家换队
Player.prototype.changeTeam = function(color) {
    playerDirector.reciveMessage('changeTeam', this, color); //给中介者发送消息，玩家换队
}
//改写创建玩家对象的工厂函数
var playerFactory = function(name, teamColor) {
    var newPlayer = new Player(name, teamColor);  //创造一个新的玩家对象
    playerDirector.reciveMessage('addPlayer', newPlayer); //给中介者发送消息，新增玩家

    return newPlayer;
}
//实现中介者playerDirector
//1. 利用发布-订阅模式，将 playerDirector 实现为订阅者，各 player 作为发布者， 一旦 player
//的状态发生改变，便推送消息给 playerDirector， playerDirector 处理消息后将反馈发送给其他 player
//2. playerDirector 中开放一些接收消息的接口，各 player 可以直接调用该接口来给
//playerDirector 发送消息， player 只需传递一个参数给 playerDirector，这个参数的目的
//是使 playerDirector 可以识别发送者。同样， playerDirector 接收到消息之后会将处理结果反馈给其他player。
var playerDirector = (function(){
    var players = {},     //保存所有玩家
        operations = {};  //中介者可以执行的操作
    
    //新增一个玩家
    operations.addPlayer = function(player) {
        var teamColor = player.teamColor;  
        players[teamColor] = players[teamColor] || []; //玩家成立队伍
        players[teamColor].push(player);               //添加玩家进队伍
    };

    //移除一个玩家
    operations.removePlayer = function(player) {
        var teamColor = player.teamColor, //队伍颜色
            teamPlayers = players[teamColor] || []; //该队所有成员
        for(var i = teamPlayers.length - 1; i >= 0; i--){ 
            if(teamPlayers[i] === player) {
                teamPlayers.splice(i, 1);
            }
        }
    };

    //玩家换队
    operations.changeTeam = function(player, newTeamColor){ //玩家换队
        operations.removePlayer(player); //从原队伍中删除
        player.teamColor = newTeamColor; //改变队伍颜色
        operations.addPlayer(player);   //增加到新队伍中
    };

    operations.playerDead = function(player) { //玩家死亡
        var teamColor = player.teamColor,
            teamPlayers = players[teamColor];  //玩家所在队伍
        
        var all_dead = true;
        for(var i = 0, player; player = teamPlayers[i++]; ) {
            if(player.state !== 'dead') {
                add_dead = false;
                break;
            }
        }

        if(all_dead === true) { //全部死亡
            for(var i = 0, player; player = teamPlayers[i++];){
                player.lose();  //本队所有玩家lose
            }

            for (var color in players){
                if (color !== teamColor) {
                    var teamPlayers = players[color]; //其他队伍的玩家
                    for(var i =0, player; player = teamPlayers[i++];){
                        player.win();   //其他队伍所有玩家win
                    }
                }
            }
        }
    };

    var reciveMessage = function(){
        var message = Array.prototype.shift.call(arguments); //arguments的第一个参数为消息名称
        operations[message].apply(this, arguments);
    };
    return {
        reciveMessage: reciveMessage
    }
})();

//测试
// 红队：
var player1 = playerFactory( ' 皮蛋', 'red' ),
player2 = playerFactory( ' 小乖', 'red' ),
player3 = playerFactory( ' 宝宝', 'red' ),
player4 = playerFactory( ' 小强', 'red' );
// 蓝队：
var player5 = playerFactory( ' 黑妞', 'blue' ),
player6 = playerFactory( ' 葱头', 'blue' ),
player7 = playerFactory( ' 胖墩', 'blue' ),
player8 = playerFactory( ' 海盗', 'blue' );
player1.die();
player2.die();
player3.die();
player4.die();

player1.remove();
player2.remove();
player3.die();
player4.die();

player1.changeTeam( 'blue' );
player2.die();
player3.die();
player4.die();

//中介模式 购买商品
//初始处理方式
var colorSelect = document.getElementById('colorSelect'),
     numberInput = document.getElementById('numberInput'),
     colorInfo = document.getElementById('colorInfo'),
     numberInfo = document.getElementById('numberInfo'),
     nextBtn = document.getElementById('nextBtn');

var goods = { //库存
    "red": 3,
    "blue": 6
};

colorSelect.onchange = function(){
    var color = this.value, 
        number = numberInput.value,
        stock = goods[color];   //该颜色手机对应的当期库存
    
    color.innerHTML = color;
    if(!color) {
        nextBtn.disabled = true;
        nextBtn.innerHTML = 'select the color';
        return;
    }

    if(((number - 0) | 0) !== number - 0) { // 输入购买数量
        nextBtn.disabled = true;
        nextBtn.innerHTML = 'input the number';
        return ;
    }

    if(number > stock) {
        nextBtn.disabled = true;
        nextBtn.innerHTML = 'unengouh';
        return ;
    }
    nextBtn.disabled = false;
    nextBtn.innerHTML = 'put into car.'
}

numberInput.oninput = function(){
    var color = colorSelect.value, // 颜色
    number = this.value, // 数量
    stock = goods[color]; // 该颜色手机对应的当前库存
    numberInfo.innerHTML = number;

    if ( !color ){
        nextBtn.disabled = true;
        nextBtn.innerHTML = '请选择手机颜色';
        return;
    }
    if (((number - 0 )|0) !== number - 0 ){ // 输入购买数量是否为正整数
        nextBtn.disabled = true;
        nextBtn.innerHTML = '请输入正确的购买数量';
        return;
    }
    if ( number > stock ){ // 当前选择数量没有超过库存量
        nextBtn.disabled = true;
        nextBtn.innerHTML = '库存不足';
        return ;
    }
    nextBtn.disabled = false;
    nextBtn.innerHTML = '放入购物车';
};

//新增选择修改较多，耦合度较大
//引入中介模式
var goods = { // 手机库存
    "red|32G": 3,
    "red|16G": 0,
    "blue|32G": 1,
    "blue|16G": 6
};

var mediator = (function(){
    var colorSelect = document.getElementById( 'colorSelect' ),
        memorySelect = document.getElementById( 'memorySelect' ),
        numberInput = document.getElementById( 'numberInput' ),
        colorInfo = document.getElementById( 'colorInfo' ),
        memoryInfo = document.getElementById( 'memoryInfo' ),
        numberInfo = document.getElementById( 'numberInfo' ),
        nextBtn = document.getElementById( 'nextBtn' );
    
    return {
        changed: function(obj) {
            var color = colorSelect.value, 
                memory = memorySelect.value,
                number = numberInput.value,
                stock = goods[color + '|' + memory];  //颜色和内存
            
            if(obj === colorSelect) { 
                colorInfo.innerHTML = color;
            } else if (obj === memorySelect) {
                memoryInfo.innerHTML = memory;
            } else if (obj === numberInput) {
                numberInfo.innerHTML = number;
            }

            if (!color) {
                nextBtn.disabled = true;
                nextBtn.innerHTML = 'select color';
                return;
            }

            if (!memory) {
                nextBtn.disabled = true;
                nextBtn.innerHTML = 'select memory';
                return;
            }

            if(((number - 0) | 0) !== number -0) {  //输入正确的数字
                nextBtn.disabled = true;
                nextBtn.innerHTML = '输入正确的购买数字';
                return;
            }
            nextBtn.disabled = false;
            nextBtn.innerHTML = 'put in car';
        }
    } 
})();

//事件函数
colorSelect.onchange = function(){
    mediator.changed(this);
};
memorySelect.onchange = function(){
    mediator.changed(this);
};
numberInput.oninput = function(){
    mediator.changed(this);
};

//如果新增选项
var goods = { // 手机库存
    "red|32G|800": 3, // 颜色 red，内存 32G， cpu800，对应库存数量为 3
    "red|16G|801": 0,
    "blue|32G|800": 1,
    "blue|16G|801": 6
   };
   var mediator = (function(){
    // 略
    var cpuSelect = document.getElementById( 'cpuSelect' );
    return {
        change: function(obj){
            // 略
            var cpu = cpuSelect.value,
            stock = goods[ color + '|' + memory + '|' + cpu ];
            if ( obj === cpuSelect ){
                cpuInfo.innerHTML = cpu;
            }
            // 略
        }
    }
   })();

//职责链模式
//实际开发中的职责链模式
var order = function(orderType, pay, stock) {
    if( orderType === 1) {  //500元定金购买模式
        if(pay === true){ //已支付定金
            console.log('500 payed, get 100 coupon');
        } else { //未支付定金，降级到普通购买模式
            if(stock > 0){  //尚有库存
                console.log('普通购买，无优惠券');
            } else {
                console.log('库存不足');
            }
        }
    } else if (orderType === 2) { // 200元定金购买模式
        if (pay === true ){
            console.log('200 payed, get 500 coupon');
        } else {
            if (stock > 0) {
                console.log('普通购买，无优惠券');
            } else {
                console.log('库存不足');
            }
        }
    } else if (orderType === 3) {
        if (stock > 0) {
            console.log('普通购买，无优惠券');
        } else {
            console.log('库存不足');
        }
    }
};

order(1, true, 500);    // 输出：  500 元定金预购, 得到 100 优惠券

//职责链模式重构代码
//把 orderType、 pay、 stock 这 3 个字段当作参数传递给 500 元订单函数，如果该函数不
//符合处理条件，则把这个请求传递给后面的 200 元订单函数，如果 200 元订单函数依然不能处理
//该请求，则继续传递请求给普通购买函数
//500元订单
var order500 = function(orderType, pay, stock) {
    if(orderType === 1 && pay === true) {
        console.log('500 payed, get 100 coupon');
    } else {
        order200(orderType, pay, stock);    //将请求传递给200元订单， order200 和 order500 耦合在一起
    }
};
//200元订单
var order200 = function(orderType, pay, stock) {
    if(orderType === 2 && pay === true) {
        console.log('200 payed, get 50 coupon');
    } else {
        orderNormal(orderType, pay, stock);    //将请求传递给普通订单 耦合
    }
};
//普通购买订单
var orderNormal = function(orderType, pay, stock){
    if (stock > 0) {
        console.log('common buy, no compoun');
    } else {
        console.log('unenough stock');
    }
};

//测试
order500( 1 , true, 500); // 输出： 500 元定金预购, 得到 100 优惠券
order500( 1, false, 500 ); // 输出：普通购买, 无优惠券
order500( 2, true, 500 ); // 输出： 200 元定金预购, 得到 500 优惠券
order500( 3, false, 500 ); // 输出：普通购买, 无优惠券
order500( 3, false, 0 ); // 输出：手机库存不足


//灵活可拆分的职责链节点
//如果某个节点不能处理请求，则返回一个特定的字符串 'nextSuccessor' 来表示该请求需要继续往后面传递
//1,准备节点函数；2，定义构成函数

var order500 = function(orderType, pay, stock) {
    if (orderType === 1 && pay === true) {
        console.log('500, 100');
    } else {
        return 'nextSuccessor';     //不知道下一个节点时谁，只负责把请求往后面传递
    }
};

var order200 = function(orderType, pay, stock) {
    if (orderType === 2 && pay === true) {
        console.log('200, 50');
    } else {
        return 'nextSuccessor';     //不知道下一个节点时谁，只负责把请求往后面传递
    }
};

var orderNormal = function(orderType, pay, stock) {
    if (stock > 0) {
        console.log('common buy');
    } else {
        console.log('unenough stock');
    }
};

//把函数包装进职责链节点，我们定义一个构造函数 Chain，在 new Chain 的时候传
//递的参数即为需要被包装的函数， 同时它还拥有一个实例属性 this.successor，表示在链中的下一个节点
//Chain.prototype.setNextSuccessor  指定在链中的下一个节点
//Chain.prototype.passRequest   传递请求给某个节点
var Chain = function(fn) {
    this.fn = fn;
    this.successor = null;
};

Chain.prototype.setNextSuccessor = function(successor) {
    return this.successor = successor;
};

Chain.prototype.passRequest = function(){
    var ret = this.fn.apply(this, arguments);

    if (ret === 'nextSuccessor') {
        return this.successor && this.successor.passRequest.apply(this.successor, arguments);
    }
    return ret;
};
//把 3 个订单函数分别包装成职责链的节点
var chainOrder500 = new Chain(order500);
var chainOrder200 = new Chain(order200);
var chainOrderNormal = new Chain(orderNormal);
//指定节点在职责链中的顺序
chainOrder500.setNextSuccessor(chainOrder200);
chainOrder200.setNextSuccessor(chainOrderNormal);
//最后把请求传递给第一个节点
chainOrder500.passRequest( 1, true, 500 ); // 输出： 500 元定金预购，得到 100 优惠券
chainOrder500.passRequest( 2, true, 500 ); // 输出： 200 元定金预购，得到 50 优惠券
chainOrder500.passRequest( 3, true, 500 ); // 输出：普通购买，无优惠券
chainOrder500.passRequest( 1, false, 0 ); // 输出：手机库存不足
//新增节点
var order300 = function(){
    //...
};
chainOrder300 = new Chain(order300);
chainOrder500.setNextSuccessor(chainOrder300);
chainOrder300.setNextSuccessor(chainOrder200);


//新增异步的考虑
Chain.prototype.next = function(){
    return this.successor && this.successor.passRequest(this.successor, arguments);
}
//异步职责链
var fn1 = new Chain(function(){
    console.log(1);
    return 'nextSuccessor';
});

var fn2 = new Chain(function(){
    console.log(2);
    var self = this;
    setTimeout(function(){
        self.next();
    }, 1000);
});

var fn3 = new Chain(function(){
    console.log(3);
});

fn1.setNextSuccessor(fn2).setNextSuccessor(fn3);
fn1.passRequest();

//用AOP实现职责链
// Function.prototype.after 函数，使得第一个函数返回'nextSuccessor'
//时，将请求继续传递给下一个函数，无论是返回字符串'nextSuccessor' 或者 false 都只是一个约
//定，当然在这里我们也可以让函数返回 false 表示传递请求，选择'nextSuccessor' 字符串是因为它看起来更能表达我们的目的
Function.prototype.after = function(fn){
    var self = this;
    return function(){
        var ret = self.apply(this, arguments);
        if (ret === 'nextSuccessor') {
            return fn.apply(this, arguments);
        }

        return ret;
    }
};

var order = order500yuan.after(order200yuan).after(orderNormal);
//用 AOP 来实现职责链既简单又巧妙，但这种把函数叠在一起的方式，同时也叠加了函数的
//作用域，如果链条太长的话，也会对性能有较大的影响
order( 1, true, 500 ); // 输出： 500 元定金预购，得到 100 优惠券
order( 2, true, 500 ); // 输出： 200 元定金预购，得到 50 优惠券
order( 1, false, 500 ); // 输出：普通购买，无优惠券

//用职责链模式获取文件上传对象
var getActiveUploadObj = function(){
    try{
        return new ActiveXObject("TXFTNActiveX.FTNUpload");  //IE上传控件
    } catch (e) {
        return 'nextSuccessor';
    }
};

var getFlashUploadObj = function(){
    if ( supportFlash() ){
    var str = '<object type="application/x-shockwave-flash"></object>';
    return $( str ).appendTo( $('body') );
    }
    return 'nextSuccessor' ;
};

var getFormUpladObj = function(){
    return $( '<form><input name="file" type="file"/></form>' ).appendTo( $('body') );
};

var getUploadObj = getActiveUploadObj.after(getFlashUploadObj).after(getFormUpladObj);

console.log(getUploadObj);


//享元模式
//一种用于性能优化的模式,其核心是运用共享技术有效支持大量细粒度的对象。
//50男模特 50女模特
var Model = function(sex, underwear) {
    this.sex = sex;
    this.underwear = underwear;
};

Model.prototype.takePhoto = function(){
    console.log( 'sex= ' + this.sex + ' underwear=' + this.underwear);
}

for ( var i = 1; i <= 50; i++ ){
    var maleModel = new Model( 'male', 'underwear' + i );
    maleModel.takePhoto();
};

for ( var j = 1; j <= 50; j++ ){
    var femaleModel= new Model( 'female', 'underwear' + j );
    femaleModel.takePhoto();
};

//升级为享元模式
var Model = function(sex) {
    this.sex = sex;
};

Model.prototype.takePhoto = function(){
    console.log( 'sex= ' + this.sex + ' underwear=' + this.underwear);
}
//创建男女模特
var maleModel = new Model('male'),
    femaleModel = new Model('female');

for (var i = 1; i <= 50; i++){
    maleModel.underwear = 'underwear' + i;
    maleModel.takePhoto();
};

for (var i = 1; i <= 50; i++){
    femaleModel.underwear = 'underwear' + i;
    femaleModel.takePhoto();
}
//内部状态与外部状态
//享元模式要求将对象的属性划分为内部状态与外部状态（状态在这里通常指属性）。享元模式的目标是尽量减少共享对象的数量
//几条经验
// 内部状态存储于对象内部。
// 内部状态可以被一些对象共享。 
// 内部状态独立于具体的场景，通常不会改变。
// 外部状态取决于具体的场景，并根据场景而变化，外部状态不能被共享。
//享元模式的关键是如何区别内部状态和外部状态

//文件上传--对象爆炸 --享元模式
var id = 0;
window.startUpload = function(uploadType, files) {
    for (var i = 0, file; file = files[i++];) {
        var uploadObj = new Upload(uploadType, file.fileName, file.fileSize);
        uploadObj.init(id++);   //给 upload 对象设置一个唯一的 id
    }
}
var Upload = function( uploadType, fileName, fileSize ){
    this.uploadType = uploadType;
    this.fileName = fileName;
    this.fileSize = fileSize;
    this.dom= null;
};

Upload.prototype.init = function( id ){
    var that = this;
    this.id = id;
    this.dom = document.createElement( 'div' );
    this.dom.innerHTML =
    '<span>文件名称:'+ this.fileName +', 文件大小: '+ this.fileSize +'</span>' +
    '<button class="delFile">删除</button>';
    this.dom.querySelector( '.delFile' ).onclick = function(){
    that.delFile();
    }
    document.body.appendChild( this.dom );
};

Upload.prototype.delFile = function (){
    if (this.fileSize < 3000) {
        return this.dom.parentNode.removeChild(this.dom);
    }
    if (window.confirm('sure to delete the file?' + this.fileName)) {
        return this.dom.parentNode.removeChild(this.dom);
    }
};

startUpload( 'plugin', [
    {
        fileName: '1.txt',
        fileSize: 1000
    },
    {
        fileName: '2.html',
        fileSize: 3000
    },
    {
        fileName: '3.txt',
        fileSize: 5000
    }
   ]);
   startUpload( 'flash', [
    {
        fileName: '4.txt',
        fileSize: 1000
    },
    {
        fileName: '5.html',
        fileSize: 3000
    },
    {
        fileName: '6.txt',
        fileSize: 5000
    }
]);
//享元模式升级
var Upload = function(uploadType) {
    this.uploadType = uploadType;
};

Upload.prototype.delFile = function (){
    uploadManager.setExternalState(id, this); //把当前 id 对应的对象的外部状态都组装到共享对象中

    if (this.fileSize < 3000) {
        return this.dom.parentNode.removeChild(this.dom);
    }
    if (window.confirm('sure to delete the file?' + this.fileName)) {
        return this.dom.parentNode.removeChild(this.dom);
    }
};

var UploadFactory = (function(){
    var createdFlyWeightObjs = {};

    return {
        create: function(uploadType){
            //如果某种内部状态对应的共享对象已经被创建过，那么直接返回这个对象，否则创建一个新的对象
            if(createdFlyWeightObjs[uploadType]){
                return createdFlyWeightObjs[uploadType];
            }

            return createdFlyWeightObjs[uploadType] = new Upload(uploadType);
        }
    }
})();

//管理器封装外部状态
var uploadManager = (function(){
    var uploadDatabase = {};

    return {
        add: function(id, uploadType, fileName, fileSize) {
            var flyWeightObj = UploadFactory.create(uploadType);

            var dom = document.createElement( 'div' );
            dom.innerHTML =
            '<span>文件名称:'+ fileName +', 文件大小: '+ fileSize +'</span>' +
            '<button class="delFile">删除</button>';
                dom.querySelector( '.delFile' ).onclick = function(){
                flyWeightObj.delFile( id );
            }
            document.body.appendChild(dom);

            uploadDatabase[id] = {
                fileName: fileName,
                fileSize: fileSize,
                dom: dom
            };

            return flyWeightObj;
        },
        setExternalState: function(id, flyWeightObj){
            var uploadData = uploadDatabase[id];
            for (var i in uploadData) {
                flyWeightObj[i] = uploadData[i];
            }
        }
    }
})();

//触发startUpload
var id = 0;

window.startUpload = function(uploadType, files){
    for(var i = 0, file; file = files[i++]; ) {
        var uploadObj = uploadManager.add(++id, uploadType, file.fileName, file.fileSize);
    }
};

//没有内部状态的享元
var Upload = function(){};

//没有了内部状态，这意味着只需要唯一的一个共享对象
//当对象没有内部状态的时候，生产共享对象的工厂实际上变成了一个单例工厂
//虽然这时候的共享对象没有内部状态的区分，但还是有剥离外部状态的过程，我们依然倾向于称之为享元模式.
var UploadFactory = (function(){
    var uploadObj;
    return {
        create: function(){
            if(uploadObj) {
                return uploadObj;
            }
            return uploadObj = new Upload();
        }
    }
})();

//没有外部状态的享元

//对象池--地图冒泡点
var toolTipFactory = (function(){
    var toolTipPool = [];   //toolTip对象池

    return {
        create: function(){
            if (toolTipPool.length ===0 ) { //如果对象池为空
                var div = document.createElement('div');    
                document.body.appendChild(div);
                return div;
            } else {  //对象池非空
                return toolTipPool.shift();  //从对象池取出一个dom
            }
        },
        recover: function(tooltipDom){
            return toolTipPool.push(tooltipDom);    //对象池回收dom
        }
    }
})();

//test
var ary = [];

for (var i = 0, str; str = ['A', 'B'][i++];){
    var toolTip = toolTipFactory.create();
    toolTip.innerHTML = str;
    ary.push(toolTip);
};

//回收
for (var i = 0, toolTip; toolTip = ary[i++];){
    toolTipFactory.recover(toolTip);
}

//创建6个小气泡
for (var i = 0, str; str = ['A', 'B', 'C', 'D', 'E','F'][i++];){
    var toolTip = toolTipFactory.create();
    toolTip.innerHTML = str;
    ary.push(toolTip);
};

//通用对象池实现
var objectPoolFactory = function(createObjFn) {
    var objectPool = [];

    return {
        create: function(){
            var obj = objectPool.length === 0 ?
                createObjFn.apply(this, arguments) : objectPool.shift();
            
            return obj;
        },
        recover: function(obj){
            objectPool.push(obj);
        }
    }
};
//享元模式是为解决性能问题而生的模式，在一个存在
//大量相似对象的系统中，享元模式可以很好地解决大量对象带来的性能问题
//利用objectPoolFactory装载iframe 的对象池
//对象池是另外一种性能优化方案，它跟享元模式有一些相似之处，但没有分离内部状态和外部状态这个过程
var iframeFactory = objectPoolFactory(function(){
    var iframe = document.createElement('iframe');
        document.body.appendChild(iframe);

    iframe.onload = function(){
        iframe.onload = null;   //防止iframe重复加载的bug
        iframeFactory.recover(iframe); //iframe加载完成之后回收节点
    }        

    return iframe;
});

var iframe1 = iframeFactory.create();
iframe1.src = 'http://baidu.com';

var iframe2 = iframeFactory.create();
iframe2.src = 'http://qq.com';

setTimeout(function(){
    var iframe3 = iframeFactory.create();
    iframe3.src = 'http://163.com';
}, 3000);

//模板方法模式
//模板方法模式是一种只需使用继承就可以实现的非常简单的模式
//模板方法模式由两部分结构组成，第一部分是抽象父类，第二部分是具体的实现子类。通常
//在抽象父类中封装了子类的算法框架，包括实现一些公共方法以及封装子类中所有方法的执行顺
//序。子类通过继承这个抽象类，也继承了整个算法结构，并且可以选择重写父类的方法。

//测试 Coffee or Tea
var Coffee = function(){};
Coffee.prototype.boilWater = function(){
 console.log( ' 把水煮沸' );
};
Coffee.prototype.brewCoffeeGriends = function(){
 console.log( ' 用沸水冲泡咖啡' );
};
Coffee.prototype.pourInCup = function(){
 console.log( ' 把咖啡倒进杯子' );
};
Coffee.prototype.addSugarAndMilk = function(){
 console.log( ' 加糖和牛奶' );
};
Coffee.prototype.init = function(){
    this.boilWater();
    this.brewCoffeeGriends();
    this.pourInCup();
    this.addSugarAndMilk();
};

var coffee = new Coffee();
coffee.init();

//泡一壶茶
var Tea = function(){};
Tea.prototype.boilWater = function(){
 console.log( ' 把水煮沸' );
};
Tea.prototype.steepTeaBag = function(){
 console.log( ' 用沸水浸泡茶叶' );
};
Tea.prototype.pourInCup = function(){
 console.log( ' 把茶水倒进杯子' );
};
Tea.prototype.addLemon = function(){
 console.log( ' 加柠檬' );
};

Tea.prototype.init = function(){
    this.boilWater();
    this.brewCoffeeGriends();
    this.pourInCup();
    this.addSugarAndMilk();
};

var tea = new Tea();
tea.init();

//分离出共同点
var Beverage = function(){};
Beverage.prototype.boilWater = function(){
    console.log('煮水');
};
Beverage.prototype.brew = function(){}; //空方法，由子类重写
Beverage.prototype.pourInCup = function(){}; //空方法，由子类重写
Beverage.prototype.addCondiments = function(){}; //空方法，由子类重写
Beverage.prototype.init = function(){
    this.boilWater();
    this.brew();
    this.pourInCup();
    this.addCondiments();
}

//实现Coffee子类和Tea子类
var Coffee = function(){};
Coffee.prototype = new Beverage();
//重写抽象父类的方法
Coffee.prototype.brew = function(){
    console.log('brew');
}; 
Coffee.prototype.pourInCup = function(){
    console.log('pourInCup');
}; 
Coffee.prototype.addCondiments = function(){
    console.log('addCondiments');
}; 
var Coffee = new Coffee();
Coffee.init();
//Beverage.prototype.init 被称为模板方法的原因是，该方法中封装了子类的算法框架，它作
//为一个算法的模板，指导子类以何种顺序去执行哪些方法。在 Beverage.prototype.init 方法中，
//算法内的每一个步骤都清楚地展示在我们眼前。

//JavaScript 没有抽象类的缺点和解决方案
//抽象类的第一个作用是隐藏对象的具体类型，由于 JavaScript 是一门“类型模糊”的语言，所以隐藏对象的类型在 JavaScript 中并不重要
//在 JavaScript 中使用原型继承来模拟传统的类式继承时，并没有编译器帮助我们进行任何形式的检查，我们也没有办法保证子类会重写父类中的“抽象方法”
//提供两种变通的解决方案
//1.鸭子类型来模拟接口检查，以便确保子类中确实重写了父类的方法。但模
//拟接口检查会带来不必要的复杂性，而且要求程序员主动进行这些接口检查，这就要求
//我们在业务代码中添加一些跟业务逻辑无关的代码;
//2. Beverage.prototype.brew 等方法直接抛出一个异常，如果因为粗心忘记编
//写 Coffee.prototype.brew 方法，那么至少我们会在程序运行时得到一个错误
Beverage.prototype.brew = function(){
    throw new Error('子类必须重写brew方法');
};
Beverage.prototype.pourInCup = function(){
    throw new Error('子类必须重写pourInCup方法');
};
Beverage.prototype.addCondiments = function(){
    throw new Error('子类必须重写addCondiments方法');
};

//模板方法模式常被架构师用于搭建项目的框架，架构师定好了框架的骨架，
//程序员继承框架的结构之后，负责往里面填空，比如 Java 程序员大多使用过 HttpServlet 技术来开发项目

//钩子方法
//在父类中容易变化的地方放置钩子，钩子可以有一个默认的实现，究竟要不要“挂钩”，这由子类自
//行决定。钩子方法的返回结果决定了模板方法后面部分的执行步骤，也就是程序接下来的走向,从此让程序就拥有了变化的可能。
//钩子：customerWantsCondiments
var Beverage = function(){};
Beverage.prototype.boilWater = function(){
 console.log( ' 把水煮沸' );
};
Beverage.prototype.brew = function(){
 throw new Error( ' 子类必须重写 brew 方法' );
};
Beverage.prototype.pourInCup = function(){
 throw new Error( ' 子类必须重写 pourInCup 方法' );
};
Beverage.prototype.addCondiments = function(){
 throw new Error( ' 子类必须重写 addCondiments 方法' );
};
Beverage.prototype.customerWantsCondiments = function(){
    return true; //默认需要调料
};

Beverage.prototype.init = function(){
    this.boilWater();
    this.brew();
    this.pourInCup();
    if (this.customerWantsCondiments()) { //如果挂钩返回 true，则需要调料
        this.addCondiments();
    }
}

var CoffeeWithHook = function(){};

CoffeeWithHook.prototype = new Beverage();
CoffeeWithHook.prototype.brew = function(){
    console.log( ' 用沸水冲泡咖啡' );
};
CoffeeWithHook.prototype.pourInCup = function(){
    console.log( ' 把咖啡倒进杯子' );
};
CoffeeWithHook.prototype.addCondiments = function(){
    console.log( ' 加糖和牛奶' );
};

CoffeeWithHook.prototype.customerWantsCondiments = function(){
    return window.confirm(' need Condiments?');
};

var CoffeeWithHook = new CoffeeWithHook();
CoffeeWithHook.init();

//好莱坞原则实现
var Beverage = function(param) {
    var boilWater = function(){
        console.log('boilWater');
    };

    var brew = param.brew || function(){
        throw new Error('必须传递 brew 方法');
    };

    var pourInCup = param.pourInCup || function(){
        throw new Error( ' 必须传递 pourInCup 方法' );
    };
    var addCondiments = param.addCondiments || function(){
        throw new Error( ' 必须传递 addCondiments 方法' );
    };

    var F = function(){};
    F.prototype.init = function(){
        boilWater();
        brew();
        pourInCup();
        addCondiments();
    };

    return F;
};

var Coffee = Beverage({
    brew: function(){
        console.log( ' 用沸水冲泡咖啡' );
    },
    pourInCup: function(){
        console.log( ' 把咖啡倒进杯子' );
    },
    addCondiments: function(){
        console.log( ' 加糖和牛奶' );
    }
});

var Tea = Beverage({
    brew: function(){
        console.log( ' 用沸水浸泡茶叶' );
    },
    pourInCup: function(){
        console.log( ' 把茶倒进杯子' );
    },
    addCondiments: function(){
        console.log( ' 加柠檬' );
    }
});

var coffee = new Coffee();
coffee.init();

var tea = new Tea();
tea.init();

//组合模式
var closeDoorCommand = {
    execute: function(){
        console.log( ' 关门 ' );
    }
};
var openPcCommand = {
    execute: function(){
     console.log( ' 开电脑' );
    }
};
var openQQCommand = {
    execute: function(){
     console.log( ' 登录 QQ' );
    }
};

var MacroCommand = function(){
    return {
        commandsList: [],
        add: function(command){
            this.commandsList.push(command);
        },
        execute: function(){
            for (var i = 0, command; command = this.commandsList[i++];){
                command.execute();
            }
        }
    }
};

var marcroCommand = MacroCommand();
marcroCommand.add(closeDoorCommand);
marcroCommand.add(openPcCommand);
marcroCommand.add(openQQCommand);

marcroCommand.execute();


//更强大的宏命令
var MacroCommand = function(){
    return {
        commandsList: [],
        add: function(command){
            this.commandsList.push(command);
        },
        execute: function(){
            for (var i = 0, command; command = this.commandsList[i++];){
                command.execute();
            }
        }
    }
};

var openAcCommand = {
    execute: function(){
        console.log('打开空调');
    }
};
//电视和和音响连接在一起
var openTvCommand = {
    execute: function(){
        console.log('打开电视');
    }
};
var openSoundCommand = {
    execute: function(){
        console.log('打开音响');
    }
};
var macroCommand1 = MacroCommand();
macroCommand1.add(openTvCommand);
macroCommand1.add(openSoundCommand);
//关门，打开电脑和登录QQ的命令
var closeDoorCommand = {
    execute: function(){
        console.log('关门');
    }
};
var openPcCommand = {
    execute: function(){
        console.log('开电脑');
    }
};
var openQQCommand = {
    execute: function(){
        console.log('登录QQ');
    }
};

var macroCommand2 = MacroCommand();
macroCommand2.add(closeDoorCommand);
macroCommand2.add(openPcCommand);
macroCommand2.add(openQQCommand);
//整合所有的命令为一个'超级命令'
var macroCommand = MacroCommand();
macroCommand.add(openAcCommand);
macroCommand.add(macroCommand1);
macroCommand.add(macroCommand2);

//将超级命令绑定给遥控器
var setCommand = (function(command){
    document.getElementById('button').onclick = function(){
        command.execute();
    }
})(macroCommand);
//JavaScript 中实现组合模式的难点在于要保证组合对象和叶对象对象拥有同样的方法，
//这通常需要用鸭子类型的思想对它们进行接口检查

//透明性带来的安全问题
//组合模式的透明性使得发起请求的客户不用去顾忌树中组合对象和叶对象的区别，但它们在本质上有是区别
var MacroCommand = function(){
    return {
        commandsList: [],
        add: function(command) {
            this.commandsList.push(command);
        },
        execute: function(){
            for (var i = 0, command; command = this.commandsList[i++];){
                command.execute();
            }
        }
    }
};

var openTvCommand = {
    execute: function(){
        console.log('打开电视');
    },
    add: function(){
        throw new Error('叶对象不能添加子节点');
    }
};

var macroCommand = MacroCommand();

macroCommand.add(openTvCommand);
openTvCommand.add(macroCommand);  //Uncaught Error: 叶对象不能添加子节点


//组合模式的例子——扫描文件夹
//Folder
var Folder = function(name) {
    this.name = name;
    this.files = [];
};

Folder.prototype.add = function(file) {
    this.files.push(file);
};

Folder.prototype.scan = function(){
    console.log('开始扫描文件夹：' + this.name);
    for (var i = 0, file, files = this.files; file = files[i++];){
        file.scan();
    }
};

//File
var File = function(name) {
    this.name = name;
};

File.prototype.add = function(){
    throw new Error('不能添加文件');
};

File.prototype.scan = function(){
    console.log('开始扫描文件：' + this.name);
};
var folder = new Folder( ' 学习资料' );
var folder1 = new Folder( 'JavaScript' );
var folder2 = new Folder ( 'jQuery' );
var file1 = new File( 'JavaScript 设计模式与开发实践' );
var file2 = new File( ' 精通 jQuery' );
var file3 = new File( ' 重构与模式' );

//新增
var folder3 = new Folder('Nodejs');
var file4 = new File('new type.js');
folder3.add(file4);

folder1.add( file1 );
folder2.add( file2 );
folder.add( folder1 ); //实现文件夹的包含
folder.add( folder2 );
folder.add( file3 );

folder.scan();

//引用父对象
//改写 Folder 类和 File 类，在这两个类的构造函数中，增加 this.parent 属性，
//并且在调用 add 方法的时候，正确设置文件或者文件夹的父节点
var Folder = function(name) {
    this.name = name;
    this.parent = null;  //增加this.parent属性
    this.files = [];
};

Folder.prototype.add = function(file) {
    file.parent = this;  //设置父对象
    this.files.push(file);
};

Folder.prototype.scan = function(){
    console.log('开始扫描文件夹：' + this.name);
    for (var i = 0, file, files = this.files; file = files[i++];){
        file.scan();
    }
};

Folder.prototype.remove = function(){
    if (!this.parent) { //根节点或者树外的游离节点
        return ;
    }
    for (var files = this.parent.files, l = files.length - 1; l >= 0; l--){
        var file = files[l];
        if (file === this) {
            files.splice(l, 1);
        }
    }
};

var File = function(name) {
    this.name = name;
    this.parent = null;
};

File.prototype.add = function(){
    throw new Error( ' 不能添加在文件下面' );
};
File.prototype.scan = function(){
    console.log( ' 开始扫描文件: ' + this.name );
};

File.prototype.remove = function(){
    if (!this.parent) { //根节点或者树外的游离节点
        return;
    }
    for (var files = this.parent.files, l = files.length - 1; l >=0; l--) {
        var file = files[l];
        if (file === this) {
            files.splice(l, 1);
        }
    }
};

//测试
var folder = new Folder( ' 学习资料' );
var folder1 = new Folder( 'JavaScript' );
var file1 = new Folder ( ' 深入浅出 Node.js' );
folder1.add( new File( 'JavaScript 设计模式与开发实践' ) );
folder.add( folder1 );
folder.add( file1 );

folder1.remove(); //移除文件夹
folder.scan();

//组合模式：1，对象的部分-整体层次结构。在组合模式镇中增删树节点方便且符合开放-封闭原则；2，统一对待树中的所有对象

//设计模式的主题是：把不变得事物和变化额事物分离开来。

//命令模式：执行某些特定事情的指令。不知道请求者是谁，不知道做何操作。
//命令模式的由来，是回调（callback）函数的一个面向对象的替代品。
//引入了command对象和receiver两个角色
var setCommand = function(button, command) {
    button.onclick = function(){
        command.execute();
    }
}
//对象依存的对象
var MenuBar = {
    refresh: function(){
        console.log('fresh');
    }
};

var SubMenu = {
    add: function(){
        console.log('add');
    },
    del: function(){
        console.log('del');
    }
};
//行为封装在命令类
var RefreshMenuBarCommand = function(receiver) {
    this.receiver = receiver;
};

RefreshMenuBarCommand.prototype.execute = function(){
    this.receiver.refresh();
};
var AddSubMenuCommand = function(receiver) {
    this.receiver = receiver;
};

AddSubMenuCommand.prototype.execute = function(){
    this.receiver.refresh();
};
var DelSubMenuCommand = function(receiver) {
    this.receiver = receiver;
};

DelSubMenuCommand.prototype.execute = function(){
    this.receiver.refresh();
};

//1，命令接收者传人到command；2，把command对象安装到button上
var RefreshMenuBarCommand = new RefreshMenuBarCommand(MenuBar);
var AddSubMenuCommand = new AddSubMenuCommand(SubMenu);
var delSubMenuCommand = new delSubMenuCommand(SubMenu);

setCommand(button1, RefreshMenuBarCommand);
setCommand(button2, AddSubMenuCommand);
setCommand(button3, delSubMenuCommand);

//javascript中的命令模式
var bindClick = function(button, func) {
    button.onclick = func;
};
var MenuBar = {
    refresh: function(){
        console.log('fresh');
    }
};

var SubMenu = {
    add: function(){
        console.log('add');
    },
    del: function(){
        console.log('del');
    }
};
bindClick(button1, MenuBar.refresh);
bindClick(button2, SubBar.add);
bindClick(button3, SubBar.del);

//闭包实现的命令模式
var setCommand = function(button, func) {
    button.onclick = function(){
        func();
    }
};

var MenuBar = {
    refresh: function(){
        console.log('fresh');
    }
};

var RefreshMenuBarCommand = function(receiver){
    return function(){
        receiver.refresh();
    }
};

var refreshMenuBarCommand = RefreshMenuBarCommand(MenuBar);

setCommand(button1, refreshMenuBarCommand);

//增加撤销模式
var RefreshMenuBarCommand = function(receiver){
    return function(){
        receiver.refresh();
    }
};

var setCommand = function(button, command){
    button.onclick = function(){
        command.execute();
    }
};

var refreshMenuBarCommand = RefreshMenuBarCommand(MenuBar);
setCommand(button1, refreshMenuBarCommand);

//撤销是命令模式中常用的功能
//小游戏代码
var Ryu = {
    attack: function(){
        console.log('attack');
    },
    defense: function(){
        console.log('defense');
    },
    jump: function(){
        console.log('jump');
    },
    crouch: function(){
        console.log('crouch');
    }
};

var makeCommand = function(receiver, state) {
    return function(){
        receiver[state]();
    }
};

var commands = {
    "119": "jump",
    "115": "crouch",
    "97": "defense",
    "100": "attack"
};

var commandStack = []; //保存命令的堆栈

document.onkeypress = function(ev){
    var keyCode = ev.keyCode,
        command = makeCommand(Ryu, commands[keyCode]);
    
    if(command) {
        command();//执行命令
        commandStack.push(command);  //保存进堆栈
    }
};

document.getElementById('replay').onclick = function(){
    var command;
    while(command = commandStack.shift()) { // 从堆栈里依次取出命令并执行
        command();
    }
};

//宏命令
//先创建字命令
var closeDoorCommand = {
    execute: function(){
        console.log('colse');
    }
};
var openPcCommand = {
    execute: function(){
        console.log('open');
    }
};
var openQQCommand = {
    execute: function(){
        console.log('openQQ');
    }
};
//创建宏命令
var MacroCommand = function(){
    return {
        commandsList: [],
        add: function(command){
            this.commandsList.push(command);
        },
        execute: function(){
            for(var i = 0, command; command = this.commandsList[i++];){
                command.execute();
            }
        }
    }
};

var macroCommand = MacroCommand();
macroCommand.add(closeDoorCommand);
macroCommand.add(openPcCommand);
macroCommand.add(openQQCommand);

macroCommand.execute();

//总结:宏命令是命令模式与组合模式的联用产物
//JS可以用高阶函数实现命令模式，命令模式在JS中是一种隐形的模式。

//发布-订阅模式

//迭代器模式
var each = function(any, callback){
    for(var i = 0, l = ary.length; i < l; i++){
        callback.call(ary[i], i, ary[i]);
    }
};

each([1, 2, 3], function(i,n){
    alert([i, n]);
})
//判断2个数组里元素的值是否完全相等（内部迭代器，迭代规则已经在内部定义，完全接手整个迭代过程，外部只需一次初始调用）
//利用内部迭代器实现
var compare = function(ary1, ary2){
    if (ary1.length !== ary2.length){
        throw new Error('not equal');
    }
    each(ary1, function(i, n){
        if (n !== ary2[i]) {
            throw new Error('not equal');
        }
    });
    alert('alert1 == alert2');
};
compare([1,2,3], [1,2,4]);

//外部迭代器
var Iterator = function(obj){
    var current = 0;
    
    var next = function(){
        current += 1;
    };

    var isDone = function(){
        return current >= obj.length;
    };

    var getCurrItem = function(){
        return obj[current];
    };

    return {
        next: next,
        isDone: isDone,
        getCurrItem: getCurrItem
    }
};

//改写后的compare函数
var compare = function(iterator1, iterator1){
    while(!iterator1.isDone() && !iterator2.isDone()){
        if (iterator1.getCurrItem() !== iterator2.getCurrItem()){
            throw new Error('not equal');
        }
        iterator1.next();
        iterator2.next();
    }
    alert('not equal');
}

var iterator1 = Iterator([1, 2, 3]);
var iterator2 = Iterator([1, 2, 3]);

compare(iterator1, iterator2);

//外部迭代器调用方式相对复杂，但适用面更广，能满足更多变的需求。
//实际生产中没有优劣之分，视具体的需求场景而定。

//迭代类数组对象和字面量对象
$.each = function(obj, callback){
    var value, i = 0, length = obj.length, isArray = isArraylike(obj);

    if(isArray){ //迭代类数组
        for(; i < length; i++){
            value = callback.call(obj[i], i, obj[i]);

            if(value === false){
                break;
            }
        }
    } else {
        for( i in obj) {
            value = callback.call(obj[i], i, obj[i]);
            if(value === false) {
                break;
            }
        }
    }
    return obj;
};

//代理模式
//抽象为一个对象提供一个代用品或占位符，以便控制对它的访问
//最简单的抽象模式
var Flower = function(){};

var xiaoming = {
    sendFlower: function(target){
        var flower = new Flower();
        target.reciveFlower(flower);
    }
};

var B = {
    reciveFlower: function(flower){
        A.reciveFlower(flower);
    }
};

var A = {
    receiverFlower: function(flower){
        console.log('receive: ' + flower);
    }
};

xiaoming.sendFlower(B);

//代理模式前
var xiaoming = {
    sendFlower: function(target){
        var flower = new Flower();
        target.reciveFlower(flower);
    }
};

// var B = {
//     reciveFlower: function(flower){
//         A.reciveFlower(flower);
//     }
// };

var A = {
    receiverFlower: function(flower){
        console.log('receive: ' + flower);
    }
};

xiaoming.sendFlower(A);


//保护代理和虚拟代理
//虚拟代理：把开销比较大的对象，延迟到真正需要它的时候才去创建
var B = {
    receiveFlower: function(flower){
        A.listenGoodMood(function(){ //监听A的好心情
            var flower = new Flower(); //延迟创建flower对象
            A.receiverFlower(flower);
        });
    }
};
//保护代理用于权限控制，不同对象对不同目标对象的访问。

//虚拟代理实现图片预加载
//no virtual proxy, 加载有空白
var myImage = (function(){
    var imgNode = document.createElement('img');
    document.body.appendChild(imgNode);

    return {
        setSrc: function (src) {
            imgNode.src = src;
        }
    }
})();

myImage.setSrc(url);
//引入代理
//proxyImage控制了客户对MyImage的访问，并且在此过程中加入一些额外的操作，比如在真正的图片加载好之前，
//先把img节点的src设置为一张本地的loading图片。
var proxyImage = (function(){
    var img = new Image;
    img.onload = function(){
        myImage.setSrc(this.src);
    }
    return {
        setSrc: function(src) {
            myImage.setSrc(picloading.gif); //先 loading.gif 
            img.src = src;
        }
    }
})();

proxyImage.setSrc(picurl); //真正的图片

//单一职责：一个类仅有一个引起它变化的原因。
//破坏单一职责原则示例
var MyImage = (function(){
    var imgNode = document.createElement('img');
    document.body.appendChild(imgNode);
    var img = new Image;

    img.load = function(){
        imgNode.src = img.src;
    };

    return {
        setSrc: function (src) {
            imgNode.src = picloading; //硬编码，耦合度高
            img.src = src;
        }
    }
})();

MyImage.setSrc(src);

//代理和本地接口的一致性
//代理对象和本体都对外提供了setSrc方法，在客户看来，代理对象和本体是一致的。
//代理接手请求的过程对于用户来说是透明的，用户并不清楚代理和本体的区别。这样：
//1,用户可以放心地请求代理，他只关心是否能得到想要的结果。
//2,在任何使用本体的地方都可以替换成使用代理。

//在java等语言中，代理和本体都需要显式的实现同一个接口，一方面接口保证了它们会拥有同样的方法，
//另一方面，面向接口编程迎合依赖倒置原则，通过接口进行向上转型，从而避开编译器的类型检查，代理和本体将来可以被替换使用。

//虚拟代理合并HTTP请求
var synchronousFile = function(id){
    console.log('id: ' + id);
};

var proxySynchronousFile = (function(){
    var cache = [],  //保存一段时间内需要同步的ID
        timer;       //定时器
    
    return function(id) {
        cache.push(id);
        if(timer) { //保证不会覆盖已经启动的定时器
            return;
        }

        timer = setTimeout(function(){
            synchronousFile(cache.join(',')); //2秒后向本体发送需要同步的ID集合
            clearTimeout(timer);    
            timer = null;
            cache.length = 0; //清空ID集合
        }, 2000);
    }
})();

var checkbox = document.getElementsByTagName('input');
for(var i = 0, c; c = checkbox[i++];){
    c.onclick = function(){
        if(this.checked === true) {
            proxySynchronousFile(this.id);
        }
    }
}
//虚拟代理在惰性加载中的应用
//未加载真正的miniConsole.js之前的代码
var cache = [];
var miniConsole = {
    log: function(){
        var args = arguments;
        cache.push(function(){
            return miniConsole.log.apply(miniConsole, args);
        });
    }
};
miniConsole.log(1);

//用户按下F2,开始真正加载miniConsole.js
var handler = function(ev) {
    if(ev.keyCode === 113){
        var script = document.createElement('script');
        script.onload = function(){
            for (var i = 0, fn; fn = cache[i++]; ) {
                fn();
            }
        };
        script.src = 'miniConsole.js';
        document.getElementsByTagName('head')[0].appendChild(script);
    }
};

document.body.addEventListener('keydown', handler, false);

//miniConsole.js代码
miniConsole = {
    log: function(){
        //真正代码pass
        console.log(Array.prototype.join.call(arguments));
    }
}

//整理后的miniConsole代理对象代码
var miniConsole = (function(){
    var cache = [];
    var handler = function(ev) {
        if(ev.keyCode === 113){
            var script = document.createElement('script');
            script.onload = function(){
                for (var i = 0, fn; fn = cache[i++]; ) {
                    fn();
                }
            };
            script.src = 'miniConsole.js';
            document.getElementsByTagName('head')[0].appendChild(script);
            document.body.removeEventListener('keydown', handler); //只加载一次miniConsole.js
        }
    };

    document.body.addEventListener('keydown', handler, false);

    return {
        log: function(){
            var args = arguments;
            cache.push(function(){
                return miniConsole.log.apply(miniConsole, args);
            });
        }
    }
})();

miniConsole.log(11);

miniConsole = {
    log: function(){
        //pass 真正代码
        console.log(Array.prototype.join.call(arguments));
    }
}

//缓存代理：为开销大的运算结果提供暂时的存储
//大数乘积
var mult = function(){
    console.log('开始计算乘积');
    var a = 1;
    for(var i = 0, l = arguments.length; i < l; i++){
        a = a*arguments[i];
    }
    return a;
}

//加入缓存代理函数
var proxyMult = (function(){
    var cache = {};
    return function(){
        var args = Array.prototype.join.call(arguments, '');
        if(args in cache){
            return cache[args];
        }
        return cache[args] = mult.apply(this, arguments);
    }
})();

//高阶函数动态创建代理
var mult = function(){
    var a = 1;
    for(var i = 0, l = arguments.length; i < l; i++){
        a = a*arguments[i];
    }
    return a;
};

var plus = function(){
    var a = 1;
    for(var i = 0, l = arguments.length; i < l; i++){
        a = a + arguments[i];
    }
    return a;
};

//创建缓存代理工厂
var createProxyFactory = function(fn){
    var cahce = {};
    return function(){
        var arguments = Array.prototype.join.call(arguments, ',');
        if (args in cache) {
            return cache[args];
        }
        return cache[args] = fn.apply(this, arguments);
    }
};

var proxyMult = createProxyFactory(mult),
proxyPlus = createProxyFactory(plus);

alert(proxyMult(1,2,3,4));
alert(proxyMult(1,2,3,4));
alert(proxyPlus(1,2,3,4));
alert(proxyPlus(1,2,3,4));

//策略模式
//场景：要实现某一个功能有多种方案可以选择，比如一个压缩文件的程序，既可以选择zip算法，也可以选择gzip算法。
//策略模式的定义：定义一系列的算法，把它们一个个封装起来，并且使它们可以互相替换。
//将算法的使用与算法的实现分离开来
//策略模式的程序由两部分组成：
//1，一组策略类，封装了具体的算法，并负责具体的计算过程。
//2，环境类Context,Context接受客户的请求，随后把请求委托给某一个策略类。Context中要维持对某个策略对象的引用。

//传统面向对象类型-- 策略类
var performanceS = function(){};

performanceS.prototype.calculate = function(salary){
    return salary * 4;
};

var performanceA = function(){};

performanceA.prototype.calculate = function(salary){
    return salary * 3;
};

var performanceB = function(){};

performanceB.prototype.calculate = function(salary){
    return salary * 2;
}
//定义Context环境
var Bonus = function(){
    this.salary = null;     //原始工资
    this.strategy = null;   //绩效等级对应的策略对象
};

Bonus.prototype.setSalary = function(salary) {
    this.salary = salary;  //原始工资
};

Bonus.prototype.setStrategy = function(strategy) {
    this.strategy = strategy;  //设置员工绩效等级对应的策略模式
};

Bonus.prototype.getBonus = function(){
    return this.strategy.calculate(this.salary); //把计算奖金的操作委托给对应的策略对象
}

//调用
var bonus = new Bonus();

bonus.setSalary(10000);
bonus.setStrategy(new performanceS()); //设置策略对象

console.log(bonus.getBonus());  //输出

bonus.setStrategy(new performanceA());
console.log(bonus.getBonus());  //输出

//JS版本的策略模式
//策略
var strategies = {
    "S": function(salary) {
        return salary * 4;
    },
    "A": function(salary) {
        return salary * 3;
    },
    "B": function(salary) {
        return salary * 2;
    }
};
//Context
var calculateBonus = function(level, salary) {
    return strategies[level](salary);
};
console.log(calculateBonus('S', 20000));
console.log(calculateBonus('A', 10000));

//实现动画效果的原理
//让小球动起来(算法来自flash)
var tween = {
    linear: function(t, b, c, d) {
        return c*t/d + b;
    },
    easeIn: function(t, b, c, d) {
        return c * (t /= d) * t + b;
    },
    strongEaseIn: function(t, b, c, d){
        return c * (t/=d) * t * t * t *t + b;
    },
    strongEaseOut: function(t, b, c, d){
        return c * ((t = t/d - 1) * t * t * t *t + 1) + b;
    },
    sineaseIn: function(t, b, c, d){
        return c * (t /= d) * t * t + b;
    },
    sineaseOut: function(t,b,c,d){
        return c*((t = t/d - 1) * t * t + 1) + b;
    }
};

//构建Context
var Animate = function(dom){
    this.dom = dom;             //初始节点
    this.startTime = 0;         //初始时间
    this.startPos = 0;
    this.endPos = 0;
    this.propertyName = null;   //节点需要被改变的css属性名
    this.easing = null;         //缓存算法
    this.duration = null;       //动画持续时间
}
//启动动画
Animate.prototype.start = function(propertyName, endPos, duration, easing) {
    this.startTime = + new Date;    //启动时间
    this.startPos = this.dom.getBoundingClientRect()[propertyName]; //节点初始位置
    this.propertyName = propertyName; 
    this.endPos = endPos;
    this.duration = duration;    //持续时间
    this.easing = tween[easing]; //缓存算法

    var self = this;            //作用域切换
    var timeId = setInterval(function(){    //启动定时器，开始执行动画
        if(self.step() === false) {         //如果动画已结束，则清除定时器
            clearInterval(timeId);
        }
    }, 19);
}

Animate.prototype.step = function(){
    var t = +new Date;
    if(t >= this.startTime + this.duration) {   //动画已经结束，主动修正小球的位置
        this.update(this.endPos);   //更新小球的CSS属性值
        return false;
    }
    var pos = this.easing(t - this.startTime, this.startPos,
                this.endPos - this.startPos, this.duration);// pos 为小球当前的位置

    this.update(pos);              //更新小球的CSS属性值
};

Animate.prototype.update = function(pos){
    this.dom.style[this.propertyName] = pos + 'px';
};
//测试代码
var div = document.getElementById('div');
var animate = new Animate(div);
animate.start('left', 500, 1000, 'strongEaseOut');

//策略模式应用于表单校验
//准备策略
var strategies = {
    isNonEmpty: function(value, errorMsg) { //不为空
        if(value === ''){
            return errorMsg;
        }
    },
    minLength: function(value, length, errorMsg) { //长度限制
        if(value.length < length) {
            return errorMsg;
        }
    },
    isMobile: function(value, errorMsg) {       //手机号码格式
        if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
            return errorMsg;
        }
    }
};
//构建Context
//先了解用户向Validator发送请求
var validataFunc = function(){
    var validator = new Validator(); // 创建一个 validator 对象
    /***************添加一些校验规则 ****************/
    validator.add( registerForm.userName, 'isNonEmpty', ' 用户名不能为空' );
    validator.add( registerForm.password, 'minLength:6', ' 密码长度不能少于 6 位' );
    validator.add( registerForm.phoneNumber, 'isMobile', ' 手机号码格式不正确 ' );
    var errorMsg = validator.start(); // 获得校验结果
    return errorMsg; // 返回校验结果
}
var registerForm = document.getElementById( 'registerForm' );
registerForm.onsubmit = function(){
        var errorMsg = validataFunc(); // 如果 errorMsg 有确切的返回值，说明未通过校验
        if ( errorMsg ){
            alert ( errorMsg );
            return false; // 阻止表单提交
        }
};

//---------构建Context-----------
var Validator = function(){
    this.cache = [];    //保存校验规则
};

Validator.prototype.add = function(dom, rule, errorMsg){
    var ary = rule.split(':');
    this.cache.push(function(){    // 把校验的步骤用空函数包装起来，存放到cache
        var strategy = ary.shift();// 用户挑选的 strategy
        ary.unshift(dom.value);        // 把 input 的 value 添加进参数列表
        ary.push(errorMsg);         //把errorMsg压入参数列表
        return strategies[strategy].apply(dom, ary);
    });
};

Validator.prototype.start = function(){
    for (var i = 0, validatorFunc; validatorFunc = this.cache[i++]; ){
        var msg = validatorFunc(); //开始校验，并取得校验后的返回信息
        if(msg) {
            return msg; 
        }
    }
};

//要实现多种校验规则
validator.add( registerForm.userName, [{
    strategy: 'isNonEmpty',
    errorMsg: ' 用户名不能为空'
    }, {
    strategy: 'minLength:6',
    errorMsg: ' 用户名长度不能小于 10 位'
    }]
);
//修改原型方法add
Validator.prototype.add = function(dom, rules){
    var self = this;
    for(var i = 0, rule; rule = rules[i++]; ){
        (function(rule){
            var strategy = rule.strategy.split(':');
            var errorMsg = rule.errorMsg;

            self.cache.push(function(){
                var strategy = strategy.shift();  // 用户挑选的 strategy
                strategy.unshift(dom.value);        // 把 input 的 value 添加进参数列表
                strategy.push(errorMsg);         //把errorMsg压入参数列表
                return strategies[strategy].apply(dom, strategy);
            });
        })(rule);
    }
    // var ary = rule.split(':');
    // this.cache.push(function(){    // 把校验的步骤用空函数包装起来，存放到cache
    //     var strategy = ary.shift();// 用户挑选的 strategy
    //     ary.unshift(dom.value);        // 把 input 的 value 添加进参数列表
    //     ary.push(errorMsg);         //把errorMsg压入参数列表
    //     return strategies[strategy].apply(dom, ary);
    // });
};

/***********************客户调用代码**************************/
var registerForm = document.getElementById( 'registerForm' );
var validataFunc = function(){
    var validator = new Validator();
    validator.add( registerForm.userName, [{
        strategy: 'isNonEmpty',
        errorMsg: ' 用户名不能为空'
    }, {
        strategy: 'minLength:6',
        errorMsg: ' 用户名长度不能小于 10 位'
    }]);
    validator.add( registerForm.password, [{
        strategy: 'minLength:6',
        errorMsg: ' 密码长度不能小于 6 位'
    }]);
    validator.add( registerForm.phoneNumber, [{
        strategy: 'isMobile',
        errorMsg: ' 手机号码格式不正确 '
    }]);
    var errorMsg = validator.start();
    return errorMsg;
}

registerForm.onsubmit = function(){
    var errorMsg = validataFunc();

    if ( errorMsg ){
        alert ( errorMsg );
        return false;
    }
};    

//策略模式总结：
//1, 策略模式利用组合，委托和多态等技术和思想，有效避免多重条件选择语句;
//2，策略模式提供了对开放-封闭原则的完美支持，将算法封装在独立的strategy中，使得它们易于切换，理解，扩展。
//3，策略模式中的算法也可以复用在系统的其他地方，从而避免许多重复的复制粘贴工作
//4，在策略模式中利用组合和委托来让 Context 拥有执行算法的能力，这也是继承的一种更轻便的替代方案。
//缺点：
//1，策略模式会在程序中增加许多策略类或者策略对象。
//2，要使用策略模式，必须了解所有的 strategy，必须了解各个 strategy 之间的不同点，这样才能选择一个合适的 strategy，
//strategy 要向客户暴露它的所有实现，这是违反最少知识原则的.
//JS中策略模式
var S = function( salary ){
    return salary * 4;
};
var A = function( salary ){
    return salary * 3;
};
var B = function( salary ){
    return salary * 2;
};
var calculateBonus = function( func, salary ){
    return func( salary );
};
calculateBonus( S, 10000 ); // 输出： 40000

//单列模式：保证一个类仅有一个实例，并提供一个访问它的全局访问点。
//应用场景：线程池，全局缓存，window对象
//单列模式实现：用一个变量来标志当前是否已经为某个类创建过对象，如果有，则在
//下一次获取该类的实例时，直接返回之前创建的对象。
var Singleton = function(name) {
    this.name = name;
    this.instance = null;
}

Singleton.prototype.genName = function(){
    alert(this.name);
};

Singleton.getInstance = function(name){
    if(!this.instance){
        this.instance = new Singleton(name);
    }
    return this.instance;
};
//必须使用Singleton.getInstance的类方法的方式获取对象实例
var a = Singleton.getInstance('test1');
var b = Singleton.getInstance('test2');

alert(a === b);

//含闭包的透明的单例模式
//在页面中创建唯一的div节点：
//为了把 instance 封装起来，我们使用了自执行的匿名函数和闭包，并且让这个匿名函数返回
//真正的 Singleton 构造方法,增加了一些程序的复杂度
var CreateDiv = (function(){
    var instance;
    //负责了两件事情， 违背了单一职责原则
    var CreateDiv = function(html){ 
        if (instance) { //保证只有一个对象
            return instance;
        }
        this.html = html;
        this.init();  //是创建对象和执行初始化init方法

        return instance = this;
    };
    CreateDiv.prototype.init = function(){
        var div = document.createElement('div');
        div.innerHTML = this.html;
        document.body.appendChild(div);
    };

    return CreateDiv;
})();

var a = new CreateDiv( 'test1' );
var b = new CreateDiv( 'test2' );

//使用代理实现单例模式
//CreateDiv变成了普通类
//ProxySingletonCreateDiv是代理类，两类组合达成单例模式效果
var CreateDiv = function(html){
    this.html = html;
    this.init();
};
CreateDiv.prototype.init = function(){
    var div = document.createElement('div');
    div.innerHTML = this.html;
    document.body.appendChild(div);
};
//代理类
var ProxySingletonCreateDiv = (function(){
    var instance;
    return function(html){
        if(!instance){
            instance = new CreateDiv(html);
        }
        return instance;
    }
})();

var a = new ProxySingletonCreateDiv( 'test1' );
var b = new ProxySingletonCreateDiv( 'test2' );


//单例模式的核心是确保只有一个实例，并提供全局访问 -->全局变量

//使用闭包封装私有变量
var user = (function(){
    var __name = 'test',
        __age = 29;
    
    return {
        getUserInfo: function(){
            return __name + '-' + __age;
        }
    }
})();

//惰性单例:在需要的时候才创建对象实例
//基于类的
Singleton.getInstance = (function(){
    var instance = null;
    return function(name){
        if(!instance){
            instance = new Singleton(name);
        }
        return instance;
    }
})();
//上例违反单一职责原则，创建对象和管理单例的逻辑都放在 createLoginLayer对象内部
//
//管理单例的逻辑从原来的代码中抽离出来,些逻辑被封装在 getSingle函数内部，创建对象的方法 fn 被当成参数动态传入 getSingle 函数
var getSingle = function(fn){
    var result;
    return function(){
        return result || (result = fn.apply(this, arguments));
    }
};
//fn.apply(this, arguments) fn的调用绑定在this上下文中
//调用
var createLoginLayer = function(){
    var div = document.createElement( 'div' );
    div.innerHTML = ' 我是登录浮窗';
    div.style.display = 'none';
    document.body.appendChild( div );
    return div;
};
var createSingleLoginLayer = getSingle( createLoginLayer );
document.getElementById( 'loginBtn' ).onclick = function(){
    var loginLayer = createSingleLoginLayer();
    loginLayer.style.display = 'block';
};


//Martin Fowler 在《重构：改善既有代码的设计》里写到
//多态的最根本好处在于，你不必再向对象询问“你是什么类型”而后根据得到的答
//案调用对象的某个行为——你只管调用该行为就是了，其他的一切多态机制都会为你安排妥当。
//也就是：多态最根本的作用就是通过把过程化的条件分支语句转化为对象的多态性，从而消除这些条件分支语句。
//将行为分布在各个对象中，并让这些对象各自负责自己的行为，这正是面向对象设计的优点


//ECMAScript 5 提供了 Object.create方法，可以用来克隆对象.
var Plane = function(){
    this.blood = 100;
    this.attackLevel = 1;
    this.defenseLevel = 1;
};
var plane = new Plane();
plane.blood = 500;
plane.attackLevel = 10;
plane.defenseLevel = 7;

var clonePlane = Object.create(plane);
console.log(clonePlane);

Object.create = Object.create || function(obj) {
    var F = function(){};
    F.prototype = obj;

    return new F();
}