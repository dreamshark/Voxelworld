var createGame =require('voxel-engine');//引入包
var Highlight = require('voxel-highlight')//引入包
var Texture = require('voxel-texture');
var createTerrain = require('voxel-perlin-terrain');
var game=createGame(       //以该函数为基础创造世界 
    { 
    generate: function(x,y,z) {   //generate里面的函数为初始的地图创建函数  
    if (y==0){  
        return x*x+z*z <=55*55? 1:0 
        }
    },
    texturePath:'textures_lite/',      //引入纹理包。纹理包里面的图片都可以在voxel-engine包里面找到     
    materials: [
                ['grass_block_top', 'dirt', 'grass_block_side'],
                "dirt",
                "stone",
				"cobblestone",
				"bedrock",
				["farmland","dirt","dirt"],
				["farmland_moist","dirt","dirt"],
				["water"],
				["oak_planks"],
				["spruce_planks"],
				["birch_planks"],
				["jungle_planks"],
                ["oak_log_top","oak_log"],
				["oak_log_horizontal","oak_log","oak_log_top","oak_log_horizontal"],
				["oak_log","oak_log_horizontal","oak_log_horizontal","oak_log_top"],
                ["spruce_log_top","spruce_log"],
				["spruce_log_horizontal","spruce_log","spruce_log_top","spruce_log_horizontal"],
				["spruce_log","spruce_log_horizontal","spruce_log_horizontal","spruce_log_top"],
                ["birch_log_top","birch_log"],
				["birch_log_horizontal","birch_log","birch_log_top","birch_log_horizontal"],
				["birch_log","birch_log_horizontal","birch_log_horizontal","birch_log_top"],
                ["jungle_log_top","jungle_log"],
				["jungle_log_horizontal","jungle_log","jungle_log_top","jungle_log_horizontal"],
				["jungle_log","jungle_log_horizontal","jungle_log_horizontal","jungle_log_top"],				
                "oak_leaves_opaque",
				["oak_planks","bookshelf"],
                ["crafting_table_top","crafting_table_top","crafting_table_front","crafting_table_side"],
                ["furnace_top","furnace_top","furnace_front","furnace_side"],
                ["jukebox_side"],
				["jukebox_top","jukebox_side"],
				["cartography_table_side2","cartography_table_side3","cartography_table_top","cartography_table_side3","cartography_table_side1","cartography_table_side3"],
				["fletching_table_top","birch_planks","fletching_table_front","fletching_table_side"],
				["smithing_table_top","smithing_table_bottom","smithing_table_front","smithing_table_side"],
				["blast_furnace_top","blast_furnace_top","blast_furnace_front","blast_furnace_side"],
				["smoker_top","smoker_bottom","smoker_front","smoker_side"]
				
            ]   //添加初始纹理（都是纹理包里面的）

    }
 );
// game.appendTo('#container');
//获得全屏
var container = document.getElementById('container');
game.appendTo(container);
container.addEventListener('click', function() {
  game.requestPointerLock(container);
});
    
var createPlayer=require('voxel-player')(game);   //引入包

var substack=createPlayer('skin/steve.png');  //创建你的小人

substack.possess();      //小人获得移动视角
substack.yaw.position.set(0,3,0);    //小人初始位置



// 点击破坏方块
// var explode = require('voxel-debris')(game, { power : 1.5 });

// game.on('fire', function(pos) {
//   var pos = game.raycast(game.cameraPosition(), game.cameraVector(), 100).voxel;
//   if (erase) explode(pos);
//   else game.createBlock(pos, 1);
// });

// var erase = true;
// function ctrlToggle (ev) { erase = !ev.ctrlKey }
// window.addEventListener('keydown', ctrlToggle);
var basicCubeIndex=1;
var planksIndex=9;
var logIndex=13;
var leavesIndex=logIndex+12;
var furnitureIndex=26;
var altitudeZero=0;

generateForest([0,altitudeZero+1,0],5,8);
generatePlatform([0,altitudeZero,-5]);
generateBuilding1([5,altitudeZero,0]);
generateBuilding2([-5,altitudeZero,0]);
generateFarmland([0,altitudeZero,5]);
// game.setBlock([0,1,-5],furnitureIndex);
// game.setBlock([-2,1,-5],furnitureIndex+1);
// game.setBlock([2,1,-5],28); 


