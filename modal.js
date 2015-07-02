Meteor.startup(function() {
  Blaze.render(Template.modal, document.body);
});

Modal = {};

/*
//////////////////////////
// GET SCROLL BAR WIDTH //
//////////////////////////

var getScrollBarWidth = function() {
  var body = $("body");
  var bodyOverflow = $("body").css("overflow");
  var bodyWidthWithOverflow = body.css({ "overflow": "scroll" }).width();
  body.css("overflow", "hidden");
  var scrollBarWidth = body.width() - bodyWidthWithOverflow;
  body.css("overflow", bodyOverflow || "auto");
  return scrollBarWidth;
}

Meteor.startup(function() {
  Modal.scrollBarWidth = getScrollBarWidth();
});

Modal._hackShow = function() {
  Modal.bodyMarginLeft = $("body").css("margin-left");
  Modal.bodyScrollTop = $("body").scrollTop();
  $("body").addClass("no-scroll");
  $("body").css({ "margin-left": -Modal.scrollBarWidth/2 + "px", "top": -Modal.bodyScrollTop });
  $(".modal-content").css({ "margin-top": Modal.bodyScrollTop });
  $(".modal-close").css({ "margin-top": Modal.bodyScrollTop });
  document.ontouchstart = function(e) { e.preventDefault(); }
}

Modal._hackHide = function() {
  $("body").removeClass("no-scroll");
  $("body").scrollTop(Modal.bodyScrollTop);
  $("body").css({ "margin-left": Modal.bodyMarginLeft });
  $(".modal-content").css({ "margin-top": 0 });
  $(".modal-close").css({ "margin-top": 0 });
  document.ontouchstart = function(e) { return true; }
}
*/

///////////
// HOOKS //
///////////

Modal._showHooks = {};
Modal._hideHooks = {};
Modal._allNamespace = "__all__";

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

/////////
// LIB //
/////////

Session.set("modal.tpl", null);
Session.set("modal.data", null);
Session.set("modal.doc", null);
Session.set("modal.collection", null);

Modal.show = function(template, data, collection, doc, classes) {

  console.log("Showing modal.", data, collection, doc);
  Session.set("modal.tpl", template);
  Session.set("modal.data", data);
  Session.set("modal.collection", collection);
  Session.set("modal.doc", doc);
  Session.set("modal.class", classes);
  $("body").addClass("modal-visible").addClass(classes).addClass(Modal._class);
  $("html").css("overflow", "hidden");

  setTimeout(function() {
    $(".modal").focus();
    $(".modal").scrollTop(0);
  }, 0);

  var _hooks = Modal._showHooks[template] || [];
  var _hooksAll = Modal._showHooks[Modal._allNamespace] || [];
  var hooks = _hooks.concat(_hooksAll);
  _.each(hooks, function(hook) {
    hook.call(this);
  });

}

Modal.hide = function() {

  var template = Session.get("modal.tpl");
  var _hooks = Modal._hideHooks[template] || [];
  var _hooksAll = Modal._hideHooks[Modal._allNamespace] || [];
  var hooks = _hooks.concat(_hooksAll);

  _.each(hooks, function(hook) {
    hook.call(this);
  });

  $("body").removeClass("modal-visible").removeClass(Session.get("modal.class"));
  $("body").removeClass(Modal._class);
  $("html").css("overflow", "auto");
  Session.set("modal.tpl", null);

}

////////////
// EVENTS //
////////////

Template.body.events({
  "click [data-show-modal]": function(e, data, tpl) {
    e.preventDefault();
    var params = $(e.currentTarget).data();
    var template = params.showModal;
    var collection = params.collection;
    var doc = params.doc;
    var classes = params.modalClass;
    Modal.show(template, data, collection, doc, classes);
  },
  "click [data-hide-modal]": function(e, data, tpl) {
    Modal.hide();
  },
  "keyup": function(e, data, tpl) {
    var key = e.which;
    if (key !== 27) return;
    if (!$(".modal").is(":focus")) return;
    Modal.hide();
  },
  "click .modal": function(e) {
    Modal.hide();
  },
  "click .modal-content": function(e) {
    e.stopPropagation();
  }
});

//////////
// DATA //
//////////

/*
Template.modal.onCreated(function() {
  var tpl = this;
  tpl.state("tpl", Session.get("modal.tpl"));
  tpl.state("class", [Session.get("modal.class"), Modal._class].join(" "));

  var data = Session.get("modal.data") || {};
  var collection = Session.get("modal.collection");
  console.log("Got modal.", data, collection);
  if (collection) {
    var docId = Session.get("modal.doc") || data._id;
    data.doc = Mongo.Collection.get(collection).findOne({ _id: docId });
  }
  tpl.state("data", data);
});
*/

Template.modal.helpers({
  tpl: function() {
    return Session.get("modal.tpl");
  },
  class: function() {
    return [Session.get("modal.class"), Modal._class].join(" ");
  },
  data: function() {
    var data = Session.get("modal.data") || {};
    var collection = Session.get("modal.collection");
    console.log("Got modal.", data, collection);
    if (collection) {
      var docId = Session.get("modal.doc") || data._id;
      data.doc = Mongo.Collection.get(collection).findOne({ _id: docId });
    }
    return data;
  }
});

////////////////
// ANIMATIONS //
////////////////

Template.modal.animations({
  ".modal": {
    container: ".modal-container",
    in: "animated fadeIn flash ease-in",
    out: "animated fadeOut fast ease-in",
    outCallback: function() {
      Session.set("modal.data", null);
      Session.set("modal.collection", null);
      Session.set("modal.doc", null);
      Session.set("modal.class", null);
    }
  },
  ".container": {
    container: ".modal-content",
    in: "animated fadeIn flash ease-in",
    out: "animated fadeOut fast ease-in"
  }
});
