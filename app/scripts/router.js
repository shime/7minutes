App.Router.map(function() {
  this.route('step', { path: 'step/:id' });
});

App.StepRoute = Em.Route.extend({
  model: function(params){
    return App.Step.fetch(params.id);
  },
  setupController: function(controller, model){
    App.set('content', model.get('content'));
  }
});