function setBlockLine(pos,length,direction,blockIndex){
    let x=pos[0];
    let y=pos[1];
    let z=pos[2];
    switch(direction){
        case "x+":
            for(let i=x;i<=x+length-1;i++)
                game.setBlock([i,y,z], blockIndex);
            break;
        case "x-":
            for(let i=x-length+1;i<=x;i++)
                game.setBlock([i,y,z], blockIndex);
            break;S
        case "y+":
            for(let i=y;i<=y+length-1;i++)
                game.setBlock([x,i,z], blockIndex);
            break;
        case "y-":
            for(let i=y-length+1;i<=y;i++)
                game.setBlock([x,i,z], blockIndex);
            break;
        case "z+":
            for(let i=z;i<=z+length-1;i++)
                game.setBlock([x,y,i], blockIndex);
            break;
        case "z-":
            for(let i=z-length+1;i<=z;i++)
                game.setBlock([x,y,i], blockIndex);
            break; 
        default:
            break;
    }
}
function setBlockArea(pos1,pos2,blockIndex){
    let x1=pos1[0]<pos2[0]?pos1[0]:pos2[0];
    let x2=pos1[0]+pos2[0]-x1;
    let y1=pos1[1]<pos2[1]?pos1[1]:pos2[1];
    let y2=pos1[1]+pos2[1]-y1;
    let z1=pos1[2]<pos2[2]?pos1[2]:pos2[2];
    let z2=pos1[2]+pos2[2]-z1;
    
    for(let i=x1;i<=x2;i++){
        for(let j=y1;j<=y2;j++){
            for(let k=z1;k<=z2;k++){
                game.setBlock([i,j,k], blockIndex);
            }
        }
    }

}

function generateTree(pos,type=0,cat=0){
    let x=pos[0];
    let y=pos[1];
    let z=pos[2];
    let offset=cat*3;
    if(type==0){
         for(let i=x-1;i<=x+1;i++){
            for(j=z-1;j<=z+1;j++){
                game.setBlock([i,y+2,j], leavesIndex);
            }
        }
        for(let i=x-1;i<=x+1;i++)
            game.setBlock([i,y+3,z], leavesIndex);
        for(let i=z-1;i<=z+1;i++)
            game.setBlock([x,y+3,i], leavesIndex);
        for(let i=y;i<=y+3;i++)
            game.setBlock([x,i,z], logIndex+offset);
        switch(Math.floor(Math.random()*4)){
            case 0:game.setBlock([x-2,y+2,z], leavesIndex);break;
            case 1:game.setBlock([x-2,y+2,z], leavesIndex);break;
            case 2:game.setBlock([x,y+2,z-2], leavesIndex);break;
            case 3:game.setBlock([x,y+2,z+2], leavesIndex);break;        
        }
        if(Math.random()>0.5) game.setBlock([x,y+4,z], leavesIndex);
    }
    else if(type==1){
        setBlockArea([x-2,y+1,z-2],[x+2,y+2,z+2],leavesIndex);
        setBlockLine([x-2,y+1,z+2],2,"y+",0);
        setBlockLine([x+2,y+1,z+2],2,"y+",0);
        setBlockLine([x-2,y+1,z-2],2,"y+",0);
        setBlockLine([x+2,y+1,z-2],2,"y+",0);
        setBlockArea([x-1,y+3,z-1],[x+1,y+4,z+1],leavesIndex);
        setBlockLine([x-1,y+3,z-1],2,"y+",0);
        setBlockLine([x+1,y+3,z-1],2,"y+",0);
        setBlockLine([x-1,y+3,z+1],2,"y+",0);
        setBlockLine([x+1,y+3,z+1],2,"y+",0);
        
        setBlockLine([x,y,z],4,"y+",logIndex);
        switch(Math.floor(Math.random()*4)){
            case 0:game.setBlock([x-2,y+1,z-2], leavesIndex);break;
            case 1:game.setBlock([x-2,y+1,z+2], leavesIndex);break;
            case 2:game.setBlock([x+2,y+1,z-2], leavesIndex);break;
            case 3:game.setBlock([x+2,y+1,z+2], leavesIndex);break;
        }
        switch(Math.floor(Math.random()*4)){
            case 0:game.setBlock([x-1,y+3,z-1], leavesIndex);break;
            case 1:game.setBlock([x-1,y+3,z+1], leavesIndex);break;
            case 2:game.setBlock([x+1,y+3,z-1], leavesIndex);break;
            case 3:game.setBlock([x+1,y+3,z+1], leavesIndex);break;
        }

    }

}
function generateForest(forestCenter,forestSize=5,divSize=8){
    //森林中心坐标forestCenter
    //划分为若干个小区域div，在每个小区域div内的随机位置生成一棵树
    //森林的边长forestSize（以小区域为单位）
    //每个小区域div的边长divSize（以方块为单位）
    let forestHalfSize=Math.ceil(forestSize/2);
    let divHalfSize=Math.ceil(divSize/2);
    let divCenter=new Array(3);
    for(let i=-forestHalfSize;i<=forestHalfSize;i++){
        for(let j=-forestHalfSize;j<=forestHalfSize;j++){
            if(i==0&&j==0 || i==0&&j==-1 || i==-1&&j==0 || i==-2&&j==0 || i==+1&&j==0 || i==+2&&j==0 || i==0&&j==1 || i==1&&j==1|| i==-1&&j==1)
                continue;
            divCenter[0]=forestCenter[0]+divSize*i;
            divCenter[2]=forestCenter[2]+divSize*j;
            let divCenterX=divCenter[0]+Math.floor((Math.random()*divSize))-divHalfSize;
            let divCenterY=forestCenter[1];
            let divCenterZ=divCenter[2]+Math.floor((Math.random()*divSize))-divHalfSize;
            let cat=Math.random()>0.5?2:0;
            let type=Math.random()>0.5?1:0;
            generateTree([divCenterX,divCenterY,divCenterZ],type,cat);
        }
    }
}

