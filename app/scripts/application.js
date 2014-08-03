window.MathUtils = {};
window.MathUtils.randomInt = function(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

window.Speech = {};
window.Speech.say = function(what){
  var fallbackSpeechSynthesis = window.getSpeechSynthesis(),
      fallbackSpeechSynthesisUtterance = window.getSpeechSynthesisUtterance(),
      u = new fallbackSpeechSynthesisUtterance(what);

  fallbackSpeechSynthesis.speak(u);
}

log = function() { return console.log.apply(console, arguments); };

window.App = Ember.Application.create();
App.set('img', 'images/' + MathUtils.randomInt(1, 4) + '.jpg');
