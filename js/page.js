var cubeLen = 10;
var cubeNum = 100;

var userId, boardId, round;
var userPos_X, userPos_Y, round = -1;
var redCount = 0;

var canvas = $("#board")[0];

$(document).ready(function() {
	/*set canvas size and draw it*/
	canvas.width = cubeLen * cubeNum;
	canvas.height = cubeLen * cubeNum;

	/*Create a 2d array for board and initial it*/
	var arr_board = new Array(cubeNum);
	for (var i = 0; i < cubeNum; i++)
		arr_board[i] = new Array(cubeNum);

	/*一開始加入遊戲，使用者輸入名稱，回傳server*/
	var userName = prompt("Please enter your name", "OpenStack").trim();
	if (userName != null) {
		$.ajax({
			url: "http://172.17.183.204/api/user", //http://172.17.183.204/api/user
			type: "POST",
			dataType: "json",
			data: userName,
			success: function(jdata) {
				console.log("Get userId: " + jdata.userId + " boardId: " + jdata.boardId + "!");
				userId = jdata.userId;
				boardId = jdata.boardId;

				getBoardData(arr_board);
			},
			error: function() {
				console.log("ERROR.");
			}
		});
	}

	setInterval(getBoardData, 1000, arr_board);

	/*使用者click之後，變色、紀錄位置、回傳位置*/
	//之後要增加換位置
	$("#board").on("click", function(e) {
		setPos(e);
	});

	/*window.onbeforeunload = function(e) {
		e.preventDefault();
		$.ajax({
			url: "a.json",
			type: "POST",
			dataType: "json",
			data: "leave"
		})
	};*/
});

/*剛進入遊戲和接下來不斷去找server要資料，確認局數相同，
  一旦不同，則更新所有棋盤資訊。*/
function getBoardData(arr_board) {
	/*Ajax決定是否收到棋盤整局訊息，並renew*/
	$.ajax({
		url: "http://172.17.183.204/api/board?board_id=" + boardId, //http://172.17.183.204/api/board?board_id=" + boardId
		type: "GET",
		dataType: "json",
		success: function(getJData) { //update該發亮的點為true
			if (round !== getJData.round) {
				round = getJData.round;

				var players = getJData.players;

				for (var i = 0; i < cubeNum; i++)
					for (var j = 0; j < cubeNum; j++)
						arr_board[i][j] = false;

				for (var i = 0; i < players.length; i++)
					arr_board[players[i].x][players[i].y] = true;

				for (var i = 0; i < players.length; i++) {
					if (players[i].id === userId) {
						userPos_X = players[i].x;
						userPos_Y = players[i].y;
					}
				}

				arr_board[userPos_X][userPos_Y] = "red";

				drawBoard(arr_board);
				redCount--;
				console.log(redCount);
			}
		},

		error: function() {
			console.log("ERROR!!!");
		}
	});
}

/*畫棋盤*/
function drawBoard(arr_board) {
	var ctx = canvas.getContext("2d");

	ctx.strokeStyle = "#FFFFFF"; //邊框白色
	for (var i = 0; i < canvas.width; i += cubeLen) {
		for (var j = 0; j < canvas.height; j += cubeLen) {
			ctx.strokeRect(i, j, cubeLen, cubeLen); //畫邊框
			ctx.fillStyle = arr_board[i / 10][j / 10] === true ? "#000000" : "#7B7B7B";
			if (arr_board[i / 10][j / 10] === "red") ctx.fillStyle = "#FF0000";
			ctx.fillRect(i, j, cubeLen, cubeLen);
		}
	}
}

/*使用者click之後，判斷、設定、紀錄位置*/
function setPos(e) {
	var clickX = parseInt(e.offsetX / 10);
	var clickY = parseInt(e.offsetY / 10);
	var ctx = $("#board")[0].getContext("2d");

	if (redCount < 1) {
		if (clickX - userPos_X === 0 && Math.abs(clickY - userPos_Y) === 1 || clickY - userPos_Y === 0 && Math.abs(clickX - userPos_X) === 1) {
			ctx.fillStyle = "#FF0000";
			ctx.fillRect(clickX * 10, clickY * 10, cubeLen, cubeLen);
			redCount++;
		}
	}

	var moveData = {
		"userId": userId,
		"boardId": boardId,
		"nextRound": round,
		"nextMove": {
			"x": clickX,
			"y": clickY
		}
	}

	//回傳新位置
	$.ajax({
		url: "http://172.17.183.204/api/board", //http://172.17.183.204/api/board
		type: "POST",
		dataType: "json",
		data: moveData,
		success: function(getJData) { //update該發亮的點為true
			console.log("DD");
		},

		error: function() {
			alert("ERROR!!!");
		}
	});
}