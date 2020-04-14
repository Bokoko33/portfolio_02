//メインビジュアル関連
var vertexNum = 9; //頂点数
var invertNum = 3; //反転回数
var dp = new Array();
var angle ;
var canvas;
var count = 0;
var centerX; //X座標の中心
var endDraw = false;  //描画終了
var posNum = 4; //残像の数　4がちょうど良いかなあ
var interval = 10; //残像の間隔（フレーム）


//漂流物関連
var fpNum = 30;
var fp = new Array();
var in_works = false; //ワークページかどうか
var in_about = false; //about..
var lineNum = 2; //一つに対して何個近くのやつと繋げるか

// var all_clear = false; //全てのfpが除外された


var bgImage;
// var clickCount = 0;


class FloatParticle{
    constructor(){
        if(!in_works && !in_works){ //top画面リロードでの生成なら
            this.pos = createVector(random(width),random(height));
            this.vel = createVector(random(-1,1),random(-1,1));
            this.vel.normalize();
            this.vel.mult(100);
            this.fric = 0.9;
            this.r = random(3,10);
        }
        else{ //そうでなければとりあえずどこかに
            this.pos = createVector(9999,9999);
            this.vel = createVector(0,0);
            this.vel.normalize();
            this.vel.mult(100);
            this.fric = 0.9;
            this.r = random(3,10);
        }
        

        // this.out = false; //画面外か
    }

    update(){
        //カーソルが近づくと反発
        if(dist(mouseX,mouseY,this.pos.x,this.pos.y)<50){
            var mouseVec = createVector(mouseX,mouseY);
            var force = p5.Vector.sub(this.pos,mouseVec);
            force.normalize();
            force.mult(2);

            this.vel.add(force);
        }

        this.pos.add(this.vel);

        //topページでは画面外へ出たら反対側から出てくる
        if(!in_works &&  !in_about){
            if(this.pos.x < 0 || this.pos.x > width){
                var x = width - this.pos.x;
    
                this.pos.set(x,this.pos.y);
            }
            if(this.pos.y < 0 || this.pos.y > height){
                var y = height - this.pos.y;
    
                this.pos.set(this.pos.x,y);
            }

            //摩擦で停止
            this.vel.mult(this.fric);
        }
        //work,aboutでは画面外にでたら停止（無駄な計算の抑止？）
        else{
            if(this.pos.x < -200 || this.pos.x > width+200 || this.pos.y < -200 || this.pos.y > height+200){
                this.vel.set(0,0);
            }
        }
    }

    draw(){
        fill(0,20);
        noStroke();
        ellipse(this.pos.x, this.pos.y, this.r, this.r);
    }
}

class DrawParticle{
    constructor(_x,_y){
      this.pos = createVector(_x*10,_y*10);
      this.afterPosX = new Array();
      this.afterPosY = new Array();
      
      for(var i=0;i<posNum;i++){
          this.afterPosX[i] = this.pos.x;
          this.afterPosY[i] = this.pos.y;
      }

      this.fpos = createVector(this.pos.x*100,this.pos.y*100);
      //初速に少しばらつきを持たせる
      this.vel = createVector(_x,_y);
    //   this.vel.mult(random(1));
      this.vel.rotate(random(-PI/10,PI/10));

      this.fric = 0.9895;
      this.noiseArg = random(100); //ノイズの引数に使う

      this.offset = 160;
      this.delta = 0.06; //パーティクルの移動量
    }
    
    update(){
        //pattern1
        // 範囲内でランダム(noise)に動き回る計算
        var xmin = this.offset - (this.fpos.x - this.pos.x);
        var xmax = 2*this.offset - xmin;

        var ymin = this.offset - (this.fpos.y - this.pos.y);
        var ymax = 2*this.offset - ymin;

        var x = map(noise(this.noiseArg),0,1,-xmin,xmax);
        var y = map(noise(this.noiseArg),0,1,-ymin,ymax);

        var v = createVector(x,y);
        this.vel.add(v);
        // this.vel.set(x,y);
        this.vel.mult(this.delta);

        //pattern2
        //速度ベクトルをランダムに少しづつ回転
        // var rot = map(noise(this.noiseArg)*this.delta*2 - this.delta,-this.delta,this.delta,-0.015*PI,0.015*PI);
        // this.vel.rotate(rot);


        this.pos.add(this.vel);

        this.afterPosX.unshift(this.pos.x);
        this.afterPosY.unshift(this.pos.y);

        if(this.afterPosX.length>posNum*interval){
            this.afterPosX.pop(this.pos.x);
            this.afterPosY.pop(this.pos.y);
        }
        
        //摩擦
        // this.vel.mult(this.fric);
       
        this.noiseArg += 0.005;
    }
}
function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
    background(250,250,250);
    // endDraw = false;
    // count = 0;
    // dp.length = 0;
    // fill(250,10);
    // noStroke();
    // rect(0, 0, windowWidth, windowHeight);
    // drawInit();
}
function drawInit(){
    angle = TWO_PI / vertexNum;
    for(var i=0;i<vertexNum;i++){
        var fvel = new createVector(1,0);
        fvel.rotate(angle*i);
        fvel.mult(0.12);

        var _dp = new DrawParticle(fvel.x,fvel.y);
        dp.push(_dp);
    }
    // fill(255,10);
    // noStroke();
    // rect(0, 0, windowWidth, windowHeight);
}

