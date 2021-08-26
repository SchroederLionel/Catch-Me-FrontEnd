class BoardSize {
  constructor(boardSizeX, boardSizeY) {
    this.boardSizeX = boardSizeX;
    this.boardSizeY = boardSizeY;
  }

  toString() {
    return (
      '"boardXSize":' + this.boardSizeX + ',"boardYSize":' + this.boardSizeY
    );
  }
}
