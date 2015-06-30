# $dhx - DHTMLX on steroids [![NPM version](https://badge.fury.io/js/dhx.png)](http://badge.fury.io/js/dhx) 

> Agile JS framework for realtime && offline enterprise web applications

$dhx is the top layer of the T-Rex realtime and high available web stack

## $dhx.ui

 - i18n
 - skining
 - module loader
 - dhtmlx window stack control
 - PDF viewer
 - PDF generator
 - Excel generator


## $dhx.ui.data

  High capacity database shared pool. Share databases between $dhx applications


## $dhx.ui.crud

  Build enterprise CRUDs with full featured MVW (Model-View-What) code with no efforts.

**Features**

 - Generic Views
 - Custom Views
 - Generic Helpers classes
 - Custom Helpers classes
 - Scaffold tables && it foreign keys
 - Create, Read, Update, Delete, List and Search operations
 - Full navigation over records
 - Fully integrated with $dhx.dataDriver

### $dhx.ui.crud.simple controller 

![$dhx.ui.crud.simple print](http://cdn.dhtmlx.com.br/dhx/docs/dhx.ui.crud.simple.png)

```javascript
      var crud = null;
      var db_name = 'juris';
      var table = 'persons';
      
      function StartUI(){
        crud = new $dhx.ui.crud.simple( {
          wrapper : document.body
          ,database : db_name
          ,collection : table
            // not mandatory, default inherits $dhx.ui.crud.simple.View
          ,customView : my_Custom_View_Class_here 
        } );  
      }
      
      window.onload = function() {
        $dhx.ui.start( {
            // load dhtmlx suite files?
          dhtmlx : true
          ,db : db_name
          ,onStart : function()
          {
            StartUI()
          } 
        } );
      }
```



### $dhx.ui.desktop T-Rex webOS 

![$dhx.ui.desktop print](http://cdn.dhtmlx.com.br/dhx/docs/dhx.ui.desktop.png)

```javascript
      $dhx.ui.start( {
          dhtmlx : true
          ,desktop : true
          ,db : 'juris'
          ,onStart : function()
          {
            $dhx.ui.desktop.start();
          } 
      } );
```

**WebOS ToDo:**

- toolbar at input data windows - Cruder generic view
- Don't enumerable properties from REST class
- internal realtime chat - chat between logged users
- ODF and DOC editor
- System general information
- email client
- File explorer - both with server and local storage
- local storage and viewer for PDF, images, ODF and DOCs
- users online (and show what are they doing)
- personal notes on desktop (like post it)
- RSS News in desktop
- Addresses of Clients with Google Maps



### About T-Rex web stack

  T-Rex is a realtime and high available web stack made on top of Mojolicious, a fantastic and modern Perl framework.
  Implements a set of hot features providing support to Agile development of Enterprise web applications.

  See more at:

  - https://github.com/web2solutions/AgileREST
  - https://github.com/web2solutions/AgileWebsocket


### About DHTMLX

    A cross-browser JavaScript library for building rich Web and Mobile apps

http://dhtmlx.com/


### Bug Fixes for DHTMLX Suite 4.2 std:

  - fixed ribbon.unload(). When you add any function to array prototypes, you get errors when unloading DHTMLX ribbons from an application.
  


### LICENSE AND COPYRIGHT

  Copyright 2015 José Eduardo Perotta de Almeida. eduardo at web2solutions.com.br

- AGPL for personal use.
- Commercial && Enterpsise - contact the author for commercial usage


### LIMITATIONS

  I'm sorry Bill, but we don't provide support to IE on our offline database and socket libraries. Maybe on 12 version of Internet Explorer.


### BUGS

Actually this software is under development. There is no stable version yet.

Please report any bugs or feature requests through the email address: eduardo at web2solutions.com.br

### DISCLAIMER OF WARRANTY

BECAUSE THIS SOFTWARE IS LICENSED FREE OF CHARGE, THERE IS NO WARRANTY FOR THE SOFTWARE, TO THE EXTENT PERMITTED BY APPLICABLE LAW. EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT HOLDERS AND/OR OTHER PARTIES PROVIDE THE SOFTWARE "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE SOFTWARE IS WITH YOU. SHOULD THE SOFTWARE PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL NECESSARY SERVICING, REPAIR, OR CORRECTION.

IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN WRITING WILL ANY COPYRIGHT HOLDER, OR ANY OTHER PARTY WHO MAY MODIFY AND/OR REDISTRIBUTE THE SOFTWARE AS PERMITTED BY THE ABOVE LICENCE, BE LIABLE TO YOU FOR DAMAGES, INCLUDING ANY GENERAL, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR INABILITY TO USE THE SOFTWARE (INCLUDING BUT NOT LIMITED TO LOSS OF DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY YOU OR THIRD PARTIES OR A FAILURE OF THE SOFTWARE TO OPERATE WITH ANY OTHER SOFTWARE), EVEN IF SUCH HOLDER OR OTHER PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
