##高逼格文档标记语言-markdown入门

####markdown简介：
```
Markdown 是一种轻量级标记语言，创始人为约翰·格鲁伯（John Gruber）。它允许人们“使用易读易写的纯文本格式编写文档，然后转换成有效的XHTML(或者HTML)文档”。[1]这种语言吸收了很多在电子邮件中已有的纯文本标记的特性。

Markdown同时还是一个由Gruber编写的Perl脚本：Markdown.pl。它把用markdown语法编写的内容转换成有效的、结构良好的XHTML或HTML内容，并将左尖括号('<')和&号替换成它们各自的字符实体引用。它可以用作单独的脚本，Blosxom和Movable Type的插件又或者BBEdit的文本过滤器.[1]

Markdown也已经被其他人用Perl和别的编程语言重新实现，其中一个Perl模块放在了CPAN(Text::Markdown)上。它基于一个BSD风格的许可证分发并可以作为几个内容管理系统的插件。
```

####基本
* 换行 行末两个空格 & 回车键
* header

  ~~~
  Header
  =================
  
  or
  
  Header
  -----------------
  ~~~
* 分级header  

  ~~~
  #header
  ##header
  ###header
  ####header
  ~~~
* 无序列表  

  ~~~
  * 第一个
  * 第二个
  * 第三个
  ~~~
* 有序列表

  ~~~
  1. 第一个
  2. 第二个
  3. 第三个
  ~~~

  

####语法
1. 字体
  * 加粗 `**like this**` **like this**
  * 斜体 `*like this*` *like this*
2. 图片 `![Alt Image Text](path/or/url/to.jpg "Optional Title")`![MacDown logo](http://macdown.uranusjr.com/static/base/img/logo-160.png "😄")
3. 链接 [Markdown Site][1]`[Markdown Site](http://daringfireball.net/projects/markdown/syntax)` or `[Markdown Site][1]`
4. email <kuitos.lau@gmail.com> `<kuitos.lau@gmail.com>`
5. 文章块引用
    >第一层引用
    >>第二层引用  
    
   ~~~
	>第一层引用
   >>第二层引用  	
   ~~~

6. inline code `` `inline code` ``
7. 水平分隔线 `---` or `***`
   
   ---
   ***



8. 表格
	
	| 左对齐  | 居中  | 右对齐 |
	|:------ |:--------:| -----:|
	| 第一行  | 他大舅    | $1600 |
	| 第二行  | 他二舅    | $12   |
	| 第三行  | 都是他舅  |  $1   |
	
9. 大招来了 代码块高亮  
	
	~~~js
	var object = {};
	function fn(){}
	console.log("Hello World");
	~~~	
	
***
**更多markdown语法请访问**[markdown site][1]

MIT  
[1]: http://daringfireball.net/projects/markdown/syntax