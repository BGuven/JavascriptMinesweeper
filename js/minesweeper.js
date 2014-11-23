MineSweeper = {
  NUM_ROWS: 20,
  NUM_COLS: 50,
  NUM_BOMBS: 49,
  DEFAULT_EMPTY_VALUE: "",
  DEFAULT_BOMB_VALUE: "*",

  grid: [],

  init: function(){
    this._setupGrid();
    this._setupBombs();
    this._markCells();
    this._displayGrid();
  },

  getCell: function(row, col){
    return this.grid[row][col];
  },

  setCell: function(row, col, value){
    this.grid[row][col] = value;
  },

  _setupGrid: function(){
    for (var i = 0; i < this.NUM_ROWS; i++) {
      this.grid[i] = new Array(this.NUM_COLS);
      this.grid[i].fill(this.DEFAULT_EMPTY_VALUE);
    };
  },

  _setupBombs: function(){
    bombsInstalledSoFar = 0;

    while (bombsInstalledSoFar != this.NUM_BOMBS) {
      cellLocation = this._getRandomCellLocation();
      row = cellLocation[0]
      col = cellLocation[1]
      if (this.getCell(row, col) !== this.DEFAULT_BOMB_VALUE) {
        this.setCell(row, col, this.DEFAULT_BOMB_VALUE);
        bombsInstalledSoFar++;
      }
    }
  },

  _getRandomCellLocation: function(){
    randomRow = this._getRandumIntegerInRange(0, this.NUM_ROWS);
    randomCol = this._getRandumIntegerInRange(0, this.NUM_COLS);
    return [randomRow, randomCol];
  },

  _getRandumIntegerInRange: function(lowerBound, upperBound) {
    return lowerBound + Math.floor(Math.random() * upperBound);
  },


  _markCells: function() {
    for (var i = 0; i < this.NUM_ROWS; i++) {
      for (var j = 0; j < this.NUM_COLS; j++) {
        cellValue = this.getCell(i, j);

        if (cellValue !== this.DEFAULT_BOMB_VALUE) {
          numberOfBombsAround = this._getNumberOfSurroundingBombs(i, j);
          if (numberOfBombsAround != 0) {
            this.setCell(i, j, numberOfBombsAround);
          }
        }
      }
    }
  },

  _getNumberOfSurroundingBombs: function(row, col) {
    value = 0;

    (this._isValidCell(row-1, col-1)) ? cellValue = this.getCell(row-1, col-1) : cellValue = -1;
    (cellValue == -1 || cellValue !== this.DEFAULT_BOMB_VALUE) ? value : value++;

    (this._isValidCell(row  , col-1)) ? cellValue = this.getCell(row  , col-1) : cellValue = -1;
    (cellValue == -1 || cellValue !== this.DEFAULT_BOMB_VALUE) ? value : value++;

    (this._isValidCell(row+1, col-1)) ? cellValue = this.getCell(row+1, col-1) : cellValue = -1;
    (cellValue == -1 || cellValue !== this.DEFAULT_BOMB_VALUE) ? value : value++;

    (this._isValidCell(row-1, col  )) ? cellValue = this.getCell(row-1, col  ) : cellValue = -1;
    (cellValue == -1 || cellValue !== this.DEFAULT_BOMB_VALUE) ? value : value++;

    (this._isValidCell(row+1, col  )) ? cellValue = this.getCell(row+1, col  ) : cellValue = -1;
    (cellValue == -1 || cellValue !== this.DEFAULT_BOMB_VALUE) ? value : value++;

    (this._isValidCell(row-1, col+1)) ? cellValue = this.getCell(row-1, col+1) : cellValue = -1;
    (cellValue == -1 || cellValue !== this.DEFAULT_BOMB_VALUE) ? value : value++;

    (this._isValidCell(row  , col+1)) ? cellValue = this.getCell(row  , col+1) : cellValue = -1;
    (cellValue == -1 || cellValue !== this.DEFAULT_BOMB_VALUE) ? value : value++;

    (this._isValidCell(row+1, col+1)) ? cellValue = this.getCell(row+1, col+1) : cellValue = -1;
    (cellValue == -1 || cellValue !== this.DEFAULT_BOMB_VALUE) ? value : value++;

    return value;
  },

  _isValidCell: function(row, col){
    return this._isInRange(0, this.NUM_ROWS-1, row) && this._isInRange(0, this.NUM_COLS-1, col);
  },

  _isInRange: function(lowerBound, upperBound, value){
    return (lowerBound <= value) && (value <= upperBound);
  },

  _displayGrid: function(){
    var $div = $('<div />', {
      "class": "cell"
    });

    for (var i = 0; i < this.NUM_ROWS; i++) {
      var $row = $('<div />', {
        "class": "row"
      });

      for (var j = 0; j < this.NUM_COLS; j++) {
        $div.html(this.getCell(i,j));
        // $div.html(0);
        $row.append($div.clone());
      };

      $('#content').append($row);
    }
  },

}