function generatePlatform(pos){
    let x=pos[0];
    let y=pos[1];
    let z=pos[2];
    for(let i=z;i>=z-3;i--){
        game.setBlock([x-2,y,i], logIndex);
        game.setBlock([x+2,y,i], logIndex);
    }
    for(let i=x-2;i<=x+2;i++){
        game.setBlock([i,y,z-3], logIndex);
    }
    for(let i=y+1;i<=y+2;i++){
        game.setBlock([x-2,i,z-3], logIndex);
        game.setBlock([x+2,i,z-3], logIndex);
    }   
    game.setBlock([x-2,y+1,z-1], logIndex);
    game.setBlock([x+2,y+1,z-1], logIndex);
    
    game.setBlock([x-1,y,z], planksIndex);
    game.setBlock([x+1,y,z], planksIndex);
    game.setBlock([x-1,y,z-2], planksIndex);
    game.setBlock([x+1,y,z-2], planksIndex);
    game.setBlock([x,y,z-1], planksIndex);
    game.setBlock([x,y,z], planksIndex+2);
    game.setBlock([x-1,y,z-1], planksIndex+2);
    game.setBlock([x+1,y,z-1], planksIndex+2);
    game.setBlock([x,y,z-2], planksIndex+2);
    
    game.setBlock([x-2,y+1,z-2], furnitureIndex);
    game.setBlock([x+2,y+1,z-2], furnitureIndex);
    for(let i=x-1;i<=x+1;i++){
        game.setBlock([i,y+2,z-3], furnitureIndex);
    }
    game.setBlock([x,y+1,z-3], furnitureIndex+1);
    game.setBlock([x-1,y+1,z-3], furnitureIndex+3);
    game.setBlock([x+1,y+1,z-3], furnitureIndex+3);
}

