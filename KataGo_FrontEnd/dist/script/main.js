var completeAnalysisResponse;
var currentChart = null;
function getCompleteAnalysisResponse() {
  return this.completeAnalysisResponse;
}
function setCompleteAnalysisResponse(completeAnalysisResponse) {
  this.completeAnalysisResponse = completeAnalysisResponse;
}

// Close left bubble yb removing the element from thhe DOM tree.
function closeLeftBubble() {
  var bubble = document.getElementById('glassLeft');
  bubble.style.opacity = 0;
}

// allows to show the respective Bubble
function showBubble(bubble) {
  bubble.style.opacity = 1;
}

// Close right bubble yb removing the element from thhe DOM tree.
function closeRightBubble() {
  var bubble = document.getElementById('glassRight');
  bubble.remove();
}
// The drag-area stays the same.
const dropArea = document.querySelector('.drag-area');
let file; // this is the acutal file from the user. (Global variable)
// The grid where the stones are placed.
const grid = document.querySelector('.division');
// variable saves the first result of the sgf file. Others are not considered.
var resultQueryFileFormatted = [];
/**
 * User Drags file over the area.
 */
dropArea.addEventListener('dragover', (event) => {
  event.preventDefault(); // Disable default behaviour.
  document.getElementById('drag_area').style.border = '2px solid #adefd1ff';
  dropArea.classList.add('active');
});
/**
 * User leaves dragged file Drags file outside the area.
 */
dropArea.addEventListener('dragleave', () => {
  if (file == null) {
    document.getElementById('drag_area').style.border = '2px dashed #ffffff';
  }
  dropArea.classList.remove('active');
});
const regex = /(B|W)\[[a-z][a-z]\]/g;
const regexKomi = /KM\[.*?\]/g;
const regexPlayerWhite = /PW\[.*?\]/g;
const regexPlayerBlack = /PB\[.*?\]/g;
const regexWinner = /RE\[.*?\]/g;
var komi = [];
var whitePlayer = [];
var blackPlayer = [];
var winner = [];
/**
 * User droped the file inside the area.
 */
dropArea.addEventListener('drop', (event) => {
  event.preventDefault(); // Disable default behaviour.
  file = event.dataTransfer.files[0];
  var flag = 1;
  resultQueryFileFormatted = [];
  let fileType = file.type;

  let validExtensions = ['text/plain']; // Validation of the data Type.

  if (validExtensions.includes(fileType) || file.name.includes('.sgf')) {
    let fileReader = new FileReader(); // Creating a file reader object.

    fileReader.onload = (event) => {
      fileContent = event.target.result;
      const allLines = fileContent.split(/\r?\n/);
      var element = '';
      var flag = 1;
      var arr = [];

      // Reading line by line
      allLines.forEach((line) => {
        if (line.includes('KM')) {
          komi = [...line.matchAll(regexKomi)];
        }
        if (line.includes('PB')) {
          blackPlayer = [...line.matchAll(regexPlayerBlack)];
        }
        if (line.includes('PW')) {
          whitePlayer = [...line.matchAll(regexPlayerWhite)];
        }
        if (line.includes('RE')) {
          winner = [...line.matchAll(regexWinner)];
        }
        element = element + line;

        if (line.includes('])')) {
          const array = [...element.matchAll(regex)];
          arr.push(array);
          element = '';
        }
      });
      arr[0].forEach((element) => resultQueryFileFormatted.push(element[0]));
    };

    fileReader.onerror = (event) => {
      alert(event.target.error.name);
    };

    fileReader.readAsText(file);
  } else {
    alert('Not a valid file. Please feed me with a txt or SGF file.');
  }
});

grid.addEventListener('click', printPosition);

/**
 * Get the position of the curser to the respective grid.
 * @param {Event} e
 * @returns x an y coordinates of the cursor relative to the divisible grid.
 */
function getPosition(e) {
  //var poisi = document.getElementById('gridArea').getBoundingClientRect();

  var rect = e.target.getBoundingClientRect();

  var x = e.clientX - rect.left;
  var y = e.clientY - rect.top;

  return {
    x,
    y,
  };
}
/**
 * Function allows to return the card. Returns to the drag & and drop area.
 */
function backToDragAndDrop() {
  var current = document.getElementById('card');
  var analyseButton = document.getElementById('analyseButton');
  current.classList.remove('active');
  analyseButton.style.display = 'block';
}

var currentValue = 0;
/**
 * Function allows to place the next move. Only accessible in detection mode.
 * Checks if there is a previous move. (The moves are from the sgf txt file.)
 */
