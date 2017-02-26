写按键
冒泡
捕获
#类图
![Markdown](http://p1.bpimg.com/1949/bada9d54f5701035.png)
#测试
本次测试代码位于/src/main.ts的window.onload里，有五个元素：
(o代表displayObject, c代表displayObjectContainer)
text(o)     image(o)<br/>
  ○           ○<br/>
    ╲       ╱<br/>
    container(c)   rect(o)<br/>
        ●            ○<br/>
         ╲         ╱<br/>
           stage(c)<br/>
              ●<br/>
##用例1
<font color=red>text(o)</font>     image(o)<br/>
<font color=red>scale(1,5) </font><br/>
  ○           ○<br/>
    ╲       ╱<br/>
    <font color=red>container(c)</font>   <font color=red>rect(o)</font> <br/>
    scale(2,1)   rotate(Math.PI/6)<br/>
        ●            ○<br/>
         ╲         ╱<br/>
           <font color=red>stage(c)</font><br/>
           transform(100,0)<br/>
              ●<br/>
结果：<br/>
![case1](http://p1.bpimg.com/1949/655fa8807cf4ce9d.jpg)