function generateBuilding1(pos){
    let x=pos[0];
    let y=pos[1];
    let z=pos[2];
    
    let birchPlanksIndex=planksIndex+2;
    let frontOakLogIndex=logIndex+1;
    let leftOakLogIndex=logIndex+2;
    
    for(let i=z-3;i<=z-2;i++){
        for(let j=x;j<=x+7;j++){
            game.setBlock([j,y,i], planksIndex);
        }
    }
    for(let i=z+2;i<=z+3;i++){
        for(let j=x;j<=x+7;j++){
            game.setBlock([j,y,i], planksIndex);
        }
    }
    setBlockArea([x+7,y,z-1],[x+7,y+4,z+1],planksIndex);
    setBlockArea([x,y,z-1],[x+6,y,z+1],birchPlanksIndex);
    game.setBlock([x,y,z], planksIndex);
    game.setBlock([x+6,y,z+1], planksIndex);
    game.setBlock([x+3,y,z-1], planksIndex);
    game.setBlock([x+3,y,z+1], planksIndex);
    game.setBlock([x+1,y,z], planksIndex);
    game.setBlock([x+4,y,z], planksIndex);
    game.setBlock([x+5,y,z], planksIndex);
    game.setBlock([x+6,y,z-1], planksIndex);
    game.setBlock([x+6,y,z+1], planksIndex);
    setBlockLine([x+1,y+1,z-2],2,"y+",birchPlanksIndex);
    setBlockLine([x+1,y+1,z+2],2,"y+",birchPlanksIndex);
    setBlockLine([x+1,y+3,z-2],2,"z+",planksIndex);
    setBlockLine([x+1,y+3,z+2],2,"z-",planksIndex);
    game.setBlock([x+1,y+4,z], planksIndex);
    setBlockLine([x+7,y+4,z-1],3,"z+",planksIndex);
    setBlockLine([x+7,y+3,z-1],3,"z+",birchPlanksIndex);
    game.setBlock([x+7,y+3,z-2], planksIndex);
    game.setBlock([x+7,y+3,z+2], planksIndex);

    setBlockLine([x+2,y+1,z-3],4,"x+",birchPlanksIndex);
    setBlockLine([x+2,y+1,z+3],4,"x+",birchPlanksIndex);
    setBlockLine([x+2,y+2,z-3],4,"x+",birchPlanksIndex);
    setBlockLine([x+2,y+2,z+3],4,"x+",birchPlanksIndex);    
    setBlockLine([x+2,y+3,z-3],4,"x+",planksIndex);
    setBlockLine([x+2,y+3,z+3],4,"x+",planksIndex);
    setBlockLine([x+3,y+2,z-3],2,"x+",planksIndex);
    setBlockLine([x+3,y+2,z+3],2,"x+",planksIndex);
    
    setBlockLine([x+1,y+1,z-3],3,"y+",logIndex);
    setBlockLine([x+1,y+1,z+3],3,"y+",logIndex);
    setBlockLine([x+6,y+1,z-3],4,"y+",logIndex);
    setBlockLine([x+6,y+1,z+3],4,"y+",logIndex);
    setBlockLine([x+7,y+1,z-2],2,"y+",logIndex);
    setBlockLine([x+7,y+1,z+2],2,"y+",logIndex);

    game.setBlock([x,y+1,z-3], logIndex);
    game.setBlock([x,y+1,z+3], logIndex);
    game.setBlock([x,y+1,z-2], leftOakLogIndex);
    game.setBlock([x,y+1,z+2], leftOakLogIndex);
    
    game.setBlock([x+1,y+4,z+2], logIndex);
    game.setBlock([x+1,y+5,z+1], logIndex);
    game.setBlock([x+1,y+4,z-2], logIndex);
    game.setBlock([x+1,y+5,z-1], logIndex);
    game.setBlock([x+1,y+4,z-1], frontOakLogIndex);
    game.setBlock([x+1,y+5,z], frontOakLogIndex);
    game.setBlock([x+1,y+4,z+1], frontOakLogIndex);
    game.setBlock([x+7,y+1,z-3], logIndex);
    game.setBlock([x+7,y+1,z+3], logIndex);
    game.setBlock([x+8,y+1,z-2], leftOakLogIndex);
    game.setBlock([x+8,y+1,z+2], leftOakLogIndex);
    
    setBlockLine([x+2,y+4,z-2],4,"x+",leftOakLogIndex);
    setBlockLine([x+2,y+4,z+2],4,"x+",leftOakLogIndex);
    setBlockLine([x+2,y+5,z-1],4,"x+",leftOakLogIndex);
    setBlockLine([x+2,y+5,z+1],4,"x+",leftOakLogIndex);
    setBlockLine([x+2,y+1,z+2],5,"x+",leftOakLogIndex);
    setBlockLine([x+2,y+1,z-2],5,"x+",leftOakLogIndex);
    setBlockLine([x+2,y+4,z+2],5,"x+",leftOakLogIndex);
    setBlockLine([x+2,y+4,z-2],5,"x+",leftOakLogIndex);
    
    game.setBlock([x+6,y+5,z], frontOakLogIndex);
    
    setBlockLine([x+2,y+5,z],2,"x+",planksIndex);
    setBlockLine([x+4,y+5,z],2,"x+",birchPlanksIndex);
    game.setBlock([x+6,y+5,z-1], birchPlanksIndex);
    game.setBlock([x+6,y+5,z+1], birchPlanksIndex);
    game.setBlock([x+6,y+4,z-2], planksIndex);
    game.setBlock([x+6,y+4,z+2], planksIndex);
    setBlockLine([x+6,y+2,z-2],2,"y+",birchPlanksIndex);
    setBlockLine([x+6,y+2,z+2],2,"y+",birchPlanksIndex);
    
    game.setBlock([x+2,y+2,z-2], furnitureIndex+1);
    game.setBlock([x+3,y+2,z-2], furnitureIndex+5);
    game.setBlock([x+4,y+2,z-2], furnitureIndex+6);
    game.setBlock([x+5,y+2,z-2], furnitureIndex+7);
    game.setBlock([x+2,y+2,z+2], furnitureIndex+1);
    game.setBlock([x+3,y+2,z+2], furnitureIndex+5);
    game.setBlock([x+4,y+2,z+2], furnitureIndex+6);
    game.setBlock([x+5,y+2,z+2], furnitureIndex+7);
}

