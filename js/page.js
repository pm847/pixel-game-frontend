var cubeLen = 10;
var cubeNum = 50;

var canvas = $("#board")[0];

$(document).ready(function() {
	//initial a 2d array for board
	var arr_board = new Array(cubeNum * cubeLen);
	for (var i = 0; i < cubeNum; i++)
		for (var j = 0; j < cubeNum; j++)
			arr_board[i, j] = false;

	//Ajax決定是否收到訊息，並renew
	/*$.getJSON("testdata.json", function(data){
		alert(data.employees[0].firstName);
	});*/
	$.ajax({
		url: "testdata.json",
		type: "GET",
		dataType: "json",
		success: function(result) {
			alert(result.id);//update發亮的位置
		},

		error: function() {
			alert("ERROR!!!");
		}
	});


	//傳入的JSON資料, update array

	//set canvas size and draw it
	canvas.width = cubeLen * cubeNum;
	canvas.height = cubeLen * cubeNum;
	drawBoard();

	/*$("#board").mousemove(function(e){
		onCube(e);
	})*/
	$("#board").on("click", function(e) {
		setPos(e);
	});

});

function drawBoard() {
	var ctx = canvas.getContext("2d");

	//background Rect
	ctx.fillStyle = "#7B7B7B";
	ctx.fillRect(0, 0, canvas.width, canvas.height);

	//Cut Small Rect
	ctx.strokeStyle = "#FFFFFF";
	for (var i = 0; i < canvas.width; i += cubeLen) {
		for (var j = 0; j < canvas.height; j += cubeLen) {
			ctx.strokeRect(i, j, cubeLen, cubeLen);
			//if else 未來加入不同顏色的方塊(有人)
		}
	}

}

//user's mouse click position
function setPos(e) {
	var clickX = parseInt(e.offsetX / 10);
	var clickY = parseInt(e.offsetY / 10);
	var ctx = $("#board")[0].getContext("2d");
	ctx.fillStyle = "#000000";
	ctx.fillRect(clickX * 10, clickY * 10, cubeLen, cubeLen);
}

/*function onCube(e){
	var clickX = parseInt(e.offsetX / 10);
	var clickY = parseInt(e.offsetY / 10);
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "#000000";
	ctx.fillRect(clickX*10, clickY*10, cubeLen, cubeLen);
}*/