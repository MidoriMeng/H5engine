#引用外部库失败:(
#类图
![Markdown](http://p1.bpimg.com/1949/bada9d54f5701035.png)
#测试
本次测试代码位于/src/main.ts的window.onload里，有五个元素：
(o代表displayObject, c代表displayObjectContainer)
text(o)     image(o)
  ○           ○
    ╲       ╱
    container(c)   rect(o)
        ●            ○
         ╲         ╱
           stage(c)
              ●
##用例1
<font color=red>text(o)</font>     image(o)
<font color=red>scale(1,5) </font>
  ○           ○
    ╲       ╱
    <font color=red>container(c)</font>   <font color=red>rect(o)</font> 
    scale(2,1)   rotate(Math.PI/6)
        ●            ○
         ╲         ╱
           <font color=red>stage(c)</font>
           transform(100,0)
              ●
结果：
![case1](http://p1.bpimg.com/1949/655fa8807cf4ce9d.jpg)