function generateBuilding2(pos){
    let x=pos[0];
    let y=pos[1];
    let z=pos[2];
    let cobbleStoneIndex=basicCubeIndex+3;
    let sprucePlanksIndex=planksIndex+1;
    
    let frontOakLogIndex=logIndex+1;
    let leftOakLogIndex=logIndex+2;
    
    let spruceLogIndex=logIndex+3;
    let frontSpruceLogIndex=spruceLogIndex+1;
    let leftSpruceLogIndex=spruceLogIndex+2;    
    
    
    game.setBlock([x,y,z], sprucePlanksIndex);
    setBlockArea([x,y,z-3],[x-7,y,z+3],planksIndex);
    game.setBlock([x,y,z], sprucePlanksIndex);
    setBlockLine([x-1,y,z-1],2,"x-",sprucePlanksIndex);
    setBlockLine([x-1,y,z+1],2,"x-",sprucePlanksIndex);
    setBlockLine([x-4,y,z-1],2,"x-",sprucePlanksIndex);
    setBlockLine([x-4,y,z+1],2,"x-",sprucePlanksIndex); 
    setBlockLine([x-2,y+4,z+2],5,"x-",sprucePlanksIndex);
    setBlockLine([x-2,y+4,z-2],5,"x-",sprucePlanksIndex);
    game.setBlock([x-6,y,z], sprucePlanksIndex);
    game.setBlock([x-6,y+2,z-2], sprucePlanksIndex);
    game.setBlock([x-6,y+2,z+2], sprucePlanksIndex);
    game.setBlock([x-2,y+2,z-2], sprucePlanksIndex);
    game.setBlock([x-2,y+2,z+2], sprucePlanksIndex);
    setBlockLine([x-1,y+3,z-2],2,"z+",sprucePlanksIndex);
    setBlockLine([x-1,y+3,z+2],2,"z-",sprucePlanksIndex);
    setBlockArea([x-2,y+5,z-1],[x-6,y+5,z+1],sprucePlanksIndex);
    setBlockLine([x-2,y+5,z],2,"x-",planksIndex);
    
    setBlockLine([x-1,y+1,z+2],2,"y+",cobbleStoneIndex);
    setBlockLine([x-1,y+1,z-2],2,"y+",cobbleStoneIndex);
    setBlockArea([x-2,y+1,z-3],[x-6,y+3,z-3],cobbleStoneIndex);
    setBlockArea([x-2,y+1,z+3],[x-6,y+3,z+3],cobbleStoneIndex);
    setBlockArea([x-7,y+1,z-2],[x-7,y+3,z+2],cobbleStoneIndex);
    setBlockLine([x-8,y+1,z+1],3,"z-",cobbleStoneIndex);
    
    setBlockLine([x-1,y+1,z-3],2,"y+",spruceLogIndex);
    setBlockLine([x-1,y+1,z+3],2,"y+",spruceLogIndex);
    setBlockLine([x-7,y+1,z+3],2,"y+",spruceLogIndex); 
    setBlockLine([x-7,y+1,z-3],2,"y+",spruceLogIndex);
    game.setBlock([x-2,y+3,z-3], spruceLogIndex);
    game.setBlock([x-6,y+3,z-3], spruceLogIndex);
    game.setBlock([x-2,y+3,z+3], spruceLogIndex);
    game.setBlock([x-6,y+3,z+3], spruceLogIndex);
    game.setBlock([x-2,y+1,z+2], spruceLogIndex);
    game.setBlock([x-2,y+1,z-2], spruceLogIndex);
    game.setBlock([x-6,y+1,z-2], spruceLogIndex);
    game.setBlock([x-6,y+1,z+2], spruceLogIndex);
    game.setBlock([x,y+1,z-2], leftOakLogIndex);
    game.setBlock([x,y+1,z+2], leftOakLogIndex);
    game.setBlock([x-1,y+4,z-2], leftOakLogIndex);
    game.setBlock([x-1,y+4,z+2], leftOakLogIndex);
    
    game.setBlock([x,y+1,z-3], logIndex);
    game.setBlock([x,y+1,z+3], logIndex);
    game.setBlock([x-7,y+3,z-2], logIndex);
    game.setBlock([x-7,y+3,z+2], logIndex);
    setBlockLine([x-1,y+4,z-1],3,"z+",frontOakLogIndex);
    setBlockLine([x-7,y+4,z-1],3,"z+",frontOakLogIndex);
    setBlockLine([x-3,y+1,z-2],3,"x-",leftOakLogIndex);
    setBlockLine([x-3,y+1,z+2],3,"x-",leftOakLogIndex);
    game.setBlock([x-2,y+5,z-1], leftOakLogIndex);
    game.setBlock([x-2,y+5,z+1], leftOakLogIndex);
    game.setBlock([x-6,y+5,z-1], leftOakLogIndex);
    game.setBlock([x-6,y+5,z+1], leftOakLogIndex);
    game.setBlock([x-8,y+1,z-2], leftSpruceLogIndex);
    game.setBlock([x-8,y+1,z+2], leftSpruceLogIndex);
    
    game.setBlock([x-3,y+2,z-2], furnitureIndex+2);
    game.setBlock([x-4,y+2,z-2], furnitureIndex+8);
    game.setBlock([x-5,y+2,z-2], furnitureIndex+9);
    game.setBlock([x-3,y+2,z+2], furnitureIndex+2);
    game.setBlock([x-4,y+2,z+2], furnitureIndex+8);
    game.setBlock([x-5,y+2,z+2], furnitureIndex+9);
}

