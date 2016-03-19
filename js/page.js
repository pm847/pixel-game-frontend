var cubeLen = 10;
var cubeNum = 100;

var userId, boardId;
var redCount = 0;

var canvas = $("#board")[0];

$(document).ready(function() {
	/*一開始加入遊戲，使用者輸入名稱，回傳server*/
	var userName = prompt("Please enter your name", "OpenStack").trim();
	if (userName === "") {
		alert("Empty name.");
	} else if (userName != null) {
		$.ajax({
			url: "http://172.17.183.204/api/user",
			type: "POST",
			dataType: "json",
			data: userName,
			success: function(jdata) {
				alert("Get userId & boardId!");
				userId = jdata.userId; //照理應該要得到userID和roomID
				boardId = jdata.boardId;
			},
			error: function() {
				alert("ERROR.");
			}
		});
	}

	/*set canvas size and draw it*/
	canvas.width = cubeLen * cubeNum;
	canvas.height = cubeLen * cubeNum;

	/*Create a 2d array for board and */
	var arr_board = new Array(cubeNum);
	for (var i = 0; i < cubeNum; i++)
		arr_board[i] = new Array(cubeNum);

	for (var i = 0; i < cubeNum; i++)
		for (var j = 0; j < cubeNum; j++)
			arr_board[i][j] = false;

	/*Ajax決定是否收到棋盤整局訊息，並renew*/
	var userPos_X, userPos_Y;
	var random = Math.random;
	$.ajax({
		url: "http://172.17.183.204/api/board?board_id=" + boardId + "&cb=" + random, //http://172.17.183.204/board
		type: "GET",
		dataType: "json",
		success: function(getJData) { //update該發亮的點為true
			var players = getJData.players;
			for (var i = 0; i < players.length; i++)
				arr_board[players[i].x][players[i].y] = true;

			drawBoard(arr_board);

			//設定該使用者的現在位置userPos_X = players
			for (var player in players) {
				if (player.id === "userId") {
					alert(player.x + " " + player.y);
					userPos_X = player.x;
					userPos_Y = player.y;
				}
			}
		},

		error: function() {
			alert("ERROR!!!");
		}
	});

	userPos_X = 54;
	userPos_Y = 33;

	/*使用者click之後，變色、紀錄位置、回傳位置*/
	//之後要增加判斷條件，不可以超過上下左右一格範圍
	$("#board").on("click", function(e) {
		var clickX = parseInt(e.offsetX / 10);
		var clickY = parseInt(e.offsetY / 10);
		var ctx = $("#board")[0].getContext("2d");

		if (redCount < 1) {
			if (clickX - userPos_X === 0 && Math.abs(clickY - userPos_Y) === 1 || clickY - userPos_Y === 0 && Math.abs(clickX - userPos_X) === 1) {
				lastCubeColor = arr_board[userPos_X][userPos_Y];
				lastX = clickX;
				lastY = clickY;
				console.log(lastCubeColor + " " + userPos_X + " " + userPos_Y);
				ctx.fillStyle = "#FF0000";
				ctx.fillRect(clickX * 10, clickY * 10, cubeLen, cubeLen);
				redCount++;
			}
		} /*var lastCubeColor, lastX, lastY;
			else if (redCount === 1) {
			if (clickX - userPos_X === 0 && Math.abs(clickY - userPos_Y) === 1 || clickY - userPos_Y === 0 && Math.abs(clickX - userPos_X) === 1) {
				ctx.fillStyle = lastCubeColor ? "#000000" : "#7B7B7B";
				ctx.fillRect(lastX * 10, lastY * 10, cubeLen, cubeLen);
				ctx.fillStyle = "#FF0000";
				ctx.fillRect(clickX * 10, clickY * 10, cubeLen, cubeLen);
				console.log(lastCubeColor);
			}
		}*/



		//回傳新位置
		$.ajax({
			url: "http://172.17.183.204/api/board", //http://172.17.183.204/board
			type: "POST",
			dataType: "json",
			data: "要傳的",
			success: function(getJData) { //update該發亮的點為true

			},

			error: function() {
				alert("ERROR!!!");
			}
		});
	});
});

/*畫棋盤*/
function drawBoard(arr_board) {
	var ctx = canvas.getContext("2d");

	ctx.strokeStyle = "#FFFFFF"; //邊框白色
	for (var i = 0; i < canvas.width; i += cubeLen) {
		for (var j = 0; j < canvas.height; j += cubeLen) {
			ctx.strokeRect(i, j, cubeLen, cubeLen); //畫邊框
			ctx.fillStyle = arr_board[i / 10][j / 10] === true ? "#000000" : "#7B7B7B";
			ctx.fillRect(i, j, cubeLen, cubeLen);
		}
	}
}

/*使用者click之後，判斷、設定、紀錄位置*/
/*function setPos(e) {

}*/
//之後想增加動畫用
/*function onCube(e){
	var clickX = parseInt(e.offsetX / 10);
	var clickY = parseInt(e.offsetY / 10);
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "#000000";
	ctx.fillRect(clickX*10, clickY*10, cubeLen, cubeLen);
}*/