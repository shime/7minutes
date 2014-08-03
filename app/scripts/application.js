window.MathUtils = {};
window.MathUtils.randomInt = function(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

window.Speech = {};
window.Speech.say = function(what){
  var fallbackSpeechSynthesis = window.getSpeechSynthesis(),
      FallbackSpeechSynthesisUtterance = window.getSpeechSynthesisUtterance(),
      u = new FallbackSpeechSynthesisUtterance(what);

  fallbackSpeechSynthesis.speak(u);
};

log = function() { return console.log.apply(console, arguments); };

var defaults = {
  'img': 'images/' + MathUtils.randomInt(1, 4) + '.jpg',
  'content': 'workout ready, press anything'
};

window.App = Ember.Application.create();
App.setProperties(defaults);

App.reopen({
  speaker: function(){
    Speech.say(this.get('content'));
  }.observes('content')
});

var attr = Em.attr;
App.Step = Em.Model.extend({
  content: attr()
});

App.Step.adapter = Em.FixtureAdapter.create();

var rest = {id: 'break', content: 'take a break'};
var step = function(which){
  return {
    id: which.replace(/ /g, '-'),
    content: which
  };
};

App.Step.FIXTURES = [
  step('jumping jacks'),
  rest,
  step('wall sit'),
  rest,
  step('push-up'),
  rest,
  step('abdominal crunch'),
  rest,
  step('step-up onto chair'),
  rest,
  step('squat'),
  rest,
  step('triceps dip onto chair'),
  rest,
  step('plank'),
  rest,
  step('high knees running in place'),
  rest,
  step('lunge'),
  rest,
  step('push-up and rotation'),
  rest,
  step('left side plank'),
  step('right side plank')
];
