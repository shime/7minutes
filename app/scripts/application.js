window.Utils = {};
window.Utils.randomInt = function(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

window.Utils.say = function(what){
  var fallbackSpeechSynthesis = window.getSpeechSynthesis(),
      FallbackSpeechSynthesisUtterance = window.getSpeechSynthesisUtterance(),
      u = new FallbackSpeechSynthesisUtterance(what);
      u.onend = function(){
        // TODO: figure out how to use this
      };

  fallbackSpeechSynthesis.speak(u);
};

log = function() { return console.log.apply(console, arguments); };

$(document).ready(function(){
  $('img').attr('src', 'assets/' + Utils.randomInt(1, 4) + '.jpg');
  $('body').on('keypress', function(){
    window.MainState.startTraining();
  });
});

function Timer(){
  var DOM = $('.timer'),
      self = this;

  this.countdown = function(value){
    var dfd = new $.Deferred();
    self.value = value;
    DOM.text(value);
    var interval = setInterval(function(){ 
      DOM.text(--self.value);
      if (self.value === 0){
        dfd.resolve();
        clearInterval(interval);
      }
    }, 1000);
    return dfd;
  };

  this.destroy = function(){
    DOM.remove();
  };
}

function MainState(){
  var self = this,
      DOMContent = $('.content'),
      DOMBody    = $('body'),
      timer      = new Timer(),
      stepIndex  = 0;

  this.startTraining = function(){
    DOMBody.off('keypress');
    this.changeStep(window.STEPS[0]);
  };

  this.endTraining = function(){
    Utils.say('Training finished! Congratulations!');
    DOMContent.text('yay');
    timer.destroy();
  };

  this.changeStep = function(step){
    self.step = step;
    Utils.say(step.voice || step.content);
    DOMContent.text(step.content);
    timer.countdown(step.duration).then(function(){
      if (stepIndex === STEPS.length - 1) { self.endTraining(); }
      var nextStep  = STEPS[++stepIndex];
      self.changeStep(nextStep);
    });
  };

  return this;
}

var rest = {id: 'break', voice: 'take a break', content: 'break', duration: 10};
var step = function(which, duration){
  return {
    id: which.replace(/ /g, '-'),
    content: which,
    duration: duration || 30
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
  step('left side plank', 15),
  step('right side plank', 15)
];

window.MainState = new MainState();
