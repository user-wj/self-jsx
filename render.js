/* 
    render方法的功能: 将虚拟的dom对象 通过 document 动态创建为 真实的dom元素 插入到容器上面 在插入容器之后 进行一个回调
    参数: 
        virtualDomObj {} 就是上面方法的返回结果
        container 虚拟dom生成的dom要插入到这个容器里面
        callBakc 生成的真实dom插入到容器之后触发这个回调函数
    无返回值
 */
function render(virtualDomObj, container, callBack) {
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
    var virtualDomObjProps = virtualDomObj["props"];

    for (var key in virtualDomObjProps) {
        if (virtualDomObjProps.hasOwnProperty(key)) {
            // 1) key 为className => 修改为class f
            switch (key.toLowerCase()) {
                case "classname":
                    // 把属性添加到上面创建的dom对象里面
                    realDomElemet.setAttribute("class", virtualDomObjProps[key]);
                    break;
                case "children":
                    // => virtualDomObjProps["children"] => [  ]||[ "str" ]||[ virtualDomObj{创建dom元素的}]
                    for (var i = 0; i < virtualDomObjProps["children"].length; i++) {
                        // 有值的情况是当前 元素下的 str 文本节点
                        if (typeof virtualDomObjProps["children"][i] === "string") {
                            // 在当前元素下面增加文件节点就可以了
                            realDomElemet.appendChild(document.createTextNode(virtualDomObjProps["children"][i]));
                        };
                        // 当前元素是一个虚拟dom对象 是去动态创建 当前元素 下的 元素节点
                        if (typeof virtualDomObjProps["children"][i] === "object") {
                            render(virtualDomObjProps["children"][i], realDomElemet);
                        }
                    }
                default:
                    // 其他正常的属性可以直接添加到 realDomElemet
                    realDomElemet.setAttribute(key, virtualDomObjProps[key]);
            };
        };
    };
    // 不管该元素节点有没有属性都要添加到容器上面
    container.appendChild(realDomElemet);
    // 添加成功之后进行插入容器上的回调函数
    callBack || callBack();
};

module.exports = render;