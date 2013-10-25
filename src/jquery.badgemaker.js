var BadgeStyles = {
  'Shield': {
    'parameters': ['Base', 'Top Bend'],
    'shape': function(param1, param2) {
      if (typeof param1 === 'undefined') {
        param1 = 0.5; 
      }
      if (typeof param2 === 'undefined') {
        param2 = 0.5; 
      }

      var top = this.y + param2 * 0.1
      this.y = top;
      this.plot();

      this.x += 0.4;
      this.y = -0.45;
      this.plot(this.x - 0.15, top);


      var cpx = this.x;

      this.y += 0.7 * param1;
      this.plot();

      this.x = 0;
      this.y = 0.5;
      this.plot(cpx, 0.4);
    },
    'options': {
      stroke: 0.06
    }
  },

  'Shield Inset Corners': {
    'parameters': ['Base', 'Inset'],
    'shape': function(param1, param2) {
      if (typeof param1 === 'undefined') {
        param1 = 0.5; 
      }
      if (typeof param2 === 'undefined') {
        param2 = 0.5; 
      }

      this.plot();
      this.x += 0.35 - param2 * 0.1;
      this.plot();
      this.x += 0.05 + param2 * 0.1;
      this.y += 0.05 + param2 * 0.1;
      this.plot(this.x-(0.05 + param2 * 0.1), this.y);


      var cpx = this.x;

      this.y += 0.5 * param1;
      this.plot();

      this.x = 0;
      this.y = 0.5;
      this.plot(cpx, 0.4);
    },
    'options': {
      stroke: 0.06
    }
  },

  'Fancy Shield': {
    'parameters': ['Base', 'Top Bend'],
    'shape': function(param1, param2) {
      if (typeof param1 === 'undefined') {
        param1 = 0.5; 
      }
      if (typeof param2 === 'undefined') {
        param2 = 0.5; 
      }

      this.plot();
      this.x += 0.3;
      this.y += 0.05;
      this.plot(this.x-0.1-param2*0.05, this.y + param2*0.05);
      this.x = 0.4;
      this.y += 0.15;
      this.plot();

      this.y += 0.25;
      this.plot(this.x - 0.1, this.y - 0.15);

      var cpx = this.x + (0.1 * (1.5 + param1 * 0.8));
      var cpy = this.y + (0.15 * (1.5 + param1 * 0.8));

      this.x = 0;
      this.y = 0.5;
      this.plot(cpx, cpy);
    },
    'options': {
      stroke: 0.06
    }
  },

  'Seal': {
    'parameters': ['Number of Points', 'Smoothness', 'Pointiness'],
    'shape': function(param1, param2, param3) {
      if (typeof param1 === 'undefined') {
        param1 = 0.5; 
      }
      if (typeof param2 === 'undefined') {
        param2 = 0.5; 
      }

      if (typeof param3 === 'undefined') {
        param3 = param1;
      }

      var angle = Math.atan2(this.y, this.x);
      var divisions = Math.floor(3 + param1 * 7);
      var rad;
      var smallRad = 0.5 - 0.05 - (0.1 * (1-param3));
      var step = ((TAU / 2) / divisions) / 2;
      var curviness = 0.15 + 0.3 * param2;
      var cp1x, cp1y, cp2x, cp2y;

      for (var i = 0; i !== 2 * divisions + 1; ++i) {
        if (i % 2 == 0) {
          rad = smallRad;
          cp1x = Math.cos(angle-step*(1-curviness)) * 0.5;
          cp1y = Math.sin(angle-step*(1-curviness)) * 0.5;
          cp2x = Math.cos(angle-step*curviness) * rad;
          cp2y = Math.sin(angle-step*curviness) * rad;
        } else {
          rad = 0.5;

          cp1x = Math.cos(angle-step*(1-curviness)) * smallRad;
          cp1y = Math.sin(angle-step*(1-curviness)) * smallRad;
          cp2x = Math.cos(angle-step*curviness) * rad;
          cp2y = Math.sin(angle-step*curviness) * rad;
        }

        this.x = Math.cos(angle) * rad;
        this.y = Math.sin(angle) * rad;
        this.plot(cp1x, cp1y, cp2x, cp2y);



        angle += step;
      }
    },
    'options': {

      stroke: 0.02,
      detail: function(ctx, x, y, w, h, param1, param2, param3) {
        ctx.save();

        var smallRad = 0.5 - 0.05 - (0.1 * (1-param3));

        smallRad = smallRad * h;

        ctx.beginPath();
        ctx.arc(x, y, smallRad * 0.9, 0, TAU);
        ctx.lineWidth = h * 0.005;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(x, y, smallRad * 0.8, 0, TAU);
        ctx.lineWidth = h * 0.005;
        ctx.stroke();


        ctx.beginPath();
        ctx.arc(x, y, smallRad * 0.85, 0, TAU);
        ctx.lineWidth = h * 0.005;
        ctx.setLineDash([2,3]);
        ctx.stroke();

        ctx.restore();
      }
      // end detail

    }
  }
};

var TAU = Math.PI * 2;

