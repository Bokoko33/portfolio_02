var NUM = 17; //頂点数
var invertNum = 3; //反転回数
var dp = new Array();
var angle ;
var canvas;

var count = 0;
var endDraw = false;  //描画終了

var posNum = 5; //残像の数

class DrawParticle{
    constructor(_x,_y){
      this.pos = createVector(_x*100,_y*100);
    //   this.pos = new Array(posNum);
    //   for(var i=0;i<posNum;i++){
    //       this.pos[i] = createVector(_x*1000,_y*1000);
    //   }
      this.fpos = createVector(this.pos.x,this.pos.y);
      //初速に少しばらつきを持たせる
      this.vel = createVector(_x,_y);
      this.vel.mult(random(10,20));
      this.vel.rotate(random(-PI/10,PI/10));

      this.fric = 0.9895;
      this.noiseArg = random(100); //ノイズの引数に使う

      this.offset = 100;
      this.delta = 0.2; //パーティクルの移動量
    }
    
    update(){
        //pattern1
        // 範囲内でランダム(noise)に動き回る計算
        // var xmin = this.offset - (this.fpos.x - this.pos.x);
        // var xmax = 2*this.offset - xmin;

        // var ymin = this.offset - (this.fpos.y - this.pos.y);
        // var ymax = 2*this.offset - ymin;

        // var x = map(noise(this.noiseArg),0,1,-xmin,xmax);
        // var y = map(noise(this.noiseArg),0,1,-ymin,ymax);

        // this.vel.set(x,y);
        // this.vel.mult(this.delta);

        //pattern2
        //速度ベクトルをランダムに少しづつ回転
        var rot = map(noise(this.noiseArg)*this.delta*2 - this.delta,-this.delta,this.delta,-0.015*PI,0.015*PI);
        this.vel.rotate(rot);


        this.pos.add(this.vel);
        // for(var i=0;i<posNum-1;i++){
        //     this.pos[i].set(this.pos[i+1].x,this.pos[i+1]);
        // }
        // this.pos[posNum-1].add(this.vel);


        this.vel.mult(this.fric);
       
        this.noiseArg += 0.02;
    }
}
// function canvasSetup(){
    
//     // smooth();
// }
function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
    endDraw = false;
    count = 0;
    dp.length = 0;
    fill(250,10);
    noStroke();
    rect(0, 0, windowWidth, windowHeight);
    particleInit();
    // canvasSetup();
}
 

function particleInit(){
    angle = TWO_PI / NUM;


    // canvasSetup();

    for(var i=0;i<NUM;i++){
        var fvel = new createVector(1,0);
        fvel.rotate(angle*i);
        fvel.mult(random(0.08,0.13));

        var _dp = new DrawParticle(fvel.x,fvel.y);
        dp.push(_dp);
    }
    fill(255,10);
    noStroke();
    rect(0, 0, windowWidth, windowHeight);
}


function setup(){
    canvas = createCanvas(windowWidth,windowHeight);
    background(250,250,250);

    particleInit();

    $('#defaultCanvas0').fadeIn(2000);
    
}

function draw(){
    // background(255);
    if(endDraw) return;
    stroke(0,90);
    strokeWeight(0.5);
    noFill();
    translate(width/2,height/2);


    for(var i=0;i<dp.length;i++){
        dp[i].update();
    }
    console.log(dp.length);
    


    // 反転回数分描画
    for(var i=0;i<invertNum;i++){
        beginShape();

        curveVertex(dp[dp.length-1].pos.x,dp[dp.length-1].pos.y);
        for(var k=0;k<dp.length;k++){
            curveVertex(dp[k].pos.x, dp[k].pos.y);
        }
        curveVertex(dp[0].pos.x, dp[0].pos.y);
        curveVertex(dp[1].pos.x, dp[1].pos.y);

        endShape();

        rotate(2*PI / invertNum);
    }

    // for(var i=0;i<invertNum;i++){
    //     for(var j=0;j<posNum;j++){
    //         beginShape();

    //         curveVertex(dp[dp.length-1].pos[j].x,dp[dp.length-1].pos[j].y);
    //         for(var k=0;k<dp.length;k++){
    //             curveVertex(dp[k].pos[j].x, dp[k].pos[j].y);
    //         }
    //         curveVertex(dp[0].pos[j].x, dp[0].pos[j].y);
    //         curveVertex(dp[1].pos[j].x, dp[1].pos[j].y);

    //         endShape();

    //         rotate(2*PI / invertNum);

    //     }
    // }

    count ++ ;
    if(count>160){
        canvas.style('transform','translateX(20vw)');
    }

    if(count>200){
        endDraw = true;
        $('.contents').fadeIn(2000);
        
    }
}

