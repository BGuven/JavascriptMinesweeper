MineSweeper = {
  self: this,
  FULLSCREEN: true,

  CELL_WIDTH: "20",
  CELL_HEIGHT: "20",

  CELL_BOMB_RATIO: 100,

  NUM_ROWS: 16,
  NUM_COLS: 30,
  NUM_BOMBS: 50,


  DEFAULT_EMPTY_VALUE: "",
  DEFAULT_BOMB_VALUE: "*",


  FLAGS_USED: 0,
  CLEARED_CELLS: 0,

  grid: [],

  init: function(){
    this._calculateNumberOfRowsAndCols();
    this._calculateNumberOfBombs();
    this._setupGrid();
    this._setupBombs();
    this._calculateCellValues();
    this._setupCellClicks(this);
    this._displayGrid();

    console.log(this.CLEARED_CELLS, ((this.NUM_ROWS * this.NUM_COLS) - this.NUM_BOMBS), this.NUM_BOMBS);

  },

  getCellValue: function(row, col){
    return this.grid[row][col];
  },

  setCellValue: function(row, col, value){
    this.grid[row][col] = value;
  },

  _calculateNumberOfRowsAndCols: function (){
    var height = $(document).height();
    var width = $(document).width();

    this.NUM_ROWS = Math.floor(height / this.CELL_HEIGHT);
    this.NUM_COLS = Math.floor(width / this.CELL_WIDTH);
    console.log('Rows:', this.NUM_ROWS, 'Cols:', this.NUM_COLS);
  },

  _calculateNumberOfBombs: function(){
    this.NUM_BOMBS = Math.floor((this.NUM_ROWS * this.NUM_COLS) / this.CELL_BOMB_RATIO);
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
      if (this.getCellValue(row, col) !== this.DEFAULT_BOMB_VALUE) {
        this.setCellValue(row, col, this.DEFAULT_BOMB_VALUE);
        bombsInstalledSoFar++;
      }
    }
  },

  _getRandomCellLocation: function(){
    randomRow = this._getRandomIntegerInRange(0, this.NUM_ROWS);
    randomCol = this._getRandomIntegerInRange(0, this.NUM_COLS);
    return [randomRow, randomCol];
  },

  _getRandomIntegerInRange: function(lowerBound, upperBound) {
    return lowerBound + Math.floor(Math.random() * upperBound);
  },


  _calculateCellValues: function() {
    for (var i = 0; i < this.NUM_ROWS; i++) {
      for (var j = 0; j < this.NUM_COLS; j++) {
        cellValue = this.getCellValue(i, j);

        if (cellValue !== this.DEFAULT_BOMB_VALUE) {
          numberOfBombsAround = this._getNumberOfSurroundingBombs(i, j);
          if (numberOfBombsAround != 0) {
            this.setCellValue(i, j, numberOfBombsAround);
          }
        }
      }
    }
  },

  _getNumberOfSurroundingBombs: function(row, col) {
    value = 0;

    (this._isValidCell(row-1, col-1)) ? cellValue = this.getCellValue(row-1, col-1) : cellValue = -1;
    (cellValue == -1 || cellValue !== this.DEFAULT_BOMB_VALUE) ? value : value++;

    (this._isValidCell(row  , col-1)) ? cellValue = this.getCellValue(row  , col-1) : cellValue = -1;
    (cellValue == -1 || cellValue !== this.DEFAULT_BOMB_VALUE) ? value : value++;

    (this._isValidCell(row+1, col-1)) ? cellValue = this.getCellValue(row+1, col-1) : cellValue = -1;
    (cellValue == -1 || cellValue !== this.DEFAULT_BOMB_VALUE) ? value : value++;

    (this._isValidCell(row-1, col  )) ? cellValue = this.getCellValue(row-1, col  ) : cellValue = -1;
    (cellValue == -1 || cellValue !== this.DEFAULT_BOMB_VALUE) ? value : value++;

    (this._isValidCell(row+1, col  )) ? cellValue = this.getCellValue(row+1, col  ) : cellValue = -1;
    (cellValue == -1 || cellValue !== this.DEFAULT_BOMB_VALUE) ? value : value++;

    (this._isValidCell(row-1, col+1)) ? cellValue = this.getCellValue(row-1, col+1) : cellValue = -1;
    (cellValue == -1 || cellValue !== this.DEFAULT_BOMB_VALUE) ? value : value++;

    (this._isValidCell(row  , col+1)) ? cellValue = this.getCellValue(row  , col+1) : cellValue = -1;
    (cellValue == -1 || cellValue !== this.DEFAULT_BOMB_VALUE) ? value : value++;

    (this._isValidCell(row+1, col+1)) ? cellValue = this.getCellValue(row+1, col+1) : cellValue = -1;
    (cellValue == -1 || cellValue !== this.DEFAULT_BOMB_VALUE) ? value : value++;

    return value;
  },

  _isValidCell: function(row, col){
    return this._isValueInRange(0, this.NUM_ROWS-1, row) && this._isValueInRange(0, this.NUM_COLS-1, col);
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

      $('#content').append($row);
    }
  },

  _setupCellClicks: function(self){
    $(document).on('contextmenu', ".cell", function(e){
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

    $(document).on("click", ".cell:not('.marked')", function(event) {
      row = $(this).attr('row');
      col = $(this).attr('col');
      self._clearArea(row, col);
    });
  },

  _updateFlagsInfo: function() {
    $('#bombs-remaining').html(this.NUM_BOMBS - this.FLAGS_USED);
  },

  _clearArea: function(row, col){
    row = parseInt(row);
    col = parseInt(col);

    if (!this._isValidCell(row, col)) {
      return false;
    }

    var content = document.getElementById('content');
    var roww = content.children[row];
    var cell = roww.children[col];
    var $cell = $(cell);

    if ($cell.hasClass('revealed')) {
      return false;
    }

    if (this.getCellValue(row, col) == this.DEFAULT_BOMB_VALUE) {
      this._displayAllBombs();
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


    this._clearArea(row-1, col-1);
    this._clearArea(row  , col-1);
    this._clearArea(row+1, col-1);
    this._clearArea(row-1, col  );
    this._clearArea(row+1, col  );
    this._clearArea(row-1, col+1);
    this._clearArea(row  , col+1);
    this._clearArea(row+1, col+1);
  },

  wonGame: function (){
    return (this.CLEARED_CELLS === ((this.NUM_ROWS * this.NUM_COLS) - this.NUM_BOMBS));
  },

  _displayAllBombs: function(){
    for (var i = 0; i < this.NUM_ROWS; i++) {
      for (var j = 0; j < this.NUM_COLS; j++) {
        if (this.getCellValue(i, j) == this.DEFAULT_BOMB_VALUE) {
          var content = document.getElementById('content');
          var roww = content.children[i];
          var cell = roww.children[j];
          var $cell = $(cell);
          $cell.html(this.getCellValue(i, j));
        }
      }
    }
  },

  _displayGameOverMessage: function() {
    alert("Game Over");
  },
}
