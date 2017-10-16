var Controller = {};

(Controller.users = function($$){
    var nameClick = function() {
        /* */
    };
    $(function(){
        $("#view .name").click(nameClick);
    });
})(jQuery);

var Person = function(name) {
    this.name = name;
};

var alice = new Person('alice');

var Class = function() {
    var klass = function() {
        this.init.apply(this, arguments);
    };
    klass.prototype.init = function(){};
    return klass;
}
var Person = new Class;
Person.prototype.init = function(){
//
};

var Person = new Person;
//类方法
Person.bind = function(id){ /* */ }
var person = Person.find(1);

//实例函数
Person.prototype.breath = function () {/**/};
var person = new Person;
person.breath();


// prototype alias fn
Person.fn = Person.prototype;
Person.fn.run = function() { /*  */ }


var Person = new Class;
//静态方法
Person.find = function(id) {/* */}
//调用静态方法
var person = Person.find(1);

//在原型中定义函数
Person.prototype.save = function() {/* */}
//调用函数
var person = new Person;
person.save();

// extend() , include()
var Class = function() {
    var klass = function() {
        this.init.apply(this, arguments);
    };
    klass.prototype.init = function(){};

    // 定义prototype的别名
    klass.fn = klass.prototype;
    // 定义类的别名
    klass.fn.parent = klass;

    //给类添加属性
    klass.extend = function (obj) {
        var extended = obj.extended;
        for (var i in obj) {
            klass[i] = obj[i];
        }
        if (extended) extended(klass);
    };

    // 给实例添加属性
    klass.include = function (obj) {
        var included = obj.included;
        for (var in obj) {
            klass.fn[i] = obj[i];
        }
        if (included) included(klass);
    };
    return klass;
}
//生成一个类
var Person = new Class;

Person.extend({
    find: function(id) {/*  */},
    exists: function(id) {/* */}
});

var person = Person.find(l);
//类实例的属性
var Person = new Class;
Person.include({
    save: function(id) {/* */},
    destroy: function(id) {/* */}
});

var person = new Person;
person.save();

//支持回调
Person.extend({
    extended: function(klass) {
        console.log(klass, " was extended!");
    }
});

//原型 将父类的新实例赋值给构造函数的原型(父类的一个实例指向子类的原型，构成继承)
var Animal = function(){};

Animal.prototype.breath = function() {
    console.log('breath');
};

var Dog = function(){};
//Dog 继承了Animal
Dog.prototype = new Animal;

Dog.prototype.wag = function() {
    console.log('wag tail');
}

var dog = new Dog;
dog.wag();
dog.breath();

//给“类” 库添加继承
var Class = function(parent) {
    var klass = function() {
        this.init.apply(this, arguments);
    };

    // 改变klass的原型
    if (parent) {
        var subclass = function () {};
        subclass.prototype = parent.prototype;
        klass.prototype = new subclass;
    };
    klass.prototype.init = function(){};
    // 定义别名
    klass.fn = klass.prototype;

    klass.fn.parent = klass;
    klass._super = klass.__proto__;

    // include / extend
    return klass;
}

//如果将 parent 传入 Class 构造函数， 那么所有的子类则必然共享同一个原型。 这种创建
//临时匿名函数的小技巧避免了在继承类的时候创建实例， 这里暗示了只有实例的属性才
//会被继承， 而非类的属性

//通过给 Class 传入父类来实现简单的继承
var Animal = new Class;
Animal.include({
    breath: function() {
        console.log('breath');
    }
});

var Cat = new Class(Animal);

var tommy = new Cat;
tommy.breath();

//Jquery 上下文
$('.clicky').click(function(){
    //'this'指向当前节点
    $(this).hide();
});
$('p').each(function(){
    //'this' 指向本次迭代
    $(this).remove();
});

