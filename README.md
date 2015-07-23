Meteor Modal
================

Lightweight modal for Meteor.

Installation
------------

``` sh
meteor add gwendall:modal
```

How to use
----------

**Show a modal**

- DOM approach

``` html
<a data-show-modal="templateName" data-modal-class="modalClass" data-collection="{{collection}}" data-doc="{{doc}}">Show modal</a>
```

- JS approach

``` javascript
Modal.show({
  template: templateName, // Name of the template to use in the modal
  class: class, // class of the modal
  data: data, // data to be passed to the modal
  collection: collection, // collection to fetch a doc from
  doc: doc // id of the doc to be passed to the modal template, if collection is also passed
});
```

**Hide a modal**

- DOM approach

``` html
<a data-hide-modal>Hide modal</a>
```

- JS approach

``` javascript
Modal.hide();
```

**Show hooks**

``` javascript
Modal.onShow(templateName, hook);
```

**Hide hooks**

``` javascript
Modal.onHide(templateName, hook);
```
