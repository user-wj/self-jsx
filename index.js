import createElement from "./createElement.js";
import render from "./render.js";


/* 

    jsx 经过 babel-preset-react 形成的测试数据
                    creamentElement() 方法的测试参数
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
                        )

*/
module.exports = {
    createElement: createElement,
    render: render
}