function floatInit(){
    for(var i=0;i<fpNum;i++){
        var _fp = new FloatParticle();
        fp.push(_fp);
    }
}


function setup(){
    canvas = createCanvas(windowWidth,windowHeight);
    canvas.parent('p5canvas');
    background(250,250,250);
    centerX = width/2;
    drawInit();
    $('#defaultCanvas0').fadeIn(2000);
    
}

function draw(){
    //workに行く時に散る
    $('.menu #work,.menu #about,.menu #contact').on('click',function(){
        for(var i=0;i<fp.length;i++){
            var centerVec = createVector(width/2,height/2);
            var newVel = p5.Vector.sub(fp[i].pos,centerVec);
            // var newVel = createVector(random(-1,1),random(-1,1));
            newVel.normalize();
            newVel.mult(100);
            fp[i].vel.set(newVel.x,newVel.y);
        }
    });
    //topに行く時再生成
    $('#I,.menu #top').on('click',function(){
        for(var i=0;i<fp.length;i++){
            fp[i].pos = createVector(random(width),random(height));
            fp[i].vel = createVector(random(-1,1),random(-1,1));
            fp[i].vel.normalize();
            fp[i].vel.mult(100);
        }
    });

    //背景に関する処理
    if(in_works){
        background(250,250,250,18);
    }
    else{
        var a = dist(centerX,height/2,mouseX,mouseY);
        if(a>150) a = 18;
        else a = 0;
        background(250,a);
    }

    //漂流物
    var clearFlag = true;
    for(var i=0;i<fp.length;i++){
        fp[i].update();
        fp[i].draw();
    

        //近いやつをつなぐ
        stroke(0,20);
        noFill();
        var lastDist = 0; //前回決定した距離を保管
        for(var j=0;j<lineNum;j++){
            var minId = 0;
            var minDist = 9999;
            for(var k=0;k<fp.length;k++){
                var len = p5.Vector.dist(fp[i].pos,fp[k].pos);
                if(j!=k && len<minDist && len>lastDist){
                    minDist = len;
                    minId = k;
                }
            }
            lastDist = minDist;
            line(fp[i].pos.x,fp[i].pos.y,fp[minId].pos.x,fp[minId].pos.y);   
        }
    }

    //メインビジュアル
    if(in_works) stroke(250,40);
    else stroke(0,40);
    strokeWeight(0.5);
    noFill();

    for(var i=0;i<dp.length;i++){
        dp[i].update();
    }
    
    // 反転回数分描画
    push();
    translate(centerX,height/2);
    for(var i=0;i<invertNum;i++){

        beginShape();

        curveVertex(dp[dp.length-1].pos.x,dp[dp.length-1].pos.y);
        for(var k=0;k<dp.length;k++){
            curveVertex(dp[k].pos.x, dp[k].pos.y);
        }
        curveVertex(dp[0].pos.x, dp[0].pos.y);
        curveVertex(dp[1].pos.x, dp[1].pos.y);

        endShape();


        //残像分の処理
        for(var a=0;a<posNum*interval;a+=interval){
            beginShape();

            curveVertex(dp[dp.length-1].afterPosX[a],dp[dp.length-1].afterPosY[a]);
            for(var b=0;b<dp.length;b++){
                curveVertex(dp[b].afterPosX[a], dp[b].afterPosY[a]);
            }
            curveVertex(dp[0].afterPosX[a], dp[0].afterPosY[a]);
            curveVertex(dp[1].afterPosX[a], dp[1].afterPosY[a]);

            endShape();
        }

        rotate(2*PI / invertNum);
    }

    pop();

    count ++ ;

    //横にずらす
    if(count>160){
        centerX += (2.8*windowWidth/4 - centerX)*0.05;
    }
    //ページごとに表示非表示の処理
    var url = location.href;
    if(url.indexOf('work') != -1){
        in_works = true;
    }
    else{
        in_works = false;
    }
    if(url.indexOf('about') != -1){
        in_about = true;
    }
    else{
        in_about = false;
    }

    //コンテンツ表示
    if(count>220 && !endDraw){
        endDraw = true;
        $('.contents').fadeIn(2000);
        floatInit();
        // var url = location.href;
        // if(url.indexOf('about') == -1){ //aboutでのリロードでなければfpInit(workではもともと非表示)
        //     floatInit("top");
        // }
        // else{
        //     floatInit("about");
        // }
    }

}

// function mouseClicked(){
//     clickCount ++;
// }


