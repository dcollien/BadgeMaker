(function($) {
  var pluginName = 'badgeEditor';

  function shadeColor(color, percent) {   
  var num = parseInt(color.slice(1),16), amt = Math.round(2.55 * percent), R = (num >> 16) + amt, B = (num >> 8 & 0x00FF) + amt, G = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
  };

  // A colour palette to choose from
  var ColorPalette = [
    ['#ED5565', '#DA4453'],
    ['#FC6E51', '#E9573F'],
    ['#FFCE54', '#F6BB42'],
    ['#A0D468', '#8CC152'],
    ['#48CFAD', '#37BC9B'],
    ['#4FC1E9', '#3BAFDA'],
    ['#5D9CEC', '#4A89DC'],
    ['#AC92EC', '#967ADC'],
    ['#EC87C0', '#D770AD'],
    ['#CCD1D9', '#AAB2BD'],
    ['#656D78', '#434A54']
  ];

  // lighten the light colors a bit more (8%)
  $.each(ColorPalette, function(i, colors) {
    colors[0] = shadeColor(colors[0], 8);
  });

  var Constructor = function($container, options) {
    var self = this;

    self.isDisabled = false;
    self.$container = $container;
    self.options = options;

    $container.html(
      $('<div>')
        .append($('<div>').addClass('badgeEditor'))
        .append($('<div>').addClass('badgeEditor-colors').addClass('pull-right'))
        .append($('<div>').css('clear', 'both'))
        .append(
          $('<div>').addClass('badgeEditor-images-popover').hide().append(
            $('<div>').addClass('badgeEditor-images')
          )
        )
    );
    
    // add images to categories
    var loadImages = function() {
      var loadList = function($ul) {
        if ($ul.data('loaded')) {
          return;
        }

        $.each($ul.data('imageList'), function(i, path) {
          $ul.append(
            $('<li>').append($('<img>')
              .attr('src', self.options.badgeImagePath + '/thumbnails/' + path)
              .click(function() {
                self.$('.badgeEditor').badgemaker('setImage', $(this).attr('src').replace('thumbnails', 'images'));
              })
              .css('cursor', 'pointer')
            )
          );
        });
        $ul.data('loaded', true);
      };

      var lastCategory;
      $.each(ImageRepo.reverse(), function(i, path) {
        var listing = [];
        var category = path.split(/\//g)[0];
        var $ul;
        if (category !== lastCategory) {    
          self.$('.badgeEditor-images').append($('<ul>').hide()); 
        }

        lastCategory = category;

        // add to chooser
        $ul = self.$('.badgeEditor-images ul').last();
        listing = $ul.data('imageList');
        if (!listing) {
          listing = [];
        }

        listing.push(path);
        $ul.data('imageList', listing);
      });

      var $images = self.$('.badgeEditor-images');

      while ($images[0].scrollHeight === $images.height()) {
        loadList(self.$('.badgeEditor-images ul:hidden').first().show());
      }

      self.$('.badgeEditor-images').scroll(function(evt) {
        var scrollHeight = $(this)[0].scrollHeight;
        var innerHeight = $(this).innerHeight();
        var scrollTop = $(this).scrollTop();
        var tolerance = 8;

        if ((scrollHeight - innerHeight) <= (scrollTop + tolerance)) {
          loadList(self.$('.badgeEditor-images ul:hidden').first().show());
        }
      });
    };

    var badgeMakerOptions = {
      loaderImg: self.options.badgeImagePath + 'loader.gif',
      placeholderImg: self.options.badgeImagePath + 'placeholder.png',
      lightColor: ColorPalette[6][0],
      darkColor: ColorPalette[6][1],
      click: function() {
        self.$('.badgeEditor-images-popover').toggle();
        if (!self.$('.badgeEditor-images-popover').data('isLoaded')) {
          loadImages();
          self.$('.badgeEditor-images-popover').data('isLoaded', true);
        }
        self.options.click && self.options.click();
      },
      onLoadStart: function() {
        self.isDisabled = true;
      },
      onLoad: function() {
        self.isDisabled = false;
      }
    };

    if (self.options.badgeStyles) {
      badgeMakerOptions.badgeStyles = self.options.badgeStyles;
    }

    if (self.options.defaultStyle) {
      badgeMakerOptions.style = self.options.defaultStyle;
    }

    self.$('.badgeEditor').badgemaker(badgeMakerOptions).mousedown(function(evt) {
      if (!$(evt.target).is('canvas')) {
        self.$('.badgeEditor-images-popover').hide();
      }
    });

    self.$('.badgeEditor').css('width', '532px');

    // draw the color palette
    $.each(ColorPalette, function(i, colors) {
      self.$('.badgeEditor-colors').append(
        $('<div>')
          .addClass('color-choice')
          .append(
            $('<div>')
              .addClass('color-swatch')
              .css('background-color', colors[0])
          )
          .append(
            $('<div>')
              .addClass('color-swatch')
              .css('background-color', colors[1])
          )
          .click(function() {
            if (!self.isDisabled) {
              self.$('.badgeEditor').badgemaker('setColors', colors[0], colors[1]);
            }
          })
      );
    });
  };

  $.extend(Constructor.prototype, {
    $: function(selector) {
        return this.$container.find(selector);
    },

    'getImage': function() {
      return this.$('.badgeEditor').badgemaker('getImage');
    }
  });

  $.makePlugin(pluginName, Constructor, {}, {
    'getImage': function($elt) {
        var editor = $elt.data(pluginName);
        return editor.getImage();
    }
  });
})(jQuery);
