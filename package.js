Package.describe({
  name: "gwendall:modal",
  summary: "Lightweight modals for Meteor",
  version: "0.1.0"
});

Package.on_use(function (api, where) {

  api.use([
    "session@1.1.0",
    "underscore@1.0.3",
    "templating@1.1.1",
    "jquery@1.11.3_2",
    "less@1.0.14",
    "dburles:mongo-collection-instances@0.1.3",
    "natestrauser:animate-css@3.2.6",
    "gwendall:template-animations@0.1.9_4",
    "gwendall:body-events@0.1.6"
  ], "client");

	api.add_files([
		"modal.less",
		"modal.html",
		"modal.js",
    "modal-side.less"
	], "client");

  api.export("Modal", "client");

});
