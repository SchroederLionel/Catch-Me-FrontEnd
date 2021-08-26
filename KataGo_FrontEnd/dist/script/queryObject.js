class QueryObject {
  rules = 'tromp-taylor';
  komi = 7.5;
  movesToAnalyse = [];
  moves = [];
  constructor(boardSize, moves) {
    this.id = new Date().getTime();
    this.boardSize = boardSize;
    this.moves = moves;
  }

  setMovesToAnalyseCompleteGame(lowEnd, highEnd) {
    for (var i = lowEnd; i <= highEnd; i++) {
      movesToAnalyse.push(i);
    }
  }
  getIdJsonFormat() {
    return '"id":"' + getId() + '"';
  }
  getRulesJsonFormat() {
    return '"rules":"' + getRules() + '"';
  }

  getKomiJsonFormat() {
    return '"komi":' + getKomi();
  }

  getMovesJsonFormat() {
    movesInString = '"moves":[';
    this.moves.forEach((element) => {
      if (stone == moves.get(moves.size() - 1)) {
        movesInString = movesInString + stone.toString();
      } else movesInString = movesInString + stone.toString() + ',';
    });
    movesInString = movesInString + ']';
    return movesInString;
  }

  getMovesToAnalyseTurnsJsonFormat() {
    turnsToAnalyseJsonFormat = '"analyzeTurns":[';
    turns = '';
    length = movesToAnalyse.length;

    for (i = 0; i < length; i++) {
      if (i == length - 1) turns = turns + String.valueOf(analyzeTurns[i]);
      else turns = turns + String.valueOf(analyzeTurns[i]) + ',';
    }
    return '"analyzeTurns":[' + turns + ']';
  }

  getRules() {
    return rules;
  }

  setRules(rule) {
    this.rules = rule;
  }

  toString() {
    return (
      '{' +
      getIdJsonFormat() +
      ',' +
      getMovesJsonFormat() +
      ',' +
      getRulesJsonFormat() +
      ',' +
      boardSize.toString() +
      ',' +
      getAnalyseTurnsJsonFormat() +
      '}'
    );
  }
}