function backwards() {
  if (this.currentValue == 0) {
    changeLeftBubbleTextError('Error', 'There are no previous moves.');
  } else {
    clearBoard();
    currentValue--;

    setSummary(
      currentValue,
      this.currentJsonObject.getHowManyMovesWherePlayedUntilCertainPoint(
        'w',
        currentValue
      ),
      this.currentJsonObject.getHowManyMovesWherePlayedUntilCertainPoint(
        'b',
        currentValue
      ),
      this.currentJsonObject.getKomi(),
      this.currentJsonObject.getWinner(),
      this.currentJsonObject.getPlayerNameWhite(),
      this.currentJsonObject.getPlayerNameBlack()
    );
    for (i = 0; i < currentValue; i++) {
      placeStone(
        this.currentJsonObject.moves[i].x,
        this.currentJsonObject.moves[i].y,
        this.currentJsonObject.moves[i].player,
        i
      );
    }
  }
}
/**
 * Function allows to place the next move from the sgf or txt file.
 */
function forwards() {
  var len = this.currentJsonObject.getTotalNumberOfMovesPlayed();
  if (this.currentValue == len) {
    changeLeftBubbleTextError('Error', 'There are no more moves available.');
  } else {
    clearBoard();
    currentValue++;

    setSummary(
      currentValue,
      this.currentJsonObject.getHowManyMovesWherePlayedUntilCertainPoint(
        'w',
        currentValue
      ),
      this.currentJsonObject.getHowManyMovesWherePlayedUntilCertainPoint(
        'b',
        currentValue
      ),
      this.currentJsonObject.getKomi(),
      this.currentJsonObject.getWinner(),
      this.currentJsonObject.getPlayerNameWhite(),
      this.currentJsonObject.getPlayerNameBlack()
    );

    for (i = 0; i < currentValue; i++) {
      placeStone(
        this.currentJsonObject.moves[i].x,
        this.currentJsonObject.moves[i].y,
        this.currentJsonObject.moves[i].player,
        i
      );
    }
  }
}

/**
 * Function allows to change the text of the left bubble.
 * @param {*} titleP The title of the error.
 * @param {*} textP The additional text of the error.
 */
function changeLeftBubbleTextError(titleP, textP) {
  var bubble = document.getElementById('glassLeft');
  showBubble(bubble);
  var title = document.getElementById('leftTitle');
  title.style.color = '#ff5e5e';
  var text = document.getElementById('leftText');
  title.innerHTML = titleP;
  text.innerHTML = textP;
  text.style.color = '#ff5e5e';
}

/**
 * Function allows to analyse a specific game from a txt or sgf file.
 * Function is executed if clicked on the analyse button.
 * Checks if there is a file and displays an error in the left bubble.
 */
function analyse() {
  if (file == null) {
    document.getElementById('drag_area').style.border = '2px dashed #ff5e5e';
    changeLeftBubbleTextError('Error', 'No file selected!');
  } else {
    var current = document.getElementById('card');
    var analyseButton = document.getElementById('analyseButton');

    current.className += ' active';
    analyseButton.style.display = 'none';
    var boardSize = new BoardSize(19, 19);
    var jsonObject = new QueryObject(boardSize);
    jsonObject.setMovesForCompleteGameAnalysis(resultQueryFileFormatted);
    jsonObject.setMovesToAnalyseCompleteGame(
      0,
      resultQueryFileFormatted.length
    );
    if (komi.length > 0) {
      jsonObject.setKomi(komi[0][0]);
    }
    if (winner.length > 0) jsonObject.setWinner(winner[0][0]);
    if (blackPlayer.length > 0)
      jsonObject.setPlayerNameBlack(blackPlayer[0][0]);
    if (whitePlayer.length > 03)
      jsonObject.setPlayerNameWhite(whitePlayer[0][0]);

    setSummary(
      jsonObject.getTotalNumberOfMovesPlayed(),
      jsonObject.getTotalNumberOfMovesPlayedByX('white'),
      jsonObject.getTotalNumberOfMovesPlayedByX('black'),
      getTextBetweenBrackets(jsonObject.getKomi()),
      getTextBetweenBrackets(jsonObject.getWinner()),
      getTextBetweenBrackets(jsonObject.getPlayerNameWhite()),
      getTextBetweenBrackets(jsonObject.getPlayerNameBlack())
    );
    postMultiAnalysisRequest(jsonObject);
  }
}

/**
 * Function which allows to set the summary of the game.
 * Total moves played and how many moves an individual player has played.
 * @param {*} jsonObject Is the complete game in jsonFormat. Contains all the moves.
 */
