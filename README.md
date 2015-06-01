# dhx [![NPM version](https://badge.fury.io/js/dhx.png)](http://badge.fury.io/js/dhx) 

> Agile JS framework for realtime && offline enterprise web applications

## $dhx.ui

 - high capacity database pool
 - i18n
 - skining
 - module loader
 - dhtmlx window stack control
 - PDF viewer


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
          dhtmlx : true
          ,db : db_name
          ,version :2
          ,schema : my_db_structure.schema
          ,settings : my_db_structure.settings
          ,records : my_db_structure.records
          ,onStart : function()
          {
            StartUI()
          } 
        } );
      }
```



### LICENSE AND COPYRIGHT

  Copyright 2015 José Eduardo Perotta de Almeida.

AGPL - contact the author for commercial usage


### BUGS AND LIMITATIONS

No bugs have been reported.

Please report any bugs or feature requests through the email address: eduardo at web2solutions.com.br

### DISCLAIMER OF WARRANTY

BECAUSE THIS SOFTWARE IS LICENSED FREE OF CHARGE, THERE IS NO WARRANTY FOR THE SOFTWARE, TO THE EXTENT PERMITTED BY APPLICABLE LAW. EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT HOLDERS AND/OR OTHER PARTIES PROVIDE THE SOFTWARE "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE SOFTWARE IS WITH YOU. SHOULD THE SOFTWARE PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL NECESSARY SERVICING, REPAIR, OR CORRECTION.

IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN WRITING WILL ANY COPYRIGHT HOLDER, OR ANY OTHER PARTY WHO MAY MODIFY AND/OR REDISTRIBUTE THE SOFTWARE AS PERMITTED BY THE ABOVE LICENCE, BE LIABLE TO YOU FOR DAMAGES, INCLUDING ANY GENERAL, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR INABILITY TO USE THE SOFTWARE (INCLUDING BUT NOT LIMITED TO LOSS OF DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY YOU OR THIRD PARTIES OR A FAILURE OF THE SOFTWARE TO OPERATE WITH ANY OTHER SOFTWARE), EVEN IF SUCH HOLDER OR OTHER PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