function generateFarmland(pos,size=5){
    let x=pos[0];
    let y=pos[1];
    let z=pos[2];
    let halfSize=Math.floor(size/2);
    
    let frontOakLogIndex=logIndex+1;
    let leftOakLogIndex=logIndex+2;
    let spruceLogIndex=logIndex+3;
    let frontSpruceLogIndex=spruceLogIndex+1;
    let leftSpruceLogIndex=spruceLogIndex+2;   
    
    setBlockLine([x-halfSize,y,z],size,"x+",leftSpruceLogIndex);
    setBlockLine([x-halfSize,y,z+size+1],size,"x+",leftSpruceLogIndex);
    setBlockLine([x-halfSize-2,y,z],size+2,"z+",logIndex);
    setBlockLine([x+halfSize+2,y,z],size+2,"z+",logIndex);
    
    game.setBlock([x-halfSize-1,y,z], spruceLogIndex);
    game.setBlock([x+halfSize+1,y,z], spruceLogIndex);
    game.setBlock([x-halfSize-1,y,z+size+1], spruceLogIndex);
    game.setBlock([x+halfSize+1,y,z+size+1], spruceLogIndex);
    game.setBlock([x-halfSize-2,y+1,z], spruceLogIndex);
    game.setBlock([x+halfSize+2,y+1,z], spruceLogIndex);
    game.setBlock([x-halfSize-2,y+1,z+size+1], spruceLogIndex);
    game.setBlock([x+halfSize+2,y+1,z+size+1], spruceLogIndex);
    
    setBlockArea([x-halfSize,y,z+1],[x+halfSize,y,z+size],basicCubeIndex+6);
    
    setBlockLine([x-halfSize-1,y,z+1],size,"z+",0);
    setBlockLine([x+halfSize+1,y,z+1],size,"z+",0);    
    setBlockLine([x-halfSize-1,y-1,z+1],size,"z+",3);
    setBlockLine([x+halfSize+1,y-1,z+1],size,"z+",3);
    
    generateTree([x,y+1,z+size+1],1,0);
    
    let water1 = new game.THREE.Mesh(
        new game.THREE.CubeGeometry(1, 2, size), // 宽，高，深
        game.materials.material
    )
        game.materials.paint(water1, "water");
        water1.position.set(x-halfSize-0.5, y+0.5, z+size/2+1);
    game.addItem({
      mesh: water1,
      size: 1,
      velocity: { x: 0, y: 0, z: 0 } // initial velocity
    })
    let water2 = new game.THREE.Mesh(
        new game.THREE.CubeGeometry(1, 2, size), // 宽，高，深
        game.materials.material
    )
        game.materials.paint(water2, "water");
        water2.position.set(x+halfSize+1.5, y+0.5, z+size/2+1);
    game.addItem({
      mesh: water2,
      size: 1,
      velocity: { x: 0, y: 0, z: 0 } // initial velocity
    })
}