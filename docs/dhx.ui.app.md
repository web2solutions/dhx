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