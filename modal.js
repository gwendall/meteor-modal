Meteor.startup(function() { Blaze.render(Template.modal, document.body); });

Modal = {};

/////////
// LIB //
/////////

Session.set('modal.tpl', null);
Session.set('modal.data', null);
Session.set('modal.doc', null);
Session.set('modal.collection', null);

Modal.show = function(params) {

  params = _.isObject(params) ? params : {};

  // template, data, collection, doc, classes
  // console.log('Showing modal.', data, collection, doc);
  Session.set('modal.tpl', params.template);
  Session.set('modal.data', params.data);
  Session.set('modal.collection', params.collection);
  Session.set('modal.doc', params.doc);
  Session.set('modal.class', params.classes);
  $('body').addClass('modal-visible').addClass(params.classes).addClass(Modal._class);
  $('html').css('overflow', 'hidden');

  setTimeout(function() {
    $('.modal').focus();
    $('.modal').scrollTop(0);
  }, 0);

  var _hooks = Modal._showHooks[params.template] || [];
  var _hooksAll = Modal._showHooks[Modal._allNamespace] || [];
  var hooks = _hooks.concat(_hooksAll);
  _.each(hooks, function(hook) {
    hook.call(this);
  });

}

Modal.hide = function() {

  var template = Session.get('modal.tpl');
  var _hooks = Modal._hideHooks[template] || [];
  var _hooksAll = Modal._hideHooks[Modal._allNamespace] || [];
  var hooks = _hooks.concat(_hooksAll);

  _.each(hooks, function(hook) {
    hook.call(this);
  });

  var body = $('body');
  var html = $('html');
  body.removeClass('modal-visible').removeClass(Session.get('modal.class'));
  body.removeClass(Modal._class);
  html.css('overflow', 'auto');
  Session.set('modal.tpl', null);

}

///////////
// HOOKS //
///////////

Modal._showHooks = {};
Modal._hideHooks = {};
Modal._allNamespace = '__all__';

Modal.onShow = function(template, hook) {
  if (_.isFunction(template)) {
    hook = template;
    template = Modal._allNamespace;
  }
  Modal._showHooks[template] = Modal._showHooks[template] || [];
  Modal._showHooks[template].push(hook);
}

Modal.onHide = function(template, hook) {
  if (_.isFunction(template)) {
    hook = template;
    template = Modal._allNamespace;
  }
  Modal._hideHooks[template] = Modal._hideHooks[template] || [];
  Modal._hideHooks[template].push(hook);
}

////////////
// EVENTS //
////////////

Template.body.events({
  'click [data-show-modal]': function(e, data, tpl) {
    e.preventDefault();
    var params = $(e.currentTarget).data();
    var template = params.showModal;
    var collection = params.collection;
    var doc = params.doc;
    var classes = params.modalClass;
    Modal.show({
      template: template,
      data: data,
      collection: collection,
      doc: doc,
      classes: classes
    });
  },
  'click [data-hide-modal]': function(e, data, tpl) {
    Modal.hide();
  },
  'keyup': function(e, data, tpl) {
    var key = e.which;
    if (key !== 27) return;
    if (!$('.modal').is(':focus')) return;
    Modal.hide();
  },
  'click .modal': function(e) {
    Modal.hide();
  },
  'click .modal-content': function(e) {
    e.stopPropagation();
  }
});

/////////////
// HELPERS //
/////////////

Template.modal.helpers({
  tpl: function() {
    return Session.get('modal.tpl');
  },
  class: function() {
    return [Session.get('modal.class'), Modal._class].join(' ');
  },
  data: function() {
    var data = Session.get('modal.data') || {};
    var collection = Session.get('modal.collection');
    if (collection) {
      var docId = Session.get('modal.doc') || data._id;
      data.doc = Mongo.Collection.get(collection).findOne({ _id: docId });
    }
    return data;
  }
});

////////////////
// ANIMATIONS //
////////////////

Template.modal.animations({
  '.modal': {
    container: '.modal-container',
    in: 'animated fadeIn flash ease-in',
    out: 'animated fadeOut fast ease-in',
    outCallback: function() {
      Session.set('modal.data', null);
      Session.set('modal.collection', null);
      Session.set('modal.doc', null);
      Session.set('modal.class', null);
    }
  },
  '.container': {
    container: '.modal-content',
    in: 'animated fadeIn flash ease-in',
    out: 'animated fadeOut fast ease-in'
  }
});
