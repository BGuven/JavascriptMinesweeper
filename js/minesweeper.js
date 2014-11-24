MineSweeper = {
  NUM_ROWS: 25,
  NUM_COLS: 50,
  NUM_BOMBS: 40,
  DEFAULT_EMPTY_VALUE: "",
  DEFAULT_BOMB_VALUE: "*",

  grid: [],

  init: function(){
    this._setupGrid();
    this._setupBombs();
    this._markCells();

    this.setupCellClicks(this);

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
        $div.attr({row: i, col: j});
        $row.append($div.clone());
      };

      $('#content').append($row);
    }
  },

  setupCellClicks: function(self){
    $(document).on('contextmenu', ".cell", function(){
      $(this).addClass('marked');
      return false;
    });

    $(document).on("click", ".cell", function(event) {
      row = $(this).attr('row');
      col = $(this).attr('col');
      self.clearArea(row, col);
    });
  },

  clearArea: function(row, col){
    row = parseInt(row);
    col = parseInt(col);

    if (!this._isValidCell(row, col)) {
      return false;
    }

    // var selector = "div.cell[row=" + row + "][col=" + col + "]";
    // $cell = $(selector);

    // var selector = "div.row:nth-child(" + (row+1) +") div.cell:nth-child(" + (col+1) + ")";
    // $cell = $(selector);

    var content = document.getElementById('content');
    var roww = content.children[row];
    var cell = roww.children[col];
    var $cell = $(cell);

    if ($cell.hasClass('revealed')) {
      return false;
    }

    $cell.html(this.getCell(row, col));
    $cell.addClass('revealed');

    if (this.getCell(row, col) !== "") {
      return false;
    }

    this.clearArea(row-1, col-1);
    this.clearArea(row  , col-1);
    this.clearArea(row+1, col-1);
    this.clearArea(row-1, col  );
    this.clearArea(row+1, col  );
    this.clearArea(row-1, col+1);
    this.clearArea(row  , col+1);
    this.clearArea(row+1, col+1);
  },
}