(function ($) {
  // badgemaker plugin methods
  $.badgemaker = {
    init: function(options) {
      var ctx;
      var $tools = $('<div>').addClass('jq-badgemaker-tools');
      var $canvas = $('<canvas>').addClass('jq-badgemaker-canvas');
      var $loader = $('<img>').attr('src', options.loaderImg).css({
        position: 'absolute',
        left: (options.height/2 - options.loaderWidth/2) + 'px',
        top: (options.height/2 - options.loaderHeight/2) + 'px',
      }).hide();

      var img = new Image();

      this
        .css('position', 'relative')
        .addClass("jq-badgemaker")
        .width(options.width)
        .height(options.height)
        .append($canvas)
        .append($loader)
        .append($tools);

      $canvas.attr('width', options.height).width(options.height);
      $canvas.attr('height', options.height).height(options.height);

      $canvas.on('click', options.click);

      $tools.width(options.width-options.height);

      ctx = $canvas[0].getContext('2d');

      if (!ctx.setLineDash) {
        ctx.setLineDash = function () {};
      }

      this.data('canvas', $canvas[0]);
      this.data('ctx', ctx);
      this.data('image', img);
      this.data('tools', $tools);
      this.data('options', options);
      this.data('loader', $loader);

      var style = options.style;
      var size = options.height;
      var posX = size/2;
      var posY = size/2;

      var params = options.params;
      var imgScale = options.scale;

      $.badgemaker.drawBadge(options, ctx, style, posX, posY, size, params);

      var elt = this;
      img.onload = function() {
        $loader.hide();
        $.badgemaker.redraw(elt);
      };

      $loader.show();
      img.src = options.placeholderImg;

      $.badgemaker.buildTools(this, style);
    },

    setImage: function(url) {
      this.badgemaker('redraw', this, true);      

      var img = this.data('image');
      img.src = url;
      if (img.complete) {
        this.badgemaker('redraw', this);
      } else {
        this.data('loader').show();
      }
    },

    setColors: function(lightColor, darkColor) {
      var options = this.data('options');
      options.lightColor = lightColor;
      options.darkColor = darkColor;
      this.badgemaker('redraw');
    },

    setImageColor: function(color) {
      var options = this.data('options');
      options.imageColor = color;
      this.badgemaker('redraw');
    },

    setOption: function(opt, val) {
      var options = this.data('options');
      options[opt] = val;
    },

    getImage: function() {
      return this.data('canvas').toDataURL("image/png");
    },

    redraw: function(elt, skipImage) {
      if (!elt) {
        elt = this;
      }

      var options = elt.data('options');
      var ctx = elt.data('ctx');
      var img = elt.data('image');

      var style = options.style;
      var size = options.height;
      var params = options.params;
      var imgScale = options.scale;

      ctx.clearRect(0, 0, size, size);
      $.badgemaker.drawBadge(options, ctx, style, size/2, size/2, size, params);

      if (!skipImage) {
        $.badgemaker.drawImage(ctx, img, size/2, size/2, imgScale, options.imageColor);
      }

      options.change && options.change.call(elt);
    },

    buildTools: function(elt) {
      if (!elt) {
        elt = this;
      }

      var options = elt.data('options')

      var style = options.style;

      if (!options.showTools) {
        return;
      }

      var $tools = elt.data('tools');

      $tools.empty();

      var $styleMenu = $('<select>').addClass('jq-badgemaker-select');
      var numStyles = 0;
      $.each(options.badgeStyles, function(title, styleObj) {
        var $opt = $('<option>').text(title);
        $styleMenu.append(
          $opt
        );

        if (title === style) {
          $opt.attr('selected', 'selected');
        }

        numStyles++;
      });

      $styleMenu.on('change', function() {
        var style = $(this).find('option:selected').text();
        elt.data('options').style = style;
        $.badgemaker.redraw(elt);
        $.badgemaker.buildTools(elt);
      });


      if (numStyles > 1) {
        $tools.append($styleMenu);
      }

      var params = options.badgeStyles[style].parameters;

      $.each(params, function(i, param) {
        $tools.append($('<label>').text(param));
        $tools.append(
          $('<div>')
            .attr('id', 'slider-' + i)
            .data('index', i)
            .slider({
              min: 0,
              max: 1.0,
              value: 0.5,
              step: 0.01,
              orientation: 'horizontal',
              animate: true,
              slide: function(event, ui) {
                elt.data('options').params[$(this).data('index')] = ui.value;
                $.badgemaker.redraw(elt);
              }
            })
            .addClass('jq-badgemaker-slider')
        );
      });

      $tools.append($('<label>').text('Image Size'));
      $tools.append(
        $('<div>').slider({
          min: 0.25,
          max: 0.75,
          value: 0.5,
          step: 0.01,
          slide: function(event, ui) {
            elt.data('options').scale = ui.value;
            $.badgemaker.redraw(elt);
          }
        })
        .addClass('jq-badgemaker-slider')
      );

    },

    drawImage: function(ctx, img, posX, posY, imgScale, color) {
      var buffer, bx;

      if (!color) {
        color = '#FFFFFF';
      }

      buffer = document.createElement('canvas');
      buffer.width = img.width;
      buffer.height = img.height;
      bx = buffer.getContext('2d');

      bx.fillStyle = color;
      bx.fillRect(0, 0, buffer.width, buffer.height);

      bx.globalCompositeOperation = "destination-atop";
      bx.drawImage(img, 0, 0);

      ctx.save();

      ctx.globalCompositeOperation = 'source-atop';

      ctx.translate(posX, posY);
      ctx.scale(imgScale, imgScale);
      ctx.drawImage(buffer, -buffer.width/2, -buffer.height/2, buffer.width, buffer.height);

      ctx.restore();
    },

    drawBadge: function(options, ctx, style, posX, posY, size, params) {
      var badgeStyle = options.badgeStyles[style];
      var styleOptions = badgeStyle.options;

      var lightColor = options.lightColor;  
      var darkColor  = options.darkColor;

      var shape = $.badgemaker.generateShape.apply(null, [badgeStyle].concat(params));

      if (styleOptions.stroke) {
        ctx.strokeStyle = lightColor;
        ctx.fillStyle = darkColor;
        size *= (1-styleOptions.stroke);
        ctx.lineWidth = styleOptions.stroke * size;
      } else {
        ctx.fillStyle = lightColor;
      }

      $.badgemaker.drawBadgeShape(ctx, shape, posX, posY, size, size);
      if (styleOptions.stroke) {
        ctx.stroke();
      }

      if (styleOptions.detail) {
        ctx.strokeStyle = lightColor;
        styleOptions.detail.apply(null, [ctx, posX, posY, size, size].concat(params));
      }
    },

    generateShape: function(badgeStyle, p1, p2, p3) {
      var shape = [];

      var context = {
        x: 0,
        y: -0.5,
        plot: function(cx, cy, c2x, c2y) {
          shape.push({
            x: this.x, y: this.y,
            cx: cx, cy: cy,
            c2x: c2x, c2y: c2y
          });
        }
      };

      badgeStyle.shape.call(context, p1, p2, p3);

      var mirror = shape.slice(0).reverse();

      var nextCP;
      var nextCP2;
      $.each(mirror, function(i, point) {
        var cx, cy, c2x, c2y;

        if (nextCP) {
          cx = -nextCP.x;
          cy = nextCP.y;
        }

        if (nextCP2) {
          cx = -nextCP2.x;
          cy = nextCP2.y;

          c2x = -nextCP.x;
          c2y = nextCP.y;
        }

        shape.push({
          x: -point.x,
          y: point.y,
          cx: cx,
          cy: cy,
          c2x: c2x,
          c2y: c2y
        });

        if (typeof point.cx !== 'undefined') {
          nextCP = {x: point.cx, y: point.cy};
        } else {
          nextCP = null;
        }

        if (typeof point.c2x !== 'undefined') {
          nextCP2 = {x: point.c2x, y: point.c2y};
        } else {
          nextCP2 = null;
        }
      });

      return shape;
    },

    drawBadgeShape: function(ctx, shape, centerX, centerY, width, height) {
      ctx.beginPath(); 

      $.each(shape, function(i, point) {
        if (i === 0) {
          ctx.moveTo(centerX + point.x * width, centerY + point.y * height);
        } else if (typeof point.cx === 'undefined') {
          ctx.lineTo(centerX + point.x * width, centerY + point.y * height);
        } else if (typeof point.c2x === 'undefined') {
          ctx.quadraticCurveTo(
            centerX + point.cx * width,
            centerY + point.cy * height,
            centerX + point.x  * width,
            centerY + point.y  * height
          );
        } else {
          ctx.bezierCurveTo(
            centerX + point.cx * width,
            centerY + point.cy * height,
            centerX + point.c2x * width,
            centerY + point.c2y * height,
            centerX + point.x  * width,
            centerY + point.y  * height
          );
        }
      });

      ctx.closePath();
      ctx.fill();
    }
  };

  // badgemaker element plugin
  $.fn.badgemaker = function() {
    var action, args;
    var options = {
      loaderImg: 'loader.gif',
      placeholderImg: 'placeholder.png',
      loaderWidth: 48,
      loaderHeight: 64,
      width: 512,
      height: 256,
      lightColor: '#ccccff',
      darkColor: '#8888ff',
      click: function() {

      },
      style: 'Shield',
      badgeStyles: BadgeStyles,
      params: [0.5, 0.5, 0.5],
      scale: 0.5,
      showTools: true
    };

    if (typeof arguments[0] === 'string') {
      action = arguments[0];
      args = Array.prototype.slice.call(arguments, 1);

      var returnVal = null;
      this.each(function(i, elt) {
        returnVal = $.badgemaker[action].apply($(elt), args);
      });

      if (returnVal) {
        return returnVal;
      }
    } else if (typeof arguments[0] === 'object') {
      options = $.extend(options, arguments[0]);

      this.each(function(i, elt) {
        $.badgemaker.init.call($(elt), options);
      });
    }

    return this;
  };

}(jQuery));