function setSummary(
  totalNumberOfMovesPlayed,
  whiteMoves,
  blackMoves,
  komi,
  winningPlayer,
  whitePlayerName,
  blackPlayerName
) {
  document.getElementById('totalMovesPlayed').innerHTML =
    'Total number of moves played: ' + totalNumberOfMovesPlayed;
  this.currentValue = totalNumberOfMovesPlayed;
  document.getElementById('whiteMovesPlayedNumber').innerHTML = whiteMoves;
  document.getElementById('blackMovesPlayedNumber').innerHTML = blackMoves;
  var whiteBar = document.getElementById('whiteBarPlayedMoves');
  whiteBar.style.width = (whiteMoves / totalNumberOfMovesPlayed) * 100 + '%';

  document.getElementById('komi').innerHTML = 'Komi: ' + komi;
  document.getElementById('winner').innerHTML = 'Winner: ' + winningPlayer;
  document.getElementById('whitePlayerName').innerHTML =
    'White: ' + whitePlayerName;
  document.getElementById('blackPlayerName').innerHTML =
    'Black: ' + blackPlayerName;
  var blackBar = document.getElementById('blackBarPlayedMoves');
  if (blackMoves == 0) {
    blackBar.style.width = 0;
  } else {
    blackBar.style.width = (blackMoves / totalNumberOfMovesPlayed) * 100 + '%';
  }
}

function getTextBetweenBrackets(token) {
  if (token.toString().includes('['))
    return token.substring(3, token.length - 1);
  else {
    return 'Not given';
  }
}

function winningRateGraph() {
  rotateRightCard();
  createGraph();
}

function utilityGraph() {
  rotateRightCard();
  createUtilityGraph();
}

function createUtilityGraph() {
  var analysisJsonResponse = getCompleteAnalysisResponse();

  analysisJsonResponse['data'].sort(function (a, b) {
    return a.turnNumber - b.turnNumber;
  });

  var howManyLabels = getTheAmountOfLabels();
  var rest = howManyLabels % howManyGridPoints;

  var movesPerGrid = Math.floor(howManyLabels / howManyGridPoints);
  var labels = getLabelsForTheGraph(movesPerGrid, rest, howManyLabels);

  var whitePlayerDataSet = getUtilityDataForPlayer(
    analysisJsonResponse['data'],
    rest,
    'W',
    howManyLabels,
    movesPerGrid
  );

  var blackPlayerDataSet = getUtilityDataForPlayer(
    analysisJsonResponse['data'],
    rest,
    'B',
    howManyLabels,
    movesPerGrid
  );

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Black utility',
        //backgroundColor: 'black',
        fill: false,
        borderColor: 'black',
        tension: 0,

        pointBackgroundColor: 'black',
        data: blackPlayerDataSet,
      },
      {
        label: 'White utility',
        //backgroundColor: 'black',
        fill: false,
        borderColor: '#7692ff',
        tension: 0,

        pointBackgroundColor: '#7692ff',
        data: whitePlayerDataSet,
      },
    ],
  };
  const config = {
    type: 'line',
    data: data,
    options: {
      scales: {
        x: {
          title: {
            color: 'black',
            display: true,
            text: 'Moves',
          },
        },
      },
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            font: {
              size: 18,
            },
          },
        },
      },
    },
  };
  chart = getCurrentChart();
  if (chart == null) {
    var myChart = new Chart(document.getElementById('graph'), config);
    setCurrentChart(myChart);
  } else {
    chart.destroy();
    var myChart = new Chart(document.getElementById('graph'), config);
    setCurrentChart(myChart);
  }
}

function getUtilityDataForPlayer(
  data,
  rest,
  playerString,
  howManyLabels,
  movesPerGrid
) {
  var playerUtilityValues = [];
  for (i = 0; i < data.length; i++) {
    var element = data[i];
    var player = getPlayerFromMove(element['turnNumber']);
    if (player != null && player == playerString) {
      playerUtilityValues.push(element['rootInfo']['utility']);
    }
  }

  return getDataUtility(playerUtilityValues, rest, howManyLabels, movesPerGrid);
}

function getDataUtility(
  playerUtilityValues,
  rest,
  howManyLabels,
  movesPerGrid
) {
  var utilityData = [];

  var counter = 0;

  if (movesPerGrid < howManyGridPoints) {
    rest = 0;
  }
  for (i = 0; i < playerUtilityValues.length; i++) {
    var currentUtility = 0;
    var counter = 1;
    if (movesPerGrid == 0) {
      utilityData.push(playerUtilityValues[i]);
    } else {
      for (j = 0; j < movesPerGrid; j++) {
        currentUtility += playerUtilityValues[i];
        counter++;
      }
      if (rest > 0) {
        rest--;
        i++;
        currentUtility += playerUtilityValues[i];
        counter++;
      } else {
        utilityData.push(currentUtility / counter);
      }
    }
  }
  return utilityData;
}

/**
 * Function which allows to create the graph on the right side if the graph button is activated. (Was Pressed).
 */
