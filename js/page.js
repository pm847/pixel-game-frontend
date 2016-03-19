var cubeLen = 10;
var cubeNum = 100;

var canvas = $("#board")[0];

$(document).ready(function() {
	/*一開始send加入遊戲，請回傳相關資料*/
	$.ajax({
		url: "",
		type: "POST",
		dataType: "json",
		data: "要傳的",
		success: function(jdata) {
			alert("Success!");
		}
	});

	/*set canvas size and draw it*/
	canvas.width = cubeLen * cubeNum;
	canvas.height = cubeLen * cubeNum;

	/*Create a 2d array for board and */
	var arr_board = new Array(cubeNum);
	for(var i = 0; i < cubeNum; i++)
		arr_board[i] = new Array(cubeNum);
	
	for (var i = 0; i < cubeNum; i++)
		for (var j = 0; j < cubeNum; j++)
			arr_board[i][j] = false;

	/*Ajax決定是否收到訊息，並renew*/
	$.ajax({
		url: "http://172.17.183.204/board",//http://172.17.183.204/board
		type: "GET",
		dataType: "json",
		success: function(getJData) { //update該發亮的點為true
			var players = getJData.players;
			for (var i = 0; i < players.length; i++) {
				arr_board[players[i].x][players[i].y] = true;
			}
			drawBoard(arr_board);
		},

		error: function() {
			alert("ERROR!!!");
		}
	});

	/*使用者click之後，變色、紀錄位置、回傳位置*/
	//之後要增加判斷條件，不可以超過上下左右一格範圍
	$("#board").on("click", function(e) {
		setPos(e);
	});

});

/*畫棋盤*/
function drawBoard(arr_board) {
	var ctx = canvas.getContext("2d");

	ctx.strokeStyle = "#FFFFFF";//邊框白色
	for (var i = 0; i < canvas.width; i += cubeLen) {
		for (var j = 0; j < canvas.height; j += cubeLen) {
			ctx.strokeRect(i, j, cubeLen, cubeLen);//畫邊框
			ctx.fillStyle = arr_board[i/10][j/10] === true? "#000000" : "#7B7B7B";
			ctx.fillRect(i, j, cubeLen, cubeLen);
		}
	}
}

/*使用者click之後，判斷、設定、紀錄位置*/
//要加判斷條件
function setPos(e) {
	var clickX = parseInt(e.offsetX / 10);
	var clickY = parseInt(e.offsetY / 10);
	var ctx = $("#board")[0].getContext("2d");
	ctx.fillStyle = "#000000";
	ctx.fillRect(clickX * 10, clickY * 10, cubeLen, cubeLen);
}

//之後想增加動畫用
/*function onCube(e){
	var clickX = parseInt(e.offsetX / 10);
	var clickY = parseInt(e.offsetY / 10);
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "#000000";
	ctx.fillRect(clickX*10, clickY*10, cubeLen, cubeLen);
}*/