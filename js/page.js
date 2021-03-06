var cubeLen = 40;
var cubeNum = 25;

var userId, boardId, round = -1;
var userPos_X, userPos_Y, check = true;
var redCount = 1;

var canvas = $("#board")[0];

$(document).ready(function() {
	
	onStart();

	/*Create a 2d array for board and initial it*/
	var arr_board = new Array(cubeNum);
	for (var i = 0; i < cubeNum; i++)
		arr_board[i] = new Array(cubeNum);

	/*一開始加入遊戲，使用者輸入名稱，回傳server*/
	var userName = prompt("Please enter your name", "OpenStack");
	if (userName) userName = userName.trim();
	if (userName != null) {
		$.ajax({
			url: "http://172.17.183.204/api/user",
			type: "POST",
			dataType: "json",
			data: { name: userName },
			success: function(jdata) {
				userId = jdata.userId;
				boardId = jdata.boardId;

				getBoardData(arr_board);
			},
			error: function() {
				console.log("ERROR.");
			}
		});
	}

	setInterval(getBoardData, 1500, arr_board);

	/*使用者click之後，變色、紀錄位置、回傳位置*/
	//之後要增加換位置
	$("#board").on("click", function(e) {
		setPos(e);
	});

	window.onbeforeunload = function(e) {
		var user = {
			"userId": userId,
			"boardId": boardId
		};

		e.preventDefault();
		$.ajax({
			url: "http://172.17.183.204/api/user?user_id=" + userId + "&board_id=" + boardId,
			type: "DELETE",
			dataType: "json",
			data: user
		})
	};
});

/*初始畫布大小以及onload介面*/
function onStart() {
	/*set canvas size and draw it*/
	canvas.width = cubeLen * cubeNum;
	canvas.height = cubeLen * cubeNum;

	var ctx = canvas.getContext("2d");
	ctx.font = "80px Comic Sans MS";
	ctx.fillStyle = "red";
	ctx.textAlign = "center";
	ctx.fillText("Loading...", cubeLen * cubeNum / 2, cubeLen * cubeNum / 2);

}

/*剛進入遊戲和接下來不斷去找server要資料，確認局數相同，
  一旦不同，則更新所有棋盤資訊。*/
function getBoardData(arr_board) {
	/*Ajax決定是否收到棋盤整局訊息，並renew*/
	$.ajax({
		url: "http://172.17.183.204/api/board?board_id=" + boardId,
		type: "GET",
		dataType: "json",
		success: function(getJData) { //update true for light pos
			if (getJData.status === "win") //Game over
				gameOver();

			if (round !== getJData.round && check) { //if round changes, update all data
				round = getJData.round;

				var players = getJData.players;

				for (var i = 0; i < cubeNum; i++) //grey for default
					for (var j = 0; j < cubeNum; j++)
					arr_board[i][j] = false;

				for (var i = 0; i < players.length; i++) //green for other users
					arr_board[players[i].x][players[i].y] = true;

				for (var i = 0; i < getJData.goals.length; i++) //blue for goal
					arr_board[getJData.goals[i].x][getJData.goals[i].y] = "goal";

				for (var i = 0; i < players.length; i++) { //#32CD32 for user now
					if (players[i].id === userId) {
						userPos_X = players[i].x;
						userPos_Y = players[i].y;
					}
				}
				arr_board[userPos_X][userPos_Y] = "now";

				drawBoard(arr_board);
				redCount--;
			}
		},

		error: function() {

		}
	});
}

/*畫棋盤*/
function drawBoard(arr_board) {
	var ctx = canvas.getContext("2d");

	ctx.strokeStyle = "#FFFFFF"; //邊框白色
	for (var i = 0; i < parseInt(canvas.width / cubeLen); i++) {
		for (var j = 0; j < parseInt(canvas.height / cubeLen); j++) {
			ctx.strokeRect(i * cubeLen, j * cubeLen, cubeLen, cubeLen); //畫邊框
			ctx.fillStyle = arr_board[i][j] === true ? "#00FA9A" : "#7B7B7B";
			if (arr_board[i][j] === "now") ctx.fillStyle = "#32CD32";
			else if (arr_board[i][j] === "goal") ctx.fillStyle = "#5555FF";
			ctx.fillRect(i * cubeLen, j * cubeLen, cubeLen, cubeLen);
		}
	}
}

/*使用者click之後，判斷、設定、紀錄位置*/
function setPos(e) {
	var clickX = parseInt(e.offsetX / cubeLen);
	var clickY = parseInt(e.offsetY / cubeLen);
	var ctx = $("#board")[0].getContext("2d");

	if (redCount < 1) {
		if (clickX - userPos_X === 0 && Math.abs(clickY - userPos_Y) === 1 || clickY - userPos_Y === 0 && Math.abs(clickX - userPos_X) === 1) {
			ctx.fillStyle = "#FFFF00";
			ctx.fillRect(clickX * cubeLen, clickY * cubeLen, cubeLen, cubeLen);
			redCount++;

			var moveData = {
				"userId": userId,
				"boardId": boardId,
				"nextRound": round,
				"nextMoveX": clickX,
				"nextMoveY": clickY
			};

			//回傳新位置
			$.ajax({
				url: "http://172.17.183.204/api/board",
				type: "POST",
				dataType: "json",
				data: moveData,
				success: function(getJData) {

				},

				error: function() {

				}
			});
		}
	}
}

function gameOver() {
	check = false;
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, cubeNum * cubeLen, cubeNum * cubeLen);
	ctx.font = "80px Comic Sans MS";
	ctx.fillStyle = "red";
	ctx.textAlign = "center";
	ctx.fillText("Game Over!", cubeLen * cubeNum / 2, cubeLen * cubeNum / 2);

}