var MineSweeper = (function(){
  "use strict"

  return {
    CELL_BOMB_RATIO: 100,
    NUM_ROWS: 16,
    NUM_COLS: 30,
    NUM_BOMBS: 50,
    DEFAULT_EMPTY_VALUE: "",
    DEFAULT_BOMB_VALUE: "*",
    grid: [],

    getCellValue: function(row, col){
      return this.grid[row][col];
    },

    setCellValue: function(row, col, value){
      this.grid[row][col] = value;
    },

    upperLeftCellCoordinates  : function (row, col) {return [row-1, col-1]},
    upperCellCoordinates      : function (row, col) {return [row-1, col  ]},
    upperRightCellCoordinates : function (row, col) {return [row-1, col+1]},
    leftCellCoordinates       : function (row, col) {return [row  , col-1]},
    rightCellCoordinates      : function (row, col) {return [row  , col+1]},
    lowerLeftCellCoordinates  : function (row, col) {return [row+1, col-1]},
    lowerCellCoordinates      : function (row, col) {return [row+1, col  ]},
    lowerRightCellCoordinates : function (row, col) {return [row+1, col+1]},

    setupGrid: function(){
      this.grid = [];
      for (var i = 0; i < this.NUM_ROWS; i++) {
        this.grid[i] = new Array(this.NUM_COLS);
        this.grid[i].fill(this.DEFAULT_EMPTY_VALUE);
      };
    },

    setupBombs: function(){
      var bombsInstalledSoFar = 0;

      while (bombsInstalledSoFar != this.NUM_BOMBS) {
        var cellLocation = this._getRandomCellLocation(),
            row = cellLocation[0],
            col = cellLocation[1];

        if (this.getCellValue(row, col) !== this.DEFAULT_BOMB_VALUE) {
          this.setCellValue(row, col, this.DEFAULT_BOMB_VALUE);
          bombsInstalledSoFar++;
        }
      }
    },

    _calculateNumberOfBombs: function(){
      this.NUM_BOMBS = Math.floor((this.NUM_ROWS * this.NUM_COLS) / this.CELL_BOMB_RATIO);
    },

    _getRandomCellLocation: function(){
      var randomRow = this._getRandomIntegerInRange(0, this.NUM_ROWS),
          randomCol = this._getRandomIntegerInRange(0, this.NUM_COLS);

      return [randomRow, randomCol];
    },

    _getRandomIntegerInRange: function(lowerBound, upperBound) {
      return lowerBound + Math.floor(Math.random() * upperBound);
    },

    _calculateCellValues: function() {
      for (var i = 0; i < this.NUM_ROWS; i++) {
        for (var j = 0; j < this.NUM_COLS; j++) {
          var cellValue = this.getCellValue(i, j);

          if (cellValue !== this.DEFAULT_BOMB_VALUE) {
            var numberOfBombsAround = this._getNumberOfSurroundingBombs(i, j);
            if (numberOfBombsAround != 0) {
              this.setCellValue(i, j, numberOfBombsAround);
            }
          }
        }
      }
    },

    _getNumberOfSurroundingBombs: function(row, col) {
      var bombs = this._getCellValueIfValidCell( this.upperLeftCellCoordinates  (row, col) )
      + this._getCellValueIfValidCell( this.upperCellCoordinates      (row, col) )
      + this._getCellValueIfValidCell( this.upperRightCellCoordinates (row, col) )
      + this._getCellValueIfValidCell( this.leftCellCoordinates       (row, col) )
      + this._getCellValueIfValidCell( this.rightCellCoordinates      (row, col) )
      + this._getCellValueIfValidCell( this.lowerLeftCellCoordinates  (row, col) )
      + this._getCellValueIfValidCell( this.lowerCellCoordinates      (row, col) )
      + this._getCellValueIfValidCell( this.lowerRightCellCoordinates (row, col) );

      return bombs;
    },

    _getCellValueIfValidCell: function(cellCoordinates) {
      var row = cellCoordinates[0],
          col = cellCoordinates[1];

      return this._isValidCell(row, col) &&
      (this.getCellValue(row, col) === this.DEFAULT_BOMB_VALUE)
      ? 1 : 0;
    },

    _isValidCell: function(row, col){
      return (this._isValueInRange(0, this.NUM_ROWS-1, row) && this._isValueInRange(0, this.NUM_COLS-1, col));
    },

    _isValueInRange: function(lowerBound, upperBound, value){
      return (lowerBound <= value) && (value <= upperBound);
    }
  };

}());
