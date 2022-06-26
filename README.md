# jsx 渲染过程

[babel-preset-react]

```text
    babel-perser-react 网站: https://babelio.com
    jsx 语法组件是先经过 babel 处理的
    处理结果为
    React.createElement(type,{props},children);

    经过babel-preset-react处理的数据

    React.createElement("div", {
                                    className: "xx",
                                    index: "1",
                                    ref: "div",
                                    style: "color:red"
                                }, 
                                "red", 
                                React.createElement("span", null),
                                React.createElement("label", null)
    );

=> createElement() 方法是对传递的参数进行整合返回一个新的便于创建真实dom数据的虚拟dom对象
    主要实现方法 createElement() => return { 
        type:"",
        props:{
            className:"",
            style:"",
            id="",
            children:["文本节点"||"元素节点"<createElemt>]
        },
        ref:"",
        index:"",
    }

=> render( createElement() => return { ... } , 容器元素 , callBack )
    根据虚拟的dom元素创建真实的dom元素 并且把生成的 真实 dom插入到 容器元素里面 插入到容器元素之后进行一个回调函数

```

[使用方法]

```jsx
    <div className="xx" key="1" ref="str" style="color:red">
        red
        <span></span>
        <label></label>
    </div>
    => babel-preset-react 编译为
    // 注意 ： createEklement() 方法的测试数据 jsx 是从 babel-preset-react 编译而来
    createElement(
                        "div", 
                        {
                            className: "xx",
                            key: "1",
                            ref: "str",
                            style: "color:red"
                        }, 
                        "red", 
                        createElement("span", null),
                        createElement("label", null)
    );

    把里面的参数取出来 依次写入函数里面 createElement(
                        "div", 
                        {
                            className: "xx",
                            key: "1",
                            ref: "str",
                            style: "color:red"
                        }, 
                        "red", 
                        createElement("span", null),
                        createElement("label", null)
    )  ->  virtualDomObj -> 
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
            } || {}

    virtualDomObj 是 
    ->  render(virtualDomObj,模板页面已经存在的dom元素<可以自己获取container>,callBack<虚拟dom对象动态创建为真实的dom插入到容器之后的回调>)
```


[createElement方法实现]

```javascript
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

   function createElement(type,props,...children){
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
    props = props||{};
    
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
        type:type||"div",
        ref:ref,
        key:key,
        props:props,
    }
    return virtualDomObj;
   }
```

[render方法实现]

```javascript
    /* 
        render方法的功能: 将虚拟的dom对象 通过 document 动态创建为 真实的dom元素 插入到容器上面 在插入容器之后 进行一个回调
        参数: 
            virtualDomObj {} 就是上面方法的返回结果
            container 虚拟dom生成的dom要插入到这个容器里面
            callBakc 生成的真实dom插入到容器之后触发这个回调函数
        无返回值
     */
    function render(virtualDomObj,container,callBack){
        /*
            virtualDomObj:
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
            } || {}
        */
       // 1) 通过 type 动态创建 元素对象 这个方法最后是从index.js里面编译进去的 最后被引入页面里面
       // 2) 这里 就是在参加 元素节点 后面的判断都是在创建文本节点 
       // 这也是按照 dom 顺序来创建的 <div elementNode> textNode </div>
       var realDomElemet = document.createElement(virtualDomObj["type"]);

       // 2) 给创建的新的dom对象增加属性 virtualDomObj["props"]
        var   virtualDomObjProps = virtualDomObj["props"];

        for(var key in virtualDomObjProps){
            if(virtualDomObjProps.hasOwnProperty(key)){
                // 1) key 为className => 修改为class f
                switch(key.toLowerCase()){
                    case "classname":
                        // 把属性添加到上面创建的dom对象里面
                        realDomElemet.setAttribute("class",virtualDomObjProps[key]);
                        break;
                    case "children":
                        // => virtualDomObjProps["children"] => [  ]||[ "str" ]||[ virtualDomObj{创建dom元素的}]
                        for(var i=0;i<virtualDomObjProps["children"].length;i++){
                            // 有值的情况是当前 元素下的 str 文本节点
                            if(typeof virtualDomObjProps["children"][i] === "string"){
                                // 在当前元素下面增加文件节点就可以了
                                realDomElemet.appendChild(document.createTextNode(virtualDomObjProps["children"][i]));
                            };
                            // 当前元素是一个虚拟dom对象 是去动态创建 当前元素 下的 元素节点
                            if(typeof virtualDomObjProps["children"][i] === "object"){
                                render( virtualDomObjProps["children"][i] , realDomElemet);
                            } 
                        }
                    default:
                        // 其他正常的属性可以直接添加到 realDomElemet
                        realDomElemet.setAttribute(key,virtualDomObjProps[key]);
                };
            };
        };
        // 不管该元素节点有没有属性都要添加到容器上面
        container.appendChild(realDomElemet);
        // 添加成功之后进行插入容器上的回调函数
        callBck||callBack();
    }
```
