(function(){

  function Board(x) { // Constructor
    switch (x) {
      case "5":
        this.x = 5;
        this.y = 5;
        this.mine = 2;
        break;

      case "9":
        this.x = 9;
        this.y = 9;
        this.mine = 10;
        break;

      case "16":
        this.x = 16;
        this.y = 16;
        this.mine = 40;
        break;

      default:
        this.x = 9;
        this.y = 9;
        this.mine = 10;
        break;
    }

  	return this;
  }

  var boardInfo = new Board();

  newGame();

  function newGame() {
    // hide dialogs
    $(".gameover-dialog").addClass("hide");
    $(".youwon-dialog").addClass("hide");

    // initialize dataSet with gameboard size and put 0 as the first value
    var dataSet = Array.apply(null, Array(boardInfo.x)).map(function () {
      return Array.apply(null, Array(boardInfo.y)).map(function () {return 0;});});

    console.log(dataSet);

    window.dataSet = setMine(boardInfo, dataSet);

    var gameboard = createGameboard(boardInfo);

    console.log(dataSet);

    $("#gameboard").html(gameboard);
  }

  /**
    Set mines to dataSet
  */
  function setMine(boardInfo, dataSet) {

    var mineNum = 0;
    while (mineNum < boardInfo.mine) {

      var mineLocation = Math.floor(Math.random () * boardInfo.x * boardInfo.y);

      var xLocation = Math.floor(mineLocation/boardInfo.x);
      var yLocation = Math.floor(mineLocation - (xLocation * boardInfo.y));
      if(dataSet[xLocation][yLocation] == "mine"){
        continue;
      } else {
        dataSet[xLocation][yLocation] = "mine";
      }

      var calcValueArr = [-1,0,+1];

      for (var i = 0; i < calcValueArr.length; i++) {
        var xTarget = xLocation + calcValueArr[i];

        if (xTarget < 0) {
          continue;
        } else if (boardInfo.x <= xTarget){
          continue;
        }

        for (var j = 0; j < calcValueArr.length; j++) {
          var yTarget = yLocation + calcValueArr[j];

          if (yTarget < 0) {
            continue;
          } else if (boardInfo.y <= yTarget){
            continue;
          }

          if (dataSet[xTarget][yTarget] != "mine") {
            dataSet[xTarget][yTarget] += 1;
          }
        }
      }
      mineNum++;
    }

    return dataSet;

  }
  /**
    create minesweeper gameboard
    @param {boardInfo} size of gameboard
   */
  function createGameboard(size) {
    var table = $("<table></table>");
    for (var i = 0; i < size.y; i++) {
      var tr = $("<tr></tr>");
      for(var j = 0; j < size.x; j++){
        $(tr).append(
          $("<td></td>", {
            addClass: "field before"
          })
        )
      }
      table = $(table).append(tr);
    }
    console.log($(table).html());
    return table;
  }

  function checkDataSet(dataSet, x, y) {
    if (x < 0 || y < 0) {
      return;
    }
    return dataSet[x][y];
  }

  function getExpandIdx (dataSet, x, y) {
    var expandIndex = [];
    var calcValueArr = [-1,0,+1];

    for (var i = 0; i < calcValueArr.length; i++) {
      var xTarget = x + calcValueArr[i];

      if (xTarget < 0) {
        continue;
      } else if (boardInfo.x <= xTarget){
        continue;
      }

      for (var j = 0; j < calcValueArr.length; j++) {
        var yTarget = y + calcValueArr[j];

        if (yTarget < 0) {
          continue;
        } else if (boardInfo.y <= yTarget){
          continue;
        }

        if (dataSet[xTarget][yTarget] != "mine") {
          expandIndex.push([xTarget,yTarget,]);
        } else {
          return expandIndex;
        }
      }
    }
    return expandIndex;
  }

  function dispGameOver() {
    $(".gameover-dialog").removeClass("hide");
  }

  function expand(node, ignoreMineFlg) {
    var x = $(node).index();
    var y = $(node).parent().index();

    if ($(node).hasClass("suspect")) {
      return;
    } else if ($(node).hasClass("after")){
      return;
    }

    var result = checkDataSet(dataSet, x, y);

    if (result == "mine") {
      if (ignoreMineFlg) {
        hitMine(node);
      }

      return;
    }

    if (result == 0) {
      $(node).removeClass("before").addClass("after");
      var prevCell = $(node).prev();
      var nextCell = $(node).next();
      var upCell = $(node).parent().prev().children().eq(x);
      var belowCell = $(node).parent().next().children().eq(x);
      var leftUpCell = $(upCell).prev();
      var rightUpCell = $(upCell).next();
      var leftBelowCell = $(belowCell).prev();
      var rightBelowCell = $(belowCell).next();

      expand(prevCell);
      expand(nextCell);
      expand(upCell);
      expand(belowCell);
      expand(leftUpCell);
      expand(rightUpCell);
      expand(leftBelowCell);
      expand(rightBelowCell);

    } else {
      node.removeClass("before").addClass("after").html(result);
    }
  }

  function expandAroundSuspectedCell(node, x, y, result) {
    var prevCell = $(node).prev();
    var nextCell = $(node).next();
    var upCell = $(node).parent().prev().children().eq(x);
    var belowCell = $(node).parent().next().children().eq(x);
    var leftUpCell = $(upCell).prev();
    var rightUpCell = $(upCell).next();
    var leftBelowCell = $(belowCell).prev();
    var rightBelowCell = $(belowCell).next();

    var sum = 0;
    if($(prevCell).hasClass("suspect")) {
      sum += 1;
    }

    if($(nextCell).hasClass("suspect")) {
      sum += 1;
    }

    if($(upCell).hasClass("suspect")) {
      sum += 1;
    }

    if($(belowCell).hasClass("suspect")) {
      sum += 1;
    }

    if($(leftUpCell).hasClass("suspect")) {
      sum += 1;
    }

    if($(rightUpCell).hasClass("suspect")) {
      sum += 1;
    }

    if($(leftBelowCell).hasClass("suspect")) {
      sum += 1;
    }

    if($(rightBelowCell).hasClass("suspect")) {
      sum += 1;
    }

    if (result != sum) {
      return;
    }

    expandIgnoreMine(prevCell);
    expandIgnoreMine(nextCell);
    expandIgnoreMine(upCell);
    expandIgnoreMine(belowCell);
    expandIgnoreMine(leftUpCell);
    expandIgnoreMine(rightUpCell);
    expandIgnoreMine(leftBelowCell);
    expandIgnoreMine(rightBelowCell);
  }

  function expandIgnoreMine(node) {
    expand(node, true);
  }

  function hitMine(node) {
    $(node).removeClass("before").addClass("after").addClass("mine");
    dispGameOver();
  }

  function hasGameFinished() {

    // game finish
    if($("#gameboard .field.before").length == 0) {
      var suspected = $(".suspect");
      if (!suspected) {
        return;
      }

      if (suspected.length != boardInfo.mine) {
        return;
      }

      for (var i = 0; i < suspected.length; i++) {
        var x = $(suspected).index();
        var y = $(suspected).parent().index();

        if(dataSet[x][y] == "mine"){
          continue;
        } else {
          return;
        }
      }
      $(".youwon-dialog").removeClass("hide");
    }
  }

  $("#gameboard").on("click", "td", function(){

    if ($(this).hasClass("suspect")) {
      return;
    }

    var x = $(this).index();
    var y = $(this).parent().index();
    console.log("x:" + x);
    console.log("y:" + y);

    var result = checkDataSet(dataSet, x, y);

    if (result == "mine") {
      hitMine(this);

    } else if (result == 0) {
      expand(this);

    } else if ($(this).hasClass("after")) {
      expandAroundSuspectedCell(this, x, y, result);

    } else {
      $(this).removeClass("before").addClass("after").html(result);
    }

    hasGameFinished();

  });

  $("#gameboard").on("contextmenu", "td", function() {

    if ($(this).hasClass("after")) {
      var x = $(this).index();
      var y = $(this).parent().index();
      console.log("x:" + x);
      console.log("y:" + y);

      var result = checkDataSet(dataSet, x, y);

      expandAroundSuspectedCell(this, x, y, result);
      return false;
    }

    if ($(this).hasClass("suspect")) {
      $(this).removeClass("suspect").addClass("before");
    } else {
      $(this).removeClass("before").addClass("suspect");
    }
    hasGameFinished();
    return false;
  });

  $("#new-game").on("click",function(){
    newGame();
  });

  $(".level").on("click", function(){
    boardInfo = new Board($(this).attr("data-level"));
    newGame();
  });


})(jQuery);
