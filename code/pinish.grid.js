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
    var tileWidth = $el.find('.tile').first().outerWidth() || 1;
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
      var tileMargin = Math.floor(remainingMargin / ((alowedColumns - 1) * 2));
      console.log('allowedColumns', alowedColumns);
      console.log('tileWidth', tileWidth);
      console.log(remainingMargin);
      console.log(tileMargin);

      columProperties.alowedColumns = alowedColumns;
      columProperties.tileMargin = tileMargin;
      columProperties.columnTopValues = {};

      for(var i = 1; i <= alowedColumns; i += 1) {
        columProperties.columnTopValues[i] = 7;//tileMargin;
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
          left: ((tileWidth + (columnProperties.tileMargin * 2)) * (column - 1))
        });
        
        columnTopValues[column] += height + 7;//columnProperties.tileMargin;
        
      });
    }

    function buildTile(tileJson) {
      var $tile = $('<div class="tile"/>'),
          $img = $('<img/>'),
          $loadingMask = $('<div class="loading-mask"/>');
      $img.attr('height', tileJson.height).
        attr('width', tileJson.width).
        attr('src', tileJson.imageURL);
      $img.on('load', handleImageLoaded);
      $tile.append($img)
        .append($loadingMask)
        .addClass('loading');
      return $tile;
    }

    function attachJsonTiles(jsonTiles) {
      for (var i = 0, len = jsonTiles.length; i < len; i += 1) {
        $el.append(buildTile(jsonTiles[i]));
      }
      tileWidth = $el.find('.tile').first().outerWidth() || 1;      
    }

    //public function

    function update() {
      var columProperties = calculateColumnProperties();
      
      setTilePositions(columProperties);
    }

    //Event handlers
    function handleAttachedToResize(ev) {
      timer && clearTimeout(timer);
      timer = setTimeout(update, 500);
    }
    function handleImageLoaded(ev) {
      var $this = $(this),
          $tile = $this.parents('.tile');
      $tile.removeClass('loading');
      $tile.find('.loading-mask').fadeOut(500);
    }

    //initialization
    function bind() {
      $(that.attachTo).on('resize', handleAttachedToResize);
    }
    //$el.hide();// may be a loading stuff?
    attachJsonTiles(that.jsonTiles);
    //update();
    bind();
    update();
    
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
