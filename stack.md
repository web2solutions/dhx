# T-Rex web stack

> Build rich && high available enterprise web applications

T-Rex is a complete web stack and application factory. 
It lets you to create enterprise apps in a very short time and with no line of code.

it composed by the following softwares:

 - AgileREST
 - AgileWebsocket
 - Agile Visual Designer
 - $dhx Framework
 - T-Rex webOS

## AgileREST

The AgileRest layer is a high available REST environment built on top of Mojolicious, 
a fantastic and modern Perl framework.

This layer is responsible to provide DB and IO server support for all authenticated clients.

The communication between Client and Server is performed via HTTP in a REST way.
 
This app runs on a pre-forking box, with multiple workers, which may be easily scalated.
 
Nginx is in front of the API end points working as load ballancer/proxy.
 
The AgileRest layer provides support for hot deploy of new REST end points.
 
The AgileRest layer provides automatic generated doc for each mapped server resource.
 
The AgileRest Layer does not servers static content, which is served via CDN / Nginx.
 
Each server resource is fully protected via HTTP authorizations and tokens


## AgileWebsocket

The AgileWebsocket, also built on top of Mojolicious, is a realtime application that is responsible by the messaging system on T-rex.

This messaging system is used by 3 main tasks:

	- bind and sync between client components X indexedDB X server.
	- propagate application state between connected clients.
	- communication with stand alone server workers.

## Agile Visual Designer
## $dhx Framework
## T-Rex webOS



### AUTHORS, LICENSE AND COPYRIGHT

 - José Eduardo Perotta de Almeida. eduardo at web2solutions.com.br

  Copyright 2015 

- AGPL for personal use.
- Commercial && Enterpsise 
	Please contact the author for commercial usage



### BUGS

Actually this software is under development. There is no stable version yet.

Please report any bugs or feature requests through the email address: eduardo at web2solutions.com.br

### DISCLAIMER OF WARRANTY

BECAUSE THIS SOFTWARE IS LICENSED FREE OF CHARGE, THERE IS NO WARRANTY FOR THE SOFTWARE, TO THE EXTENT PERMITTED BY APPLICABLE LAW. EXCEPT WHEN OTHERWISE STATED IN WRITING THE COPYRIGHT HOLDERS AND/OR OTHER PARTIES PROVIDE THE SOFTWARE "AS IS" WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESSED OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE ENTIRE RISK AS TO THE QUALITY AND PERFORMANCE OF THE SOFTWARE IS WITH YOU. SHOULD THE SOFTWARE PROVE DEFECTIVE, YOU ASSUME THE COST OF ALL NECESSARY SERVICING, REPAIR, OR CORRECTION.

IN NO EVENT UNLESS REQUIRED BY APPLICABLE LAW OR AGREED TO IN WRITING WILL ANY COPYRIGHT HOLDER, OR ANY OTHER PARTY WHO MAY MODIFY AND/OR REDISTRIBUTE THE SOFTWARE AS PERMITTED BY THE ABOVE LICENCE, BE LIABLE TO YOU FOR DAMAGES, INCLUDING ANY GENERAL, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES ARISING OUT OF THE USE OR INABILITY TO USE THE SOFTWARE (INCLUDING BUT NOT LIMITED TO LOSS OF DATA OR DATA BEING RENDERED INACCURATE OR LOSSES SUSTAINED BY YOU OR THIRD PARTIES OR A FAILURE OF THE SOFTWARE TO OPERATE WITH ANY OTHER SOFTWARE), EVEN IF SUCH HOLDER OR OTHER PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
