BadgeMaker
==========

Demo in index.html

Init:
    $('#someId').badgemaker({
      width: 512,
      height: 256,
      lightColor: '#ccccff',
      darkColor: '#8888ff',
      click: function() {
        console.log('clicked on badge');
      },
      change: function() {
        console.log('changed');
      },
      style: 'Shield',
      params: [0.5, 0.5, 0.5],
      scale: 0.5,
      showTools: true
    })
    
API:
    $('#someId').badgemaker('setImage', 'some image url');
    
    $('#someId').badgemaker('setColors', '#cccccc', '#888888');
    
    var dataURI = $('#someId').badgemaker('getImage');
    
