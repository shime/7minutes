window.Utils = {};
window.Utils.randomInt = function(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

window.Utils.say = function(what){
  var fallbackSpeechSynthesis = window.getSpeechSynthesis(),
      FallbackSpeechSynthesisUtterance = window.getSpeechSynthesisUtterance(),
      u = new FallbackSpeechSynthesisUtterance(what);

  fallbackSpeechSynthesis.speak(u);
};

log = function() { return console.log.apply(console, arguments); };

$(document).ready(function(){
  $('img').attr('src', 'images/' + Utils.randomInt(1, 4) + '.jpg');
  $('body').on('keypress', function(){
    window.MainState.startTraining();
  });
});


function MainState(){
  var machine = new MicroMachine("initializing");
  machine.transitionsFor.training = {initializing: 'training'};
  machine.transitionsFor.finished = {training: 'finished'};

  var self = this;
  machine.on("any", function(machine){
    self.state = machine.state;
  });

  this.startTraining = function(){
    $('body').off('keypress');
    machine.trigger('training');
    this.changeStep(window.STEPS[0]);
  };

  this.endTraining = function(){
    machine.trigger('finished');
  };

  this.changeStep = function(step){
    self.step = step;
    Utils.say(step.content);
    $('#content').text(step.content);
  };

  this.state = undefined;

  return this;
};

var rest = {id: 'break', content: 'take a break'};
var step = function(which){
  return {
    id: which.replace(/ /g, '-'),
    content: which
  };
};

window.STEPS = [
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

window.MainState = new MainState();
