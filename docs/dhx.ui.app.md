# $dhx.ui.app

 - application bootstrap
 	- declare model

 - URL routing
 	- declare controller
 		View => Controller => Model
 		Model => Controller => View
 	- subscribe to data model changes
 	- subscribe model to controller changes
 	-


 	Model
Orchestrates data and business logic.
Loads and saves from the server.
Emits events when data changes.

View
Listens for changes and renders UI.
Handles user input and interactivity.
Sends captured input to the model.


internal messages:

=> model: add, update, delete, fetch, filter
=> view:  add, update, delete, fetch, filter

{
    action: '' // action type. string. mandatory
    , target: presenter // target object. object. Presenter, model. mandatory
    , record: {} // record payload. object. not mandatory
}