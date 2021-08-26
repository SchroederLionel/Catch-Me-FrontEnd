class Stone {
  constructor(player, position) {
    this.player = player;
    this.position = position;
  }
  // Returns the player. (White or black).
  getPlayer(token) {
    return token.charAt(0).toUpperCase();
  }
  // Returns the position of the Stone on the board in String format.
  getPosition(token) {
    asciiX = token.charCodeAt(2) - 97;
    asciiY = token.charCodeAt(3) - 97;
    return '(' + asciiX + ',' + asciiY + ')';
  }

  // String format of the stone.
  toString() {
    return '["' + getPlayer() + '","' + getPosition() + '"]';
  }
}
