var MineSweeper = (function(){
  "use strict"

  return {
    FULLSCREEN: true,

    CELL_CSS_PROPERTIES: {
      "width": "20",
      "height": "20",
    },

    CELL_WIDTH: "20",
    CELL_HEIGHT: "20",

    CELL_BOMB_RATIO: 10,

    NUM_ROWS: 16,
    NUM_COLS: 30,
    NUM_BOMBS: 50,

    DEFAULT_EMPTY_VALUE: "",
    DEFAULT_BOMB_VALUE: "*",


    FLAGS_USED: 0,
    CLEARED_CELLS: 0,

    grid: [],

    init: function(){
      (function(self){
        $("#restart-button").click(function(){
          console.log('restarting game');
          self.restartGame();
        });
      }(this));

      this._createGame();
    },

    _createGame: function(){
      this.CLEARED_CELLS = 0;
      this.FLAGS_USED = 0;
      this._calculateNumberOfRowsAndCols();
      this._calculateNumberOfBombs();
      this._setupGrid();
      this._setupBombs();
      this._calculateCellValues();
      this._setupCellClicks(this);
      this._displayGrid();
      this._updateFlagsInfo();
      console.log(this.CLEARED_CELLS, ((this.NUM_ROWS * this.NUM_COLS) - this.NUM_BOMBS), this.NUM_BOMBS);
    },

    getCellValue: function(row, col){
      return this.grid[row][col];
    },

    setCellValue: function(row, col, value){
      this.grid[row][col] = value;
    },

    _upperLeftCellCoordinates  : function (row, col) {return [row-1, col-1]},
    _upperCellCoordinates      : function (row, col) {return [row-1, col  ]},
    _upperRightCellCoordinates : function (row, col) {return [row-1, col+1]},
    _leftCellCoordinates       : function (row, col) {return [row  , col-1]},
    _rightCellCoordinates      : function (row, col) {return [row  , col+1]},
    _lowerLeftCellCoordinates  : function (row, col) {return [row+1, col-1]},
    _lowerCellCoordinates      : function (row, col) {return [row+1, col  ]},
    _lowerRightCellCoordinates : function (row, col) {return [row+1, col+1]},

    _calculateNumberOfRowsAndCols: function (){
      var height = $('#grid').height();
      var width = $('#grid').width();

      this.NUM_ROWS = Math.floor(height / this.CELL_HEIGHT);
      this.NUM_COLS = Math.floor(width / this.CELL_WIDTH);
      console.log('Rows:', this.NUM_ROWS, 'Cols:', this.NUM_COLS);
    },

    _calculateNumberOfBombs: function(){
      this.NUM_BOMBS = Math.floor((this.NUM_ROWS * this.NUM_COLS) / this.CELL_BOMB_RATIO);
    },

    _setupGrid: function(){
      this.grid = [];
      for (var i = 0; i < this.NUM_ROWS; i++) {
        this.grid[i] = new Array(this.NUM_COLS);
        this.grid[i].fill(this.DEFAULT_EMPTY_VALUE);
      };
    },

    _setupBombs: function(){
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
      var bombs = this._getCellValueIfValidCell( this._upperLeftCellCoordinates  (row, col) )
      + this._getCellValueIfValidCell( this._upperCellCoordinates      (row, col) )
      + this._getCellValueIfValidCell( this._upperRightCellCoordinates (row, col) )
      + this._getCellValueIfValidCell( this._leftCellCoordinates       (row, col) )
      + this._getCellValueIfValidCell( this._rightCellCoordinates      (row, col) )
      + this._getCellValueIfValidCell( this._lowerLeftCellCoordinates  (row, col) )
      + this._getCellValueIfValidCell( this._lowerCellCoordinates      (row, col) )
      + this._getCellValueIfValidCell( this._lowerRightCellCoordinates (row, col) );

      return bombs;
    },

    _getCellValueIfValidCell: function(cellCoordinates) {
      var [row, col] = cellCoordinates;

      return this._isValidCell(row, col) &&
      (this.getCellValue(row, col) === this.DEFAULT_BOMB_VALUE)
      ? 1 : 0;
    },

    _isValidCell: function(row, col){
      return (this._isValueInRange(0, this.NUM_ROWS-1, row) && this._isValueInRange(0, this.NUM_COLS-1, col));
    },

    _isValueInRange: function(lowerBound, upperBound, value){
      return (lowerBound <= value) && (value <= upperBound);
    },

    _displayGrid: function(){
      var $div = $('<div />', {
        "class": "cell"
      });

      $div.css({
        width: this.CELL_WIDTH + "px",
        height: this.CELL_HEIGHT + "px",
      });

      for (var i = 0; i < this.NUM_ROWS; i++) {
        var $row = $('<div />', {
          "class": "row"
        });

        for (var j = 0; j < this.NUM_COLS; j++) {
          $div.attr({row: i, col: j});
          $row.append($div.clone());
        };

        $('#grid').append($row);
      }
    },

    _setupCellClicks: function(self){
      $("#grid").on('contextmenu', ".cell", function(e){
        e.preventDefault();

        if ($(this).hasClass('marked')) {
          $(this).removeClass('marked');
          self.FLAGS_USED--;
        } else {
          $(this).addClass('marked');
          self.FLAGS_USED++;
        }

        self._updateFlagsInfo();

        return false;
      });

      $("#grid").on("click", ".cell:not('.marked')", function(event) {
        var row = parseInt($(this).attr('row'));
        var col = parseInt($(this).attr('col'));
        self._clearArea([row, col]);
      });

      $("#grid").on("mousedown", ".cell.revealed", function(event) {
        var row = parseInt($(this).attr('row'));
        var col = parseInt($(this).attr('col'));
        self._highlightNearbyCells(row, col);
      });

      $("#grid").on("mouseup", ".cell.revealed", function(event) {
        var row = parseInt($(this).attr('row'));
        var col = parseInt($(this).attr('col'));
        self._removeHighlightNearbyCells(row, col);
      });
    },

    _highlightNearbyCells: function(row, col){
      this._highlightCell( this._upperLeftCellCoordinates  (row, col) );
      this._highlightCell( this._upperCellCoordinates      (row, col) );
      this._highlightCell( this._upperRightCellCoordinates (row, col) );
      this._highlightCell( this._leftCellCoordinates       (row, col) );
      this._highlightCell( this._rightCellCoordinates      (row, col) );
      this._highlightCell( this._lowerLeftCellCoordinates  (row, col) );
      this._highlightCell( this._lowerCellCoordinates      (row, col) );
      this._highlightCell( this._lowerRightCellCoordinates (row, col) );
    },

    _highlightCell: function(cellCoordinates){
      var [row, col] = cellCoordinates;
      var content = document.getElementById('grid');
      var roww = content.children[row];
      var cell = roww.children[col];
      var $cell = $(cell);
      $cell.addClass('shortTermSolution');
    },

    _removeHighlightNearbyCells: function(row, col){
      this._removeHighlightCell( this._upperLeftCellCoordinates  (row, col) );
      this._removeHighlightCell( this._upperCellCoordinates      (row, col) );
      this._removeHighlightCell( this._upperRightCellCoordinates (row, col) );
      this._removeHighlightCell( this._leftCellCoordinates       (row, col) );
      this._removeHighlightCell( this._rightCellCoordinates      (row, col) );
      this._removeHighlightCell( this._lowerLeftCellCoordinates  (row, col) );
      this._removeHighlightCell( this._lowerCellCoordinates      (row, col) );
      this._removeHighlightCell( this._lowerRightCellCoordinates (row, col) );
    },

    _removeHighlightCell: function(cellCoordinates){
      var [row, col] = cellCoordinates;
      var content = document.getElementById('grid');
      var roww = content.children[row];
      var cell = roww.children[col];
      var $cell = $(cell);
      $cell.removeClass('shortTermSolution');
    },

    _updateFlagsInfo: function() {
      $('#bombs-remaining').html(this.NUM_BOMBS - this.FLAGS_USED);
    },

    _clearArea: function(cellCoordinates){
      var [row, col] = cellCoordinates;

      if (!this._isValidCell(row, col)) {
        return false;
      }

      var content = document.getElementById('grid');
      var roww = content.children[row];
      var cell = roww.children[col];
      var $cell = $(cell);

      if ($cell.hasClass('revealed')) {
        return false;
      }

      if (this.getCellValue(row, col) == this.DEFAULT_BOMB_VALUE) {
        this._revealBombs();
        this._displayGameOverMessage();
      }

      $cell.html(this.getCellValue(row, col));
      $cell.addClass('revealed');


      this.CLEARED_CELLS++;

      if(this.wonGame()){
        alert("You cleared all the mines. Congrats!!");
      }

      if (this.getCellValue(row, col) !== this.DEFAULT_EMPTY_VALUE) {
        return false;
      }

      this._clearArea( this._upperLeftCellCoordinates  (row, col) );
      this._clearArea( this._upperCellCoordinates      (row, col) );
      this._clearArea( this._upperRightCellCoordinates (row, col) );
      this._clearArea( this._leftCellCoordinates       (row, col) );
      this._clearArea( this._rightCellCoordinates      (row, col) );
      this._clearArea( this._lowerLeftCellCoordinates  (row, col) );
      this._clearArea( this._lowerCellCoordinates      (row, col) );
      this._clearArea( this._lowerRightCellCoordinates (row, col) );
    },

    wonGame: function (){
      return (this.CLEARED_CELLS === ((this.NUM_ROWS * this.NUM_COLS) - this.NUM_BOMBS));
    },

    _revealBombs: function(){
      for (var i = 0; i < this.NUM_ROWS; i++) {
        for (var j = 0; j < this.NUM_COLS; j++) {
          if (this.getCellValue(i, j) == this.DEFAULT_BOMB_VALUE) {
            var content = document.getElementById('grid');
            var roww = content.children[i];
            var cell = roww.children[j];
            var $cell = $(cell);
            $cell.html(this.getCellValue(i, j));
            $cell.addClass('bomb-exploded');
          }
        }
      }
    },

    _displayGameOverMessage: function() {
      this.cleanUpEvents();
      alert("Game Over");
    },

    cleanUpEvents: function() {
      $("#grid").off('contextmenu');
      $("#grid").off("click");
    },

    cleanUpDom: function(){
      $('#grid').empty();
    },

    restartGame: function(){
      this.cleanUpEvents();
      this.cleanUpDom();
      this._createGame();
    },
  };
}());
