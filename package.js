Package.describe({
  name: "gwendall:modal",
  summary: "Lightweight modals for Meteor",
  version: "0.1.0"
});

Package.on_use(function (api, where) {

  api.use([
    "session",
    "underscore",
    "templating",
    "jquery",
    "less",
    "dburles:mongo-collection-instances",
    "natestrauser:animate-css",
    "gwendall:template-animations",
    "gwendall:body-events"
  ], "client");

	api.add_files([
		"modal.less",
		"modal.html",
		"modal.js",
    "modal-side.less"
	], "client");

  api.export("Modal", "client");

});