function createGraph() {
  var analysisResponse = getCompleteAnalysisResponse();

  analysisResponse['data'].sort(function (a, b) {
    return a.turnNumber - b.turnNumber;
  });
  console.log(analysisResponse);
  var howManyLabels = getTheAmountOfLabels();

  var rest = howManyLabels % howManyGridPoints;

  var movesPerGrid = Math.floor(howManyLabels / howManyGridPoints);

  var label = getLabelsForTheGraph(movesPerGrid, rest, howManyLabels);
  var whitePlayerDataSet = getDataForPlayer(
    analysisResponse['data'],
    rest,
    'W',
    howManyLabels,
    movesPerGrid
  );

  var blackPlayerDataSet = getDataForPlayer(
    analysisResponse['data'],
    rest,
    'B',
    howManyLabels,
    movesPerGrid
  );

  const data = {
    labels: label,
    datasets: [
      {
        label: 'Black win rate',
        //backgroundColor: 'black',
        fill: false,
        borderColor: 'black',
        tension: 0,

        pointBackgroundColor: 'black',
        data: blackPlayerDataSet,
      },
      {
        label: 'White win rate',
        //backgroundColor: 'black',
        fill: false,
        borderColor: '#7692ff',
        tension: 0,

        pointBackgroundColor: '#7692ff',
        data: whitePlayerDataSet,
      },
    ],
  };
  const config = {
    type: 'line',
    data: data,

    options: {
      scales: {
        x: {
          title: {
            color: 'black',
            display: true,
            text: 'Moves',
          },
        },
      },
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            fontColor: 'white',
            // This more specific font property overrides the global property
            font: {
              size: 18,
            },
          },
        },
      },
    },
  };

  chart = getCurrentChart();
  if (chart == null) {
    var myChart = new Chart(document.getElementById('graph'), config);
    setCurrentChart(myChart);
  } else {
    chart.destroy();
    var myChart = new Chart(document.getElementById('graph'), config);
    setCurrentChart(myChart);
  }
}
/**
 * Function which allows to rotate a card.
 * 
 */
function rotateRightCard() {
  var table = document.getElementById('table');
  table.style.visibility = 'hidden';
  table.style.cursor = 'default';
  this.isRightHandSideActive = true;
  var current = document.getElementById('cardRight');
  current.className += ' active';
}

/**
 * Start of graph section.
 */
function getTheAmountOfLabels() {
  var whiteMoves =
    this.currentJsonObject.getTotalNumberOfMovesPlayedByPlayer('W');
  var blackMoves =
    this.currentJsonObject.getTotalNumberOfMovesPlayedByPlayer('B');
  if (whiteMoves > blackMoves) {
    return whiteMoves;
  } else {
    return blackMoves;
  }
}

var howManyGridPoints = 10;
function getLabelsForTheGraph(movesPerGrid, rest, howManyLabels) {
  var label = [];
  var previous = 1;
  var gridPoints = howManyGridPoints;
  var rester = rest;
  console.log('MovesPergrid: %s', movesPerGrid);
  console.log('How Many Grid POints: %s', gridPoints);
  console.log('Labels: %s', howManyLabels);
  console.log('REST: %s', rester);
  if (howManyLabels < gridPoints) {
    gridPoints = howManyLabels;
    movesPerGrid = 0;
    rester = 0;
    for (i = 1; i <= gridPoints; i++) {
      label.push(i);
    }
  } else {
    for (i = 1; i <= gridPoints; i++) {
      var toMove = previous + movesPerGrid;
      if (previous == 1) {
        toMove--;
      }

      if (rester > 0) {
        label.push('(' + previous + '-' + (toMove + 1) + ')');
        rester--;
        previous = toMove + 1;
      } else {
        label.push('(' + previous + '-' + toMove + ')');
        previous = toMove;
      }
    }
  }

  return label;
}
/**
 * Function which allows to get specific data for the player.
 * 
 * @param {*} analysisJsonResponse KataGo response Text 
 * @param {*} rest 
 * @param {*} playerString Player Color
 * @param {*} howManyLabels 
 * @param {*} movesPerGrid 
 * @returns the Labels for the graph.
 */
function getDataForPlayer(
  analysisJsonResponse,
  rest,
  playerString,
  howManyLabels,
  movesPerGrid
) {
  var playerWinRates = getPlayerWinRatesPerTurn(
    analysisJsonResponse,
    playerString
  );

  return getDataWinRatesFromLabel(
    playerWinRates,
    rest,
    howManyLabels,
    movesPerGrid
  );
}
function getDataWinRatesFromLabel(winRates, rest, howManyLabels, movesPerGrid) {
  var winRatesData = [];

  var counter = 0;

  if (movesPerGrid < howManyGridPoints) {
    rest = 0;
  }
  for (i = 0; i < winRates.length; i++) {
    var currentWinRate = 0;
    var counter = 1;
    if (movesPerGrid == 0) {
      winRatesData.push(winRates[i]);
    } else {
      for (j = 0; j < movesPerGrid; j++) {
        currentWinRate += winRates[i];
        counter++;
      }
      if (rest > 0) {
        rest--;
        i++;
        currentWinRate += winRates[i];
        counter++;
      } else {
        winRatesData.push(currentWinRate / counter);
      }
    }
  }
  return winRatesData;
}