//为了访问原始上下文， 可以将 this 的值存入一个局部变量中， 这是一种常见的模式
var clicky = {
    wasClicked: function(){
        /* */
    },
    addListeners: function() {
        var self = this;
        $('.clicky').click(function(){
            self.wasClicked();
        });
    }
};

clicky.addListeners();

//通过将回调包装在另外一个匿名函数中， 来保持原始的上下文
var proxy = function(func, thisObject) {
    return(function(){
        return func.apply(thisObject, arguments);
    });
}

var clicky = {
    wasClicked: function(){
        /* */
    },
    addListeners: function() {
        var self = this;
        $('.clicky').click(proxy(this.wasClicked, this));
    }
};

$('.clicky').click($.proxy(function(){/* */}, this));

// apply() 和 call() 还有其他很有用的原因， 比如“委托”。 我们可以将一个调用委
//托给另一个调用， 甚至可以修改传入的参数
var App = {
    log: function(){
        if (typeof console == "undefined") return;
        // 参数转换为数组
        var args = jQuery.makeArray(arguments);
        args.unshift("(App)");
        //委托给console
        console.log.apply(console, args);
    }
}

var Class = function(parent) {
    var klass = function() {
        this.init.apply(this, arguments);
    };
    klass.prototype.init = function(){};
    // 定义别名
    klass.fn = klass.prototype;

    // 添加一个proxy函数
    klass.proxy = function(func) {
        var self = this;
        return (function(){
            return func.apply(self, arguments);
        });
    }

    //在实例中也添加这个函数
    klass.fn.proxy = klass.proxy;
    // include / extend
    return klass;
}

//使用 proxy() 函数来包装函数， 以确保它们在正确的作用域中被调用
var Button = new Class;
Button.include({
    init: function(element) {
        this.element = jQuery(element);

        // 代理这个click函数
        this.element.click(this.proxy(this.click));
    },

    click: function() {/* */}
});

//ES5 bind()
Button.include({
    init: function(element) {
        this.element = jQuery(element);

        //绑定这个clickhans
        this.element.click(this.click.bind(this));
    },
    click: function() {/* */}
});

//一段实现了 bind() 函数的代码
if (!Function.prototype.bind) {
    Function.prototype.bind = function (obj) {
        var slice = [].slice,
            args = slice.call(arguments, 1),
            self = this,
            nop = function () {},
            bound = function () {
                return self.apply( this instanceof nop ? this : (obj || {}),
                                    args.concat(slice.call(arguments)));
            };
        nop.prototype = self.prototype;
        bound.prototype = new nop();
        return bound;
    };
}


//利用 JavaS cript 匿名函数来创建私有作用域， 这些私有作用域只能在内部访问
var Person = function () {};

(function(){
    var findById = function() { /* */ };

    Person.find = function(id) {
        if (typeof id == "integer") {
            return findById(id);
        }
    }
})();

//定义变量的时候不要丢掉 var 运算符， 因为如果丢掉 var 就会创建全局变量
(function(exports){
    var foo = "bar";

    //将变量暴露出去
    exports.foo = foo;
})(window);

assertEqual(foo, "bar");

//HJS 允许你通过给$.Class.create 传入一组属性来定义类
var Person = $.Class.create({
    // 构造函数
    initalize: function(name) {
        this.name = name;
    }
});

//创建类的时候传入父类作为参数， 这样就实现了类的继承
var Student = $.Class.create(Person, {
    price: function() {/* */}
});

var alex = new Student("Alex");
alex.pay();

//直接给类挂载属性
Person.find = function(id) {/* */};

//HJS 的 API 中同样包含一些工具函数， 比如 clone() 和 equal() 
var alex = new Student("Alex");
var bill = alex.clone();

assert(alex.equal(bill));

//事件
var button = document.getElementById("createButton");

button.addEventListener("click", function(){/* */}, false);

var div = document.getElementById("div");
var listener = function(event) {/*  */};

div.addEventListener("click", listener, false);
div.removeEventListener("click", listener, false);

button.addEventListener("click", function(e) {
    e.stopPropagation();
    /*  */
}, false);

//preventDefault or 
bform.addEventListener("submit", function(e){
    /*   */
    return confirm("Are you super sure?");
}, false);

jQuery("#element").bind(eventName, handler);
//给一个元素注册点击事件
jQuery("element").bind("click", function(event){
    // ...
});

//DOMContentLoaded
//并不是所有的浏览器都支持 DOMContentLoaded， 因此 jQuery 将它融入了 ready() 函数，
//这个函数是兼容各个浏览器的
jQuery.ready(function($){
    $("#myForm").bind("submit", function(){/*  */});
});

//调用事件回 调函数时上下文的切换
new function(){
    this.appName = "wem";

    document.body.addEventListener("click", function(e){
        //上下文发生改变，因此appName是undefined
        alert(this.appName);
    }, false);
}
//要想保持原有的上下文， 需要将回 调函 数包装进一个匿名函 数， 然后定义一个引用指向它
$("signinForm").submit($.proxy(function(){/*  */}, this));

//事件委托
list.addEventListener("click", function(e){
    if (e.currentTarget.tagName == "li") {
        // todo
        return false;
    }
}, false);

//jQuery 的处理方式更妙， 只需给 delegate() 函数传入子元素的选择器、 事件类型和回函数即可
//使用事件委托的另一个好处是， 所有为元素动态添加的子元素都具有事件监听
// 只添加一个事件监听
$("ul").delegate("li", "click", /* ... */);
// 给每个li元素都添加事件监听,禁止这样做
$("ul li").click(function() {/*   */});

// 绑定自定义事件
$(".class").bind("refresh.widget", function(){});
// 触发自定义事件
$(".class").trigger("refresh.widget");

$(".class").bind("frob.widget", function(event, dataNumber){
    console.log(dataNumber);
});

$(".class").trigger("frob.widget", 5);

jQuery.fn.tabs = function(control) {
    var element = $(this);
    control = $(control);
    //给所以li绑定了click
    element.find("li").bind("click", function(){
        // 从列表项中添加或删除active类
        element.find("li").removeClass("active");
        $(this).addClass("active");

        //给tabContent添加或删除active类
        var tabName = $(this).attr("data-tab");
        control.find(">[data-tab]").removeClass("active");
        control.find(">[data-tab='" + tabName + "']").addClass("active");
    });
    // 激活第1个选项卡
    element.find("li:first").addClass("active");

    // 返回this以启动链式调用
    return this;
}

//更简洁的版本
jQuery.fn.tabs = function(control) {
    var element = $(this);
    control = $(control);
    //给所以li绑定了click
    element.delegate("li", "click", function(){
        // 遍历选项卡名称
        var tabName = $(this).attr("data-tab");
        // 在点击选项卡时触发自定义事件
        element.trigger("change.tabs", tabName);
    });
    //绑定到自定义事件
    element.bind("change.tabs", function(e, tabName) {
        element.find("li").removeClass("active");
        element.find(">[data-tab'" + tabName + "']").addClass("active");
    });

    element.bind("change.tabs", function(e, tabName) {
        element.find(">[data-tab]").removeClass("active");
        element.find(">[data-tab'" + tabName + "']").addClass("active");
    });
    // 激活第1个选项卡
    var firstName = element.find("li:first").attr("data-tab");
    element.trigger("change.tabs", firstName);
    // element.find("li:first").addClass("active");

    // 返回this以启动链式调用
    return this;
}

$("#tabs").trigger("change.tabs", "users");

// hash
$("#tabs").bind("change.tabs", function(e, tabName) {
    window.location.hash = tabName;
});

$(window).bind("hashchange", function(){
    var tabName = window.location.hash.slice(1);
    $("#tabs").trigger("change.tabs", tabName);
});

