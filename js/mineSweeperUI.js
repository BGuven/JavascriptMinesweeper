var MineSweeperUI = $.extend(MineSweeper, (function(){
  "use strict"

  return {
    FLAGS_USED: 0,
    CLEARED_CELLS: 0,

    FULLSCREEN: true,

    CELL_CSS_PROPERTIES: {
      "width": "20",
      "height": "20",
    },

    CELL_WIDTH: "20",
    CELL_HEIGHT: "20",

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
      this.setupGrid();
      this.setupBombs();
      this._calculateCellValues();
      this._setupCellClicks(this);
      this._displayGrid();
      this._updateFlagsInfo();
      console.log(this.CLEARED_CELLS, ((this.NUM_ROWS * this.NUM_COLS) - this.NUM_BOMBS), this.NUM_BOMBS);
    },

    _calculateNumberOfRowsAndCols: function (){
      var height = $('#grid').height();
      var width = $('#grid').width();

      this.NUM_ROWS = Math.floor(height / this.CELL_HEIGHT);
      this.NUM_COLS = Math.floor(width / this.CELL_WIDTH);
      console.log('Rows:', this.NUM_ROWS, 'Cols:', this.NUM_COLS);
    },

    _displayGrid: function(){
      var $div = $('<div />', {
        "class": "cell"
      });

      $div.css({
        width: this.CELL_WIDTH + "px",
        height: this.CELL_HEIGHT + "px",
        "line-height": this.CELL_HEIGHT + "px",
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

      $("#grid").on("click", ".cell:not('.marked')", function(event) {
        var row = parseInt($(this).attr('row')),
            col = parseInt($(this).attr('col'));
        self.clearArea([row, col]);
      });

      $("#grid").on("mousedown", ".cell.revealed", function(event) {
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

      var content = document.getElementById('grid');
      var roww = content.children[row];
      var cell = roww.children[col];
      var $cell = $(cell);

      if (!$cell.hasClass('revealed') && !$cell.hasClass('marked')) {
        $cell.addClass('shortTermSolution');
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

      var content = document.getElementById('grid');
      var roww = content.children[row];
      var cell = roww.children[col];
      var $cell = $(cell);
      $cell.removeClass('shortTermSolution');
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
      $("#grid").off("mousedown");
      $(document).off("mouseup");
    },

    cleanUpDom: function(){
      $('#grid').empty();
    },

    restartGame: function(){
      this.cleanUpEvents();
      this.cleanUpDom();
      this._createGame();
    },

    clearArea: function(cellCoordinates){
      var row = cellCoordinates[0],
          col = cellCoordinates[1];

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