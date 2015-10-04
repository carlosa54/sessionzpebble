var UI = require('ui');
var ajax = require('ajax');
var Vector2 = require('vector2');
var Vibe = require('ui/vibe');

var parseFeed = function(data, quantity) {
  var tasks = [];
  for (var i = 0; i < Object.keys(data).length; i++){
        var title = data[i].title;
        var duration = data[i].duration;  
        
        tasks.push({title: title, duration: duration});
  }
  
  return tasks;
};

// Show splash screen while waiting for data
var splashWindow = new UI.Window();

// Text element to inform user
var text = new UI.Text({
  position: new Vector2(0, 0),
  size: new Vector2(144, 168),
  text:'Downloading tasks...',
  font:'GOTHIC_28_BOLD',
  color:'black',
  textOverflow:'wrap',
  textAlign:'center',
	backgroundColor:'white'
});

// Add to splashWindow and show
splashWindow.add(text);
splashWindow.show();


var URL = 'http://sessionz.meteor.com/collectionapi/tasks';
var url = URL + '/';
ajax(
  {
    url: URL,
    type: 'json'
  },
  function(data) {
    console.log(data.title);
    console.log('Successfully fetched data!');
    url += data[0]._id;
    var menuItems = parseFeed(data, 10);
    // Construct Menu to show to user
    var resultsMenu = new UI.Menu({
      sections: [{
        title: 'List of tasks',
        items: menuItems
      }]
    });

    // Show the Menu, hide the splash
    resultsMenu.show();
    
    resultsMenu.on('select', function(e) {
      
});

resultsMenu.on('select', onTimerSelect);

    
    splashWindow.hide();
  },
  function(error) {
    // Failure!
    console.log('Failed fetching data: ' + error);
  }
);




var globalIntervalId;

function onTimerSelect(e){
  clearInterval(globalIntervalId);
  var timeout = 5//e.item.duration;

  globalIntervalId = timer(timeout);
  
  ajax(
  {
    url: url,
    method: 'DELETE'
  },
  function(data, status, request) {
    console.log(data);
  }
);

}


var readyMessage = new UI.Card({
  title: 'Done',
  body: 'You can take a rest!'
});

function timer(timerInSec){
  var intervalId = setInterval(function(){
    timerInSec--;

    if (timerInSec == 1){
      Vibe.vibrate('double');
    }
    if (timerInSec > 0){
      textfield.text(getTimeString(timerInSec));
    } else {
      readyMessage.show();
      wind.hide();
      

      clearInterval(globalIntervalId);

      Vibe.vibrate('long');
    }
  }, 1000);
  
  var wind = new UI.Window();
  var textfield = new UI.Text({
    position: new Vector2(0, 50),
    size: new Vector2(144, 30),
    font: 'bitham-42-light',
    text: getTimeString(timerInSec),
    textAlign: 'center'
  });

  wind.add(textfield);
  wind.show();
  wind.on('hide', function(){
    clearInterval(globalIntervalId);
  });
  return intervalId;
}

function getTimeString(timeInSec){
  var minutes = parseInt(timeInSec / 60);
  var seconds = timeInSec % 60;
  return minutes + ':' + (seconds < 10 ? ('0' + seconds) : seconds);
}



