# voxelworld

`Voxel.js`，是用于呈现在浏览器上的方块游戏的构建工具包

> an open source voxel game building toolkit for modern web browsers
>
> ——Voxel官网

![image-20211121214832826](http://etherealdreamfuture.com/wp-imgs/image-20211121214832826.png)

> **基于Voxel搭建的方块世界样例可以试玩**
>
> http://shama.github.io/voxel-drone/
>
> http://maxogden.github.io/slides/nodepdx/index.html

> **Voxel官网**
>
> http://www.voxeljs.com/
>
> **Voxel系列项目**
> https://github.com/maxogden?tab=repositories&q=voxel

## 构建项目

其需要先在服务器上安装`Node.js`，再根据自己需求找到`Voxel`相应的模块包用`npm`进行安装

> **Node.js安装教程可查看**
>
> https://www.runoob.com/nodejs/nodejs-install-setup.html

`Voxel`的模块包有很多，其中`voxel-engine`是核心模块，不可缺少

还有很多模块包，如玩家角色模块包`voxel-player`，材质模块包`voxel-textures`，光照投影模块包`voxel-highlight`，碎片模块包`voxel-debris`等等

在这里给出用`npm`安装模块包的命令例子

```shell
npm install voxel-engine
npm install voxel-player
npm install voxel-highlight
```

其后还要安装`browserify`

```shell
npm install browserify -g
```

新建一个js文件`index.js`并在里面写上初始化的代码

```javascript
//此处代码学习自YiDaoDo博客 https://blog.csdn.net/lmmmmmnb/article/details/115193123

var createGame =require('voxel-engine');//引入包
var Highlight = require('voxel-highlight')//引入包
var game=createGame(       //以该函数为基础创造世界 
    { 
    generate: function(x,y,z) {   //generate里面的函数为初始的地图创建函数  
    if (y==0){  
        return x*x+z*z <=55*55? 1:0 
        }else if(y==8&&x==0&&z==0){ 
        return 1    
        } 
    }, 
    texturePath:'textures/',      //引入纹理包。纹理包里面的图片都可以在voxel-engine包里面找到     
    materials: ["grass"]   //添加初始纹理（都是纹理包里面的）

      }
 );

var createPlayer=require('voxel-player')(game);   //引入包

game.appendTo(document.body);       //获得全屏

var substack=createPlayer('skin/shama.png');  //创建你的小人

substack.possess();      //小人获得移动视角

substack.yaw.position.set(3,30,0);    //小人初始位置
```

随后执行下述指令，利用browserify根据初始化代码生成相应的运行方块世界的完整代码

```shell
browserify index.js -o world.js
```

如果想要游戏屏幕中央带有红色准心，那就新建一个css文件`style.css`，里面写入下述代码并在html文件中引入

```css
body {
  margin: 0px;
  font-family: Arial, sans-serif;
  font-size: 80%;
}
#container {
  -moz-user-select: none;
  -webkit-user-select: none;
  user-select: none;
}
#crosshair {
  position: fixed;
  top: 50%;
  left: 50%;
  margin: -2px 0 0 -2px;
  width: 4px;
  height: 4px;
  background-color: #d00;
  opacity: 0.5;
}
```

最后新建一个html文件`index.html`，在其中引入`style.css`和新生成的`world.js`，即大功告成

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
        <title>方块世界</title>
        <link rel="stylesheet" href="style.css" />		
	</head>
	<body>
        <div id="container"></div>
        <div id="crosshair"></div>
	    <script src="bundle.js"></script>
	</body>
</html>
```

最后项目的文件大致是这样的

```treeview
Voxel
├── node_modules        ::Voxel若干模块包
├── textures       ::材质
├── skin       ::人物皮肤
├── index.html
├── style.css
├── index.js
├── world.js
└── package-lock.json
```

> **Voxel.js文档可查看**
>
> https://blog.csdn.net/lmmmmmnb/article/details/115193123

## voxel-texture

`voxel-texture`是材质模块包，可以让你的方块6个面都拥有各自的材质

方块材质传入一个数组`materials`（数组大小1-6均可），每个元素对应方块某个面材质的名称

### 面名称中英释义

- 顶面 top
- 底面 bottom
- 前面 front
- 背面 back
- 左面 left
- 右面 right
- 侧面 side（包含前、背、左、右四个面）
- 全部面 all（包含六个面）

### 面方向与坐标值的关系

- front方向前进z值减小
- left方向前进x值减小
- top方向前进y值增大(y是纵坐标值)

### 不同大小数组参数下每个元素代表的含义

根据数组参数大小的不同，其每个元素对应的方块面也不同。

```javascript
[all]//数组大小为1
[top and bottom，side]//数组大小为2
[top，bottom，side]//数组大小为3
[top,bottom,front and back,left and right]
//不能以大小为5的数组作为参数，否则右面会缺失材质
[front，back，top，bottom，left，right]//数组大小为6
```

## 其他包

模组包`voxel-engine`，`voxel-player`，`voxel-highlight`都可以查看 https://blog.csdn.net/lmmmmmnb/article/details/115193123