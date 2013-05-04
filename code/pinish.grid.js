/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2013 Carlos Yslas Altamirano necros.mx@gmail.com
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function ($) {

  function createPinishGrid(el, options) {
    var that = $.extend({}, options);
    var $el = $(el);
    var tileWidth = $el.find('.tile').first().width() || 1;
    var timer;

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
      columProperties.columnTopValues = {};

      for(var i = 1; i <= alowedColumns; i += 1) {
        columProperties.columnTopValues[i] = tileMargin;
      }

      return columProperties;
    }

    function getSmallestColumn(columnTopValues) {
      var minValue = columnTopValues[1];
      var minIndex = 1;
      for (var i in columnTopValues) {
        if (columnTopValues[i] < minValue) {
          minValue = columnTopValues[i];
          minIndex = i;
        }
      }
      
      return minIndex;
    }

    function setTilePositions(columnProperties) {
      var columnTopValues = columnProperties.columnTopValues;

      $el.find('.tile').each(function () {
        var $tile = $(this);
        var height = $tile.outerHeight();
        var column = getSmallestColumn(columnTopValues);
        
        $tile.attr('data-column', column);

        $tile[!!that.animate ? 'animate' : 'css']({
          top: columnTopValues[column],
          left: ((tileWidth + columnProperties.tileMargin) * (column - 1)) + columnProperties.tileMargin
        });

        columnTopValues[column] += height + columnProperties.tileMargin;
        
      });
    }

    //public functions

    function update() {
      var columProperties = calculateColumnProperties();
      
      $el.find('.tile').css('margin', columProperties.tileMargin);
      
      setTilePositions(columProperties);
    }

    //Event handlers
    function handleAttachedToResize(ev) {
      timer && clearTimeout(timer);
      timer = setTimeout(update, 500);
    }

    //initialization
    function bind() {
      $(that.attachTo).on('resize', handleAttachedToResize);
      $(that.attachTo).on('load', function () {
        $el.fadeIn();
        update();
      });
    }
    $el.hide();// may be a loading stuff?
    bind();
    
    //publishing methods
    that.update = update;

    return that;
  }
  
  $.fn.pinishGrid = function (options) {
    return this.each(function () {
      var $this = $(this);
      
      var plugin = createPinishGrid(this, options);
      
      $this.data('pinishGrid', plugin);
    });
  };
  
})(jQuery);