//publish and  subscribe
var PubSub = {
    subscribe: function(ev, callback) {
        // 创建_callbacks对象，除非它已经存在
        var calls = this._callbacks || (this._callbacks = {});
        // 针对给定的事件key创建一个数组，除非这个数组已经存在
        // 然后将回调函数追加到这个数组中
        (this._callbacks[ev] || (this._callbacks[ev] = [])).push(callback);
        return this;
    },

    publish: function() {
        // 将arguments对象转换为真正的数组
        var args = Array.prototype.slice.call(arguments,0);
        //拿出第一个参数，即事件名称
        var ev = args.shift();
        // 如果不存在_callbacks对象，则返回
        // 或者如果不包含给定事件对应的数组
        var list, calls, i, l;
        if (!(calls = this._callbacks)) return this;
        if (!(list = this._callbacks[ev])) return this;

        // 触发回调
        for (i = 0, l = list.length; i < l; i++) {
            list[i].apply(this, args);
        }
        return this;
    }
};
PubSub.publish("wem");
PubSub.subscribe("user:create", function(){/*  */});

// jQuery Tiny Pub/Sub
(function($){
    var o = $({});

    $.subscribe = function() {
        o.bind.apply(o, arguments);
    };
    $.unsubscribe = function() {
        o.unbind.apply(o, arguments);
    };
    $.publish = function() {
        o.trigger.apply(o, arguments);
    };
})(jQuery)

//使用 
$.subscribe("/some/topic", function(event, a, b, c){
    console.log(event.type, a+b+c);
});
$.publish("/some/topic", "a", "b", "c");

//用上面提到的 PubSub 对象来创建一个对象的局部事件
var Asset = {};
// 添加PubSub
jQuery.extend(Asset, PubSub);
// 现在就可以用 publish/subscribe 函数了
Asset.subscribe("create", function(){
    //...
});

//MVC
var user = new User;
user.destroy();

var User = function(atts) {
    this.attributes = atts || {};
};

User.prototype.destroy = function () {
    /* */
};

User.fetchRemote = function (){
    /* */
};

//Object.create() 只有一个参数即原型对象， 它返回一个新对象， 这个新对象的原型就
//是传入的参数。 换句话说， 传入一个对象， 返回一个继承了这个对象的新对象。
//原型继承
if (typeof Object.create !== "function") {
    Object.create = function(o) {
        function F() {};
        F.prototype = o;
        return new F();
    }
}

//创建Model
var Model = {
    inherited: function(){},
    created: function(){
        this.records = {};
    },

    prototype: {
        init: function(){}
    },

    create: function (){
        var object = Object.create(this);
        object.parent = this;

        object.prototype = object.fn = Object.create(this.prototype);

        object.created();
        this.inherited(object);
        return object;
    },
    //init() 函数返回一个新对象， 它继承自 Model.prototype
    init: function() {
        var instance = Object.create(this.prototype);
        instance.parent = this;
        instance.init.apply(instance, arguments);
        return instance;
    }
}

var Asset = Model.create();
var USer = Model.create();

var user = User.init();

//添加ORM属性
//添加对象属性
jQuery.extend(Model, {
    find: function(){}
});
//添加实例属性
jQuery.extend(Model.prototype, {
    init: function(atts) {
        if (atts) {
            this.load(atts);
        }
    },

    load: function(attributes) {
        for (var name in attributes) {
            this[name] = attributes[name];
        }
    }
});

// 持久化记录
// 用来保存资源的对象
Model.records = {};

Model.include({
    newRecord: true,

    create: function() {
        this.newRecord = false;
        if (!this.id) this.id = Math.guid();
        this.parent.records[this.id] = this;
    },
    destroy: function() {
        delete this.parent.records[this.id];
    }
});
// 更新
Model.include({
    update: function() {
        this.parent.records[this.id] = this;
    }
});
// 将对象存入 hash 记录中， 保持一个引用指向它
Model.include({
    save: function(){
        this.newRecord ? this.create() : this.update();
    }
});
// 根据ID查找资源
Model.extend({
    // 通过ID查找，找不到则抛出异常
    find: function(id) {
        return this.records[id] || ("Unknow record");
    }
});

