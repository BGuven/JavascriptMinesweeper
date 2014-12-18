var MineSweeperUI = $.extend(MineSweeper, (function(){
  "use strict"

  return {
    grid: document.getElementById('grid'),
    $grid: $('#grid'),

    FLAGS_USED: 0,
    CLEARED_CELLS: 0,

    FULLSCREEN: !!true,

    CELL_CSS_PROPERTIES: {
      "width": "20px",
      "height": "20px",
      "line-height": "20px"
    },

    CELL_WIDTH: "20",
    CELL_HEIGHT: "20",

    init: function(){
      this._setupRestartButton();
      this.createGame();
    },

    _setupRestartButton: function(){
      (function(self){
        $("#restart-button").click(function(){
          console.log('restarting game');
          self.restartGame();
        });
      }(this));
    },

    createGame: function(){
      this.CLEARED_CELLS = 0;
      this.FLAGS_USED = 0;
      this._calculateNumberOfRowsAndCols();
      this._calculateNumberOfBombs(); // Can be moved up..
      this.setupGrid();
      this.setupBombs();
      this._calculateCellValues();
      this._setupCellClicks(this);
      this._displayGrid();
      this._updateFlagsInfo();
    },

    _calculateNumberOfRowsAndCols: function (){
      if (this.FULLSCREEN) {
        var height = this.$grid.height(),
            width = this.$grid.width();

        this.NUM_ROWS = Math.floor(height / this.CELL_HEIGHT);
        this.NUM_COLS = Math.floor(width / this.CELL_WIDTH);
      }
    },

    _displayGrid: function(){
      var $div = $('<div />', {
        "class": "cell"
      });

      $div.css(this.CELL_CSS_PROPERTIES);

      for (var i = 0; i < this.NUM_ROWS; i++) {
        var $row = $('<div />', {
          "class": "row"
        });

        for (var j = 0; j < this.NUM_COLS; j++) {
          $div.attr({row: i, col: j});
          $row.append($div.clone());
        };

        this.$grid.append($row);
      }
    },

    _setupCellClicks: function(self){
      this.$grid.on('contextmenu', ".cell", function(e){
        e.preventDefault();

        if ($(this).hasClass('revealed')) {
          return;
        }

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

      this.$grid.on("click", ".cell:not('.marked')", function(event) {
        var row = parseInt($(this).attr('row')),
            col = parseInt($(this).attr('col'));

        self.clearArea([row, col]);
      });

      this.$grid.on("mousedown", ".cell.revealed", function(event) {
        var row = parseInt($(this).attr('row')),
            col = parseInt($(this).attr('col'));

        self._highlightNearbyCells(row, col);

        $(document).on("mouseup", function(event) {
          self._removeHighlightNearbyCells(row, col);
        });
      });
    },

    _highlightNearbyCells: function(row, col){
      this._highlightCell( this.upperLeftCellCoordinates  (row, col) );
      this._highlightCell( this.upperCellCoordinates      (row, col) );
      this._highlightCell( this.upperRightCellCoordinates (row, col) );
      this._highlightCell( this.leftCellCoordinates       (row, col) );
      this._highlightCell( this.rightCellCoordinates      (row, col) );
      this._highlightCell( this.lowerLeftCellCoordinates  (row, col) );
      this._highlightCell( this.lowerCellCoordinates      (row, col) );
      this._highlightCell( this.lowerRightCellCoordinates (row, col) );
    },

    _highlightCell: function(cellCoordinates){
      var row = cellCoordinates[0],
          col = cellCoordinates[1];

      if (!this._isValidCell(row, col)) {
        return false;
      }

      var $cell = this.findCell(row, col);

      if (!$cell.hasClass('revealed') && !$cell.hasClass('marked')) {
        $cell.addClass('highlight');
      }
    },

    _removeHighlightNearbyCells: function(row, col){
      this._removeHighlightCell( this.upperLeftCellCoordinates  (row, col) );
      this._removeHighlightCell( this.upperCellCoordinates      (row, col) );
      this._removeHighlightCell( this.upperRightCellCoordinates (row, col) );
      this._removeHighlightCell( this.leftCellCoordinates       (row, col) );
      this._removeHighlightCell( this.rightCellCoordinates      (row, col) );
      this._removeHighlightCell( this.lowerLeftCellCoordinates  (row, col) );
      this._removeHighlightCell( this.lowerCellCoordinates      (row, col) );
      this._removeHighlightCell( this.lowerRightCellCoordinates (row, col) );
    },

    _removeHighlightCell: function(cellCoordinates){
      var row = cellCoordinates[0],
          col = cellCoordinates[1];

      if (!this._isValidCell(row, col)) {
        return false;
      }

      var $cell = this.findCell(row, col);
      $cell.removeClass('highlight');
    },

    _updateFlagsInfo: function() {
      $('#bombs-remaining').html(this.NUM_BOMBS - this.FLAGS_USED);
    },

    wonGame: function (){
      return (this.CLEARED_CELLS === ((this.NUM_ROWS * this.NUM_COLS) - this.NUM_BOMBS));
    },

    _revealBombs: function(){
      for (var i = 0; i < this.NUM_ROWS; i++) {
        for (var j = 0; j < this.NUM_COLS; j++) {
          if (this.getCellValue(i, j) == this.DEFAULT_BOMB_VALUE) {
            var $cell = this.findCell(i, j);
            $cell.html(this.getCellValue(i, j));
            $cell.addClass('bomb-exploded');
          }
        }
      }
    },

    _displayGameOverMessage: function() {
      this.cleanUpEvents();
      console.log("Game Over");
    },

    cleanUpEvents: function() {
      this.$grid.off('contextmenu');
      this.$grid.off("click");
      this.$grid.off("mousedown");
      $(document).off("mouseup");
    },

    cleanUpDom: function(){
      this.$grid.empty();
    },

    restartGame: function(){
      this.cleanUpEvents();
      this.cleanUpDom();
      this.createGame();
    },

    findCell: function(row, col){
      var cell = self.grid.children[row].children[col]
      var $cell = $(cell);

      return $cell;
    },

    clearArea: function(cellCoordinates){
      var row = cellCoordinates[0],
          col = cellCoordinates[1];

      if (!this._isValidCell(row, col)) {
        return false;
      }

      var $cell = this.findCell(row, col);

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
        console.log("You cleared all the mines. Congrats!!");
      }

      if (this.getCellValue(row, col) !== this.DEFAULT_EMPTY_VALUE) {
        return false;
      }

      this.clearArea( this.upperLeftCellCoordinates  (row, col) );
      this.clearArea( this.upperCellCoordinates      (row, col) );
      this.clearArea( this.upperRightCellCoordinates (row, col) );
      this.clearArea( this.leftCellCoordinates       (row, col) );
      this.clearArea( this.rightCellCoordinates      (row, col) );
      this.clearArea( this.lowerLeftCellCoordinates  (row, col) );
      this.clearArea( this.lowerCellCoordinates      (row, col) );
      this.clearArea( this.lowerRightCellCoordinates (row, col) );
    },
  };
}()));
