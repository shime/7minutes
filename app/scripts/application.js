window.MathUtils = {};
window.MathUtils.randomInt = function(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

log = function() { return console.log.apply(console, arguments); };

window.App = Ember.Application.create();
App.set('img', 'images/' + MathUtils.randomInt(1, 4) + '.jpg');
