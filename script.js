var mouseEvent;
var canvas, ctx;
var circlePos, radius;
var rectPos, rectSize;
var speed;

var mouse = new Object();
mouse.update = handleMouseMove;
mouse.x = -1; mouse.y = -1;

function handleMouseMove(event){
	mouse.x = event.clientX - canvas.getBoundingClientRect().left;
	mouse.y = event.clientY - canvas.getBoundingClientRect().top;
	console.log("a")
}



function start(){
	setInterval(update,30);
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext('2d');
	ctx.font = "12px arial";
	canvas.onmousemove = mouse.update;
	rectPos = new Vector(150,200);
	rectSize = new Vector(200,100);
	circlePos = new Vector(0,0);
	radius = 50;
	speed = 6;
}


function update(){
	var temp = circlePos.clone();
	temp.scale(-1);
	temp.addVec(mouse);//now is offset from pos to mouse
	if(temp.getLength() <= speed){
		circlePos.assign(mouse);
	}
	else{
		temp.setLength(speed);
		circlePos.addVec(temp);
	}
	
	doIntersect();

	draw();
}

function draw(){
	ctx.clearRect(0,0,canvas.width,canvas.width);
	ctx.strokeRect(0,0,500,500);
	ctx.beginPath();
	ctx.arc(circlePos.x, circlePos.y, radius, 0, 2 * Math.PI, true);
	ctx.fillStyle="rgba(255,0,0,0.5)";
	ctx.fill();
	ctx.fillStyle="rgb(0,0,60)";
	ctx.fillRect(rectPos.x,rectPos.y,rectSize.x,rectSize.y);
	ctx.fillStyle="rgba(255,0,0,0.5)";
	ctx.fill();
}

function doIntersect(){
	var rectCorn = rectPos.clone();
	rectCorn.addVec(rectSize);//is now the far corner of the rectangle
	var xState, yState;
	if(circlePos.x <= rectPos.x - radius){xState=0;}
	else if(circlePos.x <= rectPos.x){xState=1;}
	else if(circlePos.x <= rectCorn.x){xState=2;}
	else if(circlePos.x <= rectCorn.x + radius){xState=3;}
	else{xState=0;}

	if(circlePos.y <= rectPos.y - radius){yState=0;}
	else if(circlePos.y <= rectPos.y){yState=1;}
	else if(circlePos.y <= rectCorn.y){yState=2;}
	else if(circlePos.y <= rectCorn.y + radius){yState=3;}
	else{yState=0;}

	if(xState == 0 || yState == 0){return;}
	
	if(xState == 2){
		if(yState == 1){
			circlePos.y = rectPos.y - radius;
			return;
		}
		if(yState == 3){
			circlePos.y = rectCorn.y + radius;
			return;
		}
	}

	if(yState == 2){
		if(xState == 1){
			circlePos.x = rectPos.x - radius;
			return;
		}
		if(xState == 3){
			circlePos.x = rectCorn.x + radius;
			return;
		}
	}
	

	if(xState == 1 && yState == 1){//topleft
		var temp = rectPos.clone();
		temp.scale(-1);	
		temp.addVec(circlePos);//distance from corner to circle center	
		if(temp.getLength() < radius){
			temp.setLength(radius);
			circlePos.assign(temp);
			circlePos.addVec(rectPos);
		}
		return;
	}
	if(xState == 1 && yState == 3){//bottomleft
		var temp = rectPos.clone();
		temp.add(0,rectSize.y);
		temp.scale(-1);	
		temp.addVec(circlePos);
		if(temp.getLength() < radius){
			temp.setLength(radius);
			circlePos.assign(temp);
			circlePos.addVec(rectPos);
			circlePos.add(0,rectSize.y);
		}
		return;
	}
	if(xState == 3 && yState == 1){//topright
		var temp = rectPos.clone();
		temp.add(rectSize.x,0);
		temp.scale(-1);	
		temp.addVec(circlePos);
		if(temp.getLength() < radius){
			temp.setLength(radius);
			circlePos.assign(temp);
			circlePos.addVec(rectPos);
			circlePos.add(rectSize.x,0);
		}
		return;
	}
	if(xState == 3 && yState == 3){//bottomRight
		var temp = rectCorn.clone();
		temp.scale(-1);	
		temp.addVec(circlePos);
		if(temp.getLength() < radius){
			temp.setLength(radius);
			circlePos.assign(temp);
			circlePos.addVec(rectCorn);
		}
		return;
	}

	//this means the center of the circle is inside the rect
	//no need to check, because return statements

	var temp = rectPos.clone();
	temp.addVec(rectCorn);
	temp.scale(1/2);//is now center of rect
	temp.scale(-1);	
	temp.addVec(circlePos);
	//is now distance from rectCenter to circleCenter
	if(Math.abs(temp.x) / rectSize.x > Math.abs(temp.y) / rectSize.y){
		if(temp.x > 0){
			circlePos.x = rectCorn.x + radius;
		}
		else{
			circlePos.x = rectPos.x - radius;
		}
	}
	else{
		if(temp.y > 0){
			circlePos.y = rectCorn.y + radius;
		}
		else{
			circlePos.y = rectPos.y - radius;
		}
	}
}



function growCircle(){radius += 3;}
function shrinkCircle(){radius -= 3; if(radius < 1){radius = 1;}}
function speedUp(){speed += 2;}
function slowDown(){speed -= 2; if(speed < 1){speed = 1;}}
function rxp(){rectPos.x  += 5;}
function rxm(){rectPos.x  -= 5;}
function ryp(){rectPos.y  += 5;}
function rym(){rectPos.y  -= 5;}
function rwp(){rectSize.x += 5;}
function rwm(){rectSize.x -= 5;}
function rhp(){rectSize.y += 5;}
function rhm(){rectSize.y -= 5;}
