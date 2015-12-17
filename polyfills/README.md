### polyfills

1. ng-resource-polyfill  
    针对angular-resource不兼容返回结果为基本数据类型(string,number,boolean)的情况做的垫片代码
2. ui-router-require-polyfill   
    angular & ui-router 框架下的按需加载解决方案,可达到不修改一行js代码即可实现模版依赖按需加载的需求.依赖于[oclazyload](https://github.com/ocombe/ocLazyLoad)  
    通过往模版script标签中加入seq属性来控制加载顺序
    
    ```html
    <script scr="index1.js" seq="0"></script>
    <script scr="index2.js" seq="1"></script>
    <script scr="index3.js" seq="2"></script>
    <script scr="index4.js" seq="1"></script>
    ```
    加载顺序为: index1.js --> index2.js & index4.js --> index3.js
    
    [demo](http://159.203.248.99/angular-utils/polyfills/demo/index.html)
    