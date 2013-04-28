(function ($) {

  function createPinishGrid(el, options) {
    var that = $.extend({}, options);
    var $el = $(el);
    var tileWidth = $el.find('.tile').first().width() || 1;

    //attachTo option helps to automatically bind window resize event
    if (!that.attachTo) {
      throw new Error('Plugin must be attached to a resizable DOM element.');
    }

    //Private functions
    function calculateColumnProperties() {
      var columProperties = {};
      var alowedColumns = Math.floor($el.width() / tileWidth);
      var remainingMargin = $el.width() % tileWidth;
      var tileMargin = Math.floor(remainingMargin / (alowedColumns * 2));

      columProperties.alowedColumns = alowedColumns;
      columProperties.tileMargin = tileMargin;

      return columProperties;
    }

    function setColumnsToTiles(columnProperties) {
      var column = 1;
      $el.find('.tile').each(function () {
        $(this).attr('data-column', column);

        column += 1;
        if (column > columnProperties.alowedColumns) {
          column = 1;
        }
      });
    }

    function setTilePositions(columnProperties) {
      var columnTops = {};
      $el.find('.tile').each(function () {
        var $this = $(this);
        var column = $this.attr('data-column');
        var height = $this.outerHeight();
        if (!columnTops[column]) {
          columnTops[column] = columnProperties.tileMargin;
        }
        console.log(column);

        $this.css({
          top: columnTops[column],
          left: ((tileWidth + columnProperties.tileMargin) * (column - 1)) + columnProperties.tileMargin
        });

        columnTops[column] += height + columnProperties.tileMargin;
      });
    }

    //Event handlers
    function handleAttachedToResize(ev) {
      var columProperties = calculateColumnProperties();
      console.log(columProperties);
      $el.find('.tile').css('margin', columProperties.tileMargin);
      setColumnsToTiles(columProperties);
      setTilePositions(columProperties);
    }

    function bind() {
      $(that.attachTo).on('resize', handleAttachedToResize);
    }
    
    bind();

    return that;
  }
  
  $.fn.pinishGrid = function (options) {
    return this.each(function () {
      var $this = $(this);
      
      var plugin = createPinishGrid(this, options);

      
      $this.data('pinishGrid', plugin);

      //return this;
    });
  };
  
})(jQuery);