Asset.extend({
    find: function(id){
        var record = this.records[id];
        if (!record) throw("Unknow record");
        return record.dup();
    }
});

Asset.include({
    create: function(){
        this.newRecord = false;
        this.parent.records[this.id] = this.dup();
    },

    update: function (){
        this.parent.records[this.id] = this.dup();
    },
    dup: function() {
        return jQuery.extend(true, {}, this);
    }
});

Model.extend({
    populate: function(values) {
        // 重置model和records
        this.records = {};

        for (var i = 0, il = values.length; i < il; i++){
            var record = this.init(values[i]);
            record.newRecord = false;
            this.records[record.id] = record;
        }
    }
});

Model.extend({
    created: function(){
        this.records = {};
        this.attributes = [];
    }
});
Asset.attributes = ["name", "ext"];

Model.include({
    attributes: function(){
        var result = {};
        for (var i in this.parent.attributes) {
            var attr = this.parent.attributes[i];
            result[attr] = this[attr];
        }
        result.id = this.id;
        return result;
    }
});
Asset.attributes = ["name", "ext"];
var asset = Asset.init({name: "document", ext: ". txt"});
asset.attributes(); //=> {name: "document", ext: ". txt"};

Model.include({
    toJSON: function(){
        return (this.attributes());
    }
});

var Model.LocalStorage = {
    saveLocal: function(name) {
        // 将记录转换为数组
        var result = [];
        for(var i in this.records) {
            result.push(this.records[i]);
        }
        localStorage[name] = JSON.stringify(result);
    },
    loadLocal: function(name) {
        var result = JSON.parse(localStorage[name]);
        this.populate(result);
    }
};

Asset.extend(Model.LocalStorage);

Model.include({
    createRemote: function(url, callback) {
        $.post(url, this.attributes(), callback);
    },
    updateRemote: function(url, callback) {
        $.ajax({
            url: url,
            data: this.attributes(),
            success: callback,
            type: "PUT"
        });
    }
});

//使用
Asset.init({name: "jason.txt"}).createRemote("/assets");

//模块模式
//在匿名函数里的逻辑都在闭包里运行， 为应用中的变量提供了局部作用和私有的运行环境
(function(){
    /* */
})();

//模块为我们提供了一种简单的方法来解决这些问题。 将全局对象作为参数传
//入匿名函数， 可以将它们导入我们的代码中， 这种实现方法比隐式的全局对象更加简洁而且速度更快 
(function($){
    /* */
})(jQuery);

//全局导出
(function($, exports){
    /* */
})(jQuery, window);

//实际情况， 模块中的上下文都是全局的， this 就是 window
(function(){
    assertEqual(this, window);
})();

//自定义作用域的上下文
(function(){
    var mod = {};
    //contextFunction() 中的上下文不是全局的
    mod.contextFunction = function(){
        assertEqual(this, mod);
    };

    mod.contextFunction();
})();

(function($){
    var mod = {};

    mod.load = function(func){
        $($.proxy(func, this));
    };

    mod.load(function(){
        this.view = $("#view");
    });

    mod.assertsClick = function(e) {
        // 处理点击
    };

    mod,load(function(){
        this.view.find(".assets").click(
            $.proxy(this.assetsClick, this)
        );
    });
})(jQuery);

//抽象出库
(function($, exports){
    var mod = function(includes) {
        if (includes) this.include(includes);
    };
    mod.fn = mod.prototype;

    mod.fn.proxy = function(func) {
        return $.proxy(func, this);
    }

    mod.fn.load = function(func) {
        $(this.proxy(func));
    };

    mod.fn.include = function(ob) {
        $.extend(this, ob);
    };

    exports.Controller = mod;
})(jQuery, window);
