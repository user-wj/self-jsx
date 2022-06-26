/* 
    createElement()功能: => 根据传递的参数对象返回一个整合过的新的 虚拟dom对象
    参数:
        type: String
        props:{
            className:"" String,
            id:"" String,
            style:"" String,
            key:"" String,
            ref:"" String,
        } Object
        ...children: [ ... ] <剩余参数>

    返回值：virtualDomObj
        {
            type:"" String ,
            ref:"" String ,
            key:"" String ,
            props:{
                className:"" String ,
                id:"" String,
                style:"" String,
                children:[] Array 
            } Object ,
        }
*/

function createElement(type, props, ...children) {
    // => 值得注意是 children 创建的节点要不是 元素节点 就是 文本节点 所以在 children 数组里面的类型 要不是文本节点<String>类型就是<{ 虚拟dom对象数据类型用来创建真实dom对象用的 }>

    // => 简而言之 这个方法就是通过对才参数的处理返回一个 新的虚拟dom对象用来创建 真实dom的
    // 注意 es6  {type} => {type:type}
    /* 
    当前组件使用的属性
    参数：
    props:{
        className:"" String ,
        id:"" String ,
        style:"" String ,
        key:"" String ,
        ref:"" String ,
        ...
    } 
    返回值中的参数：
    props:{
        className:"" String ,
        id:"" String ,
        style:"" String ,
        ...
        这个两个属性被放在了外面 里面进行置空
        ref:undefined ,
        key:undefined ,
        children:chidlren Array;
    }
    */
    // 组件可能是单纯的没有属性
    props = props || {};

    var ref = props["ref"] || "";
    var key = props["key"] || "";
    // 这样的方式存在给 key 设置值为 undefined 不存在设置为 null但是这样的方式都是给对象里面增加key属性
    // props["ref"] = props["ref"] ? undefined : null;
    // props["key"] = props["key"] ? undefined : null;
    props["key"] ? (delete props["key"]) : null;
    props["ref"] ? (delete props["ref"]) : null;

    props["children"] = children; // [ ] [ "str" ]  [ {}virtualDomObj  , {}virtualDomObj ]

    var virtualDomObj = {
        // type 可能没有表示 jsx 里面就是一些 "xxx" 默认不允许 可以没有子元素但是不能没有 元素
        type: type || "div",
        ref: ref,
        key: key,
        props: props,
    }
    return virtualDomObj;
};

module.exports = createElement;