function getPlayerWinRatesPerTurn(analysisJsonResponse, playerString) {
  var playerWinrate = [];
  for (i = 0; i < analysisJsonResponse.length; i++) {
    var element = analysisJsonResponse[i];
    var player = getPlayerFromMove(element['turnNumber']);

    if (player != null && player == playerString) {
      playerWinrate.push(getWinRate(element));
    }
  }

  return playerWinrate;
}
function getWinRate(elementJson) {
  return elementJson['rootInfo']['winrate'];
}

function setCurrentChart(chart) {
  this.currentChart = chart;
}
function getCurrentChart() {
  return currentChart;
}
function getPlayerFromMove(turnNumber) {
  return this.currentJsonObject.getSpecificPlayerToASpecificMove(turnNumber);
}

/**
 * End of graph section.
 */

/**
 * Function allows to go back to the board (rotate back).
 * Only accessible from the graph menu.
 */
function backToBoard() {
  var table = document.getElementById('table');
  table.style.visibility = 'visible';
  table.style.cursor = 'pointer';
  var current = document.getElementById('cardRight');
  current.classList.remove('active');
  this.isRightHandSideActive = false;
}

var currentJsonObject = null;
/**
 * Function allows to send a post request to Katago.
 * 
 * @param {*} jsonObject The json query format of the game.
 */
function postMultiAnalysisRequest(jsonObject) {
  clearBoard();
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://127.0.0.1:2718/analyse/katago_gtp_bot', true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.send(jsonObject.toString());
  this.currentJsonObject = jsonObject;

  jsonObject.moves.forEach((stone, position) => {
    placeStone(stone.x, stone.y, 'gameAnalysis', position);
  });
  xhr.onload = function () {
    var data = JSON.parse(this.responseText);
    setCompleteAnalysisResponse(data);
    data = getCompleteAnalysisResponse()['data'].sort(function (a, b) {
      return a.turnNumber - b.turnNumber;
    });
    var turnNumber = 0;
    var totalCountBlack = 0;
    var totalCountWhite = 0;
    var totalBlackMovesPlayed =
      currentJsonObject.getTotalNumberOfMovesPlayedByX('black');
    var totalWhiteMovesPlayed =
      currentJsonObject.getTotalNumberOfMovesPlayedByX('white');
    for (i = 0; i < data.length; i++) {
      var movePlayedInTurnX = currentJsonObject.getSingleMove(turnNumber);
      var suggestedMoveLength = data[i].moveInfos.length;
      for (j = 0; j < suggestedMoveLength; j++) {
        var move = data[i].moveInfos[j].move;
        var player = currentJsonObject.getSpecificPlayerToASpecificMove(i);

        if (player != null && movePlayedInTurnX != null) {
          var stone = currentJsonObject.convertMoveToStone(player, move);

          if (player.toUpperCase().includes('W')) {
            var value = checkIfPlayerIsCheating(
              movePlayedInTurnX,
              stone,
              j,
              suggestedMoveLength,
              stone.player,
              turnNumber,
              currentJsonObject.getTotalNumberOfMovesPlayed(),
              totalWhiteMovesPlayed
            );
            totalCountWhite += value;
          } else if (player.toUpperCase().includes('B')) {
            var value = checkIfPlayerIsCheating(
              movePlayedInTurnX,
              stone,
              j,
              suggestedMoveLength,
              stone.player,
              turnNumber,
              currentJsonObject.getTotalNumberOfMovesPlayed(),
              totalBlackMovesPlayed
            );
            totalCountBlack += value;
          }
        }
      }
      turnNumber++;
    }

    var blackValue = (totalCountBlack / totalBlackMovesPlayed) * 100;
    var whiteValue = (totalCountWhite / totalWhiteMovesPlayed) * 100;

    setChanceToCheatValues(blackValue, whiteValue);
  };
}
/**
 * XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
 * Function is not completed for now. The goal of this function is to detect the cheater based on some paremeters.
 * XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
 * 
 * @param {*} moveStone 
 * @param {*} aiSuggestedMoveSingle 
 * @param {*} position 
 * @param {*} movesLength 
 * @param {*} player 
 * @param {*} turnNumber 
 * @param {*} totalNumberOfMovesPlayed 
 * @param {*} playerPlayedMovesLength 
 * @returns 
 */
function checkIfPlayerIsCheating(
  moveStone,
  aiSuggestedMoveSingle,
  position,
  movesLength,
  player,
  turnNumber,
  totalNumberOfMovesPlayed,
  playerPlayedMovesLength
) {
  if (moveStone.compareToStone(aiSuggestedMoveSingle)) {
    console.log(
      'HIT at position:%s with MoveLength of:%s and Player:%s',
      position,
      movesLength,
      player
    );
    return (position * (movesLength - position)) / movesLength;
  }
  return 0;
}

function setChanceToCheatValues(blackValue, whiteValue) {
  if (blackValue > 100) {
    blackValue = 100;
  }

  if (whiteValue > 100) {
    whiteValue = 100;
  }
  document.getElementById('whiteNumber').innerHTML =
    Math.round(whiteValue) + '%';
  document.getElementById('blackNumber').innerHTML =
    Math.round(blackValue) + '%';

  var whiteBar = document.getElementById('whiteBar');
  whiteBar.style.width = whiteValue + '%';

  var blackBar = document.getElementById('blackBar');
  if (blackValue == 0) {
    blackBar.style.width = 0;
  } else {
    blackBar.style.width = blackValue + '%';
  }
}
/**
 * Function is used for the live suggestions to analyse the next move.
 * Function does a post request to katago in the backend.
 * 
 * @param {QueryObject} jsonObject  the game.
 */
function postOneAnalysisRequest(jsonObject) {
  var xhr = new XMLHttpRequest();
  xhr.open('POST', 'http://127.0.0.1:2718/analyse/katago_gtp_bot', true);
  xhr.setRequestHeader('Content-Type', 'application/json');

  xhr.send(jsonObject);
  xhr.onload = function () {
    var data = JSON.parse(this.responseText);

    moveInfos = data['data'][0]['moveInfos'];
    moveInfos.forEach(placeSuggestedStone);
    rootInfo = data['data'][0]['rootInfo'];
  };
}

/**
 * Function allows to reformat the position of the stone to place it. (Element is a string and requires formatting ing x and y coordinates).
 * 
 * @param {String} element string containing the player and the position. B[pq] which is required to be reformatted into coordinates.
 * @param {int} position describes if it is the first second .... move of the game. Is a sequal from 0 -x.
 * Uses the function placestone to actually place the stone
 */
function placeSuggestedStone(element, position) {
  suggestedMove = element['move'];
  x = suggestedMove.charCodeAt(0) - 65;
  if (suggestedMove.length == 3) {
    y = suggestedMove.slice(-2);
  } else {
    y = suggestedMove.slice(-1);
  }
  placeStone(x + 1, y, 'custom', position);
}
let listOfStones = [];
var bool2DArray = Array.from(Array(20), () => new Array(20));
var id = 0;

const board_divided = document.querySelector('.division');

/**
 * Function which allows to place a stone on to the board.
 * 
 * @param {int} column x position to be placed.
 * @param {int} row y position to be placed.
 * @param {String} mark describes the color of the stone white black or custom is used. In case of custom its blue for suggestion play.
 * @param {int} position the howmanied move it is.
 */
function placeStone(column, row, mark, position) {
  var col = column;
  var row = row;
  const stone = document.createElement('div');
  if (mark == 'custom') {
    stone.classList.add(mark);
    // stone.id = 'rushB';
  } else if (mark == 'gameAnalysis') {
    stone.classList.add('gameAnalysis');
    if (position % 2 == 0) {
      stone.classList.add('black');
    } else {
      stone.classList.add('white');
    }
  } else if (mark == 'W') {
    stone.classList.add('gameAnalysis');
    stone.classList.add('white');
  } else if (mark == 'B') {
    stone.classList.add('gameAnalysis');
    stone.classList.add('black');
  } else {
    stone.classList.add('playerStone');
    stone.classList.add(mark);
  }
  stone.innerHTML = position;
  stone.style.gridArea = `${row} / ${col}`;

  stone.classList.add('stone');

  board_divided.appendChild(stone);
}
/**
 * Function which allows to remove all suggested stones from the game.
 */
function removeSuggestedStonesFromBoard() {
  document
    .querySelectorAll('.custom')
    .forEach((e) => e.parentNode.removeChild(e));
}
/**
 * Function which allows to remove all the stones from the board.
 * Uses removeSuggestedStonesFromBoard function which allows to remove suggested/custom stones.
 */
function clearBoard() {
  removeSuggestedStonesFromBoard();
  document
    .querySelectorAll('.playerStone')
    .forEach((e) => e.parentNode.removeChild(e));
  document
    .querySelectorAll('.gameAnalysis')
    .forEach((e) => e.parentNode.removeChild(e));
}
var move = 0;
var suggestion = 0;
var isRightHandSideActive = false;

function printPosition(e) {
  removeSuggestedStonesFromBoard();

  if (
    (e.target.id == 'boardArea' ||
      e.target.id == 'gridArea' ||
      e.target.id == 'table' ||
      e.target.id == 'custom' ||
      e.target.id.includes('areaPlace')) &&
    isRightHandSideActive == false
  ) {
    var position = getPosition(e);
    x_t = position.x / 35;
    y_t = position.y / 35;
    x = Math.round(x_t);
    y = Math.round(y_t);

    if (x < 0) x = 0;
    else if (x > 19) x = 19;

    if (y > 19) y = 19;
    else if (y < 0) y = 0;
    let stone = NaN;

    if (move % 2 == 0) {
      stone = new Stone('black', x, y);
    } else {
      stone = new Stone('white', x, y);
    }

    move++;

    if (bool2DArray[x][y] != NaN && bool2DArray[x][y] != 1) {
      listOfStones.push(stone);
      bool2DArray[x][y] = 1;

      placeStone(stone.x, stone.y, stone.player, move);
      queryObject.setMoves(listOfStones);
      queryObject.setSingleMoveToAnalyse(move);
      postOneAnalysisRequest(queryObject);
      console.log('Request send.');
    } else {
      console.log('There is already a stone at this location.');
    }
  }
}

function check(element) {
  var rect = element.target.getBoundingClientRect();
  rowPosition = 0;
  colPosition = 0;
  //Return an object with properties row and column
  width = 420;
  height = 420;

  var x = e.clientX - rect.left; //x position within the element.
  var y = e.clientY - rect.top; //y position within the element.
}
/**
 * Class stone describes a stone.
 */
class Stone {
  /**
   * Constructor to create a stone.
   * @param {String} player is it the black or white player
   * @param {int} x position of the stone in x.
   * @param {int} y position of the stone in y.
   * (Coordinate system x,y)
   */
  constructor(player, x, y) {
    this.player = player;
    this.x = x;
    this.y = y;
  }

  // Returns the position of the Stone on the board in String format.
  getPosition() {
    var asciiX = this.x;
    var asciiY = this.y;
    return '(' + asciiX + ',' + asciiY + ')';
  }
  compareToStone(stone) {
    if (this.player == stone.player && this.x == stone.x && this.y == stone.y) {
      return true;
    }
    return false;
  }
  // String format of the stone.
  toString() {
    return '["' + this.player + '","' + this.getPosition() + '"]';
  }
}

/**
 * Class BoardSize describes the size of the actual board.
 */
class BoardSize {
  /**
   * Constructor allows to create a Board of size x and y.
   * @param {int} boardSizeX how many x stones.
   * @param {int} boardSizeY how many y stones.
   */
  constructor(boardSizeX, boardSizeY) {
    this.boardSizeX = boardSizeX;
    this.boardSizeY = boardSizeY;
  }
  /**
   * Function which allows to get the boardsize in string format.
   * @returns String format used for final query.
   */
  toString() {
    return (
      '"boardXSize":' + this.boardSizeX + ',"boardYSize":' + this.boardSizeY
    );
  }
}
/**
 * The actual query object. Which is required to send a jsonobject as query to Katago.
 */
class QueryObject {
  rules = 'tromp-taylor';
  komi = 7.5;
  movesToAnalyse = [];
  moves = [];
  whiteMoves = 0;
  blackMoves = 0;
  winner = '';
  playerNameWhite = '';
  playerNameBlack = '';

  /**
   * Requires the BoardSize.
   * @param {BoardSize} boardSize
   */
  constructor(boardSize) {
    this.id = new Date().getTime();
    this.boardSize = boardSize;
  }

  setPlayerNameWhite(name) {
    this.playerNameWhite = name;
  }
  setPlayerNameBlack(name) {
    this.playerNameBlack = name;
  }

  getPlayerNameWhite() {
    return this.playerNameWhite;
  }

  getPlayerNameBlack() {
    return this.playerNameBlack;
  }

  setKomi(komi) {
    this.komi = komi;
  }
  getKomi() {
    return this.komi;
  }

  setWinner(winningPlayer) {
    this.winner = winningPlayer;
  }
  getWinner() {
    return this.winner;
  }
  getSingleMove(turnNumber) {
    return this.moves[turnNumber];
  }

  getSpecificPlayerToASpecificMove(turnNumber) {
    if (turnNumber < this.moves.length) {
      return this.moves[turnNumber]['player'];
    } else return null;
  }

  convertMoveToStone(player, string) {
    if (player == 'B' || player == 'b') {
      this.blackMoves++;
    } else if (player == 'W' || player == 'w') {
      this.whiteMoves++;
    }
    var x = string.charCodeAt(0) - 65;
    var y = 0;
    if (string.length == 3) {
      y = string.substring(1, 4);
    } else {
      y = string.substring(1, 3);
    }

    return new Stone(player, x, y);
  }

  /**
   * Function which allows to get the total number of moves Player by BOTH players.
   * 
   * @returns the length of the moves list. (int)
   */
  getTotalNumberOfMovesPlayed() {
    return this.moves.length;
  }

  /**
   * Function which allows to  get the count of how many plays have been played by a player  until a certain turnNumber.
   * Function is used to play out the game one move after the other.
   * 
   * @param {*} player The player color.
   * @param {*} y is the turn number up to which should be conted.
   * @returns the count of turns.
   */
  getHowManyMovesWherePlayedUntilCertainPoint(player, y) {
    var count = 0;
    if (y <= this.getTotalNumberOfMovesPlayed() && y >= 0) {
      for (var i = 0; i < y; i++) {
        if (this.moves[i].player.includes(player.toUpperCase())) {
          count++;
        }
      }
      return count;
    }
    return count;
  }

  /**
   * Function allows to get the count of the black or white moves done in a game.
   * @param {string} player White or black.
   * @returns
   */
  getTotalNumberOfMovesPlayedByX(player) {
    if (player == 'black') {
      return this.blackMoves;
    } else if (player == 'white') {
      return this.whiteMoves;
    } else {
      return null;
    }
  }
  // token can be B or W for black and white.
  getTotalNumberOfMovesPlayedByPlayer(token) {
    var playerMovesCount = 0;
    for (i = 0; i < this.moves.length; i++) {
      if (this.moves[i].player.includes(token)) {
        playerMovesCount++;
      }
    }
    return playerMovesCount;
  }

  /**
   * Function which allows to set to analyse all the moves.
   * @param {List<Stones>} moves
   */
  setMovesForCompleteGameAnalysis(moves) {
    this.whiteMoves = 0;
    this.blackMoves = 0;
    this.moves = [];
    moves.forEach((element) => {
      var player = element.charAt(0);
      if (player == 'B' || player == 'b') {
        this.blackMoves++;
      } else if (player == 'W' || player == 'w') {
        this.whiteMoves++;
      }
      var x = element.charCodeAt(2) - 97;
      var y = element.charCodeAt(3) - 97;
      let stone = new Stone(player, x, y);
      this.moves.push(stone);
    });
  }
  /**
   * Allows to set the moves list to the last moves. Used for one move analysis.
   * @param {List<Stone>} moves
   */
  setMoves(moves) {
    var len = moves.length - 1;
    moves[len].x = moves[len].x - 1;
    moves[len].y = moves[len].y - 1;
    this.moves = moves;
  }
  /**
   * Function which sets the moves  to be analysed to all moves should be analysed.
   * @param {int} lowEnd
   * @param {int} highEnd
   */
  setMovesToAnalyseCompleteGame(lowEnd, highEnd) {
    this.movesToAnalyse = [];
    for (var i = lowEnd; i <= highEnd; i++) {
      this.movesToAnalyse.push(i);
    }
  }

   // The following functions allow to get a proper query which is accepted by KataGo.
   // Thus these functions are only used to create a Json object which is used to make a query in KataGo.


  /**
   * Allows to set a single move given as parameter.
   * @param {Stone} move
   */
  setSingleMoveToAnalyse(move) {
    this.movesToAnalyse = [];
    this.movesToAnalyse.push(move);
  }
  getIdJsonFormat() {
    return '"id":"' + this.getId() + '"';
  }

  getId() {
    return this.id;
  }
  getRulesJsonFormat() {
    return '"rules":"' + this.getRules() + '"';
  }

  getKomiJsonFormat() {
    return '"komi":' + this.getKomi();
  }

  getMovesJsonFormat() {
    var movesInString = '"moves":[';
    this.moves.forEach((stone) => {
      if (stone == this.moves[this.moves.length - 1]) {
        movesInString = movesInString + stone.toString();
      } else movesInString = movesInString + stone.toString() + ',';
    });
    movesInString = movesInString + ']';
    return movesInString;
  }

  getMovesToAnalyseTurnsJsonFormat() {
    var turns = '';
    var length = this.movesToAnalyse.length;

    for (var i = 0; i < length; i++) {
      if (i == length - 1) turns = turns + this.movesToAnalyse[i];
      else turns = turns + this.movesToAnalyse[i] + ',';
    }
    return '"analyzeTurns":[' + turns + ']';
  }

  getRules() {
    return this.rules;
  }

  setRules(rule) {
    this.rules = rule;
  }

  toString() {
    return (
      '{' +
      this.getIdJsonFormat() +
      ',' +
      this.getMovesJsonFormat() +
      ',' +
      this.getRulesJsonFormat() +
      ',' +
      this.boardSize.toString() +
      ',' +
      this.getMovesToAnalyseTurnsJsonFormat() +
      '}'
    );
  }
}

const board = new BoardSize(19, 19);
let queryObject = new QueryObject(board);
