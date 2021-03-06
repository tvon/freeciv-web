/********************************************************************** 
 Freeciv - Copyright (C) 2009 - Andreas Røsdal   andrearo@pvv.ntnu.no
   This program is free software; you can redistribute it and/or modify
   it under the terms of the GNU General Public License as published by
   the Free Software Foundation; either version 2, or (at your option)
   any later version.

   This program is distributed in the hope that it will be useful,
   but WITHOUT ANY WARRANTY; without even the implied warranty of
   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
   GNU General Public License for more details.
***********************************************************************/

var civwebserver_url_base = "/civ";
var error_shown = false;
var syncTimerId = -1;
var isWorking = false;

/****************************************************************************
  Initialized the network synchronization loop.
****************************************************************************/
function network_init()
{
  civwebserver_url = civwebserver_url_base + "?p=" + civserverport + "&u=" + username;

  syncTimerId = setInterval("sync_civclient()", 15);
 
 $(document).ajaxComplete(function(){ 
   isWorking = false;
 });
 
 
  
}

/****************************************************************************
  Stops network sync.
****************************************************************************/
function network_stop()
{
  clearInterval(syncTimerId); 
}

/****************************************************************************
  Send a syncronization request to the server using POST.
****************************************************************************/
function sync_civclient()
{

  /* Prevent race conditions. */
  if (isWorking) return;
  isWorking = true;
  
  if (over_error_threshold()) return;
  
  var net_packet = [];
    
  var myJSONText = JSON.stringify(net_packet);
 
  if (goto_active && current_focus.length > 0 
      && prev_mouse_x == mouse_x && prev_mouse_y == mouse_y) {
    var ptile = canvas_pos_to_tile(mouse_x, mouse_y);
    if (ptile != null) {
      /* Send request for goto_path to server. */
      request_goto_path(current_focus[0]['id'], ptile['x'], ptile['y']);
    }
  }
  prev_mouse_x = mouse_x;
  prev_mouse_y = mouse_y;

  /* Send main request for sync to server. */
  $.ajax({
      url: civwebserver_url,
      type: "POST",
      data: myJSONText,
      dataType: "json",
      success: client_handle_packet,
      error: function(XMLHttpRequest, textStatus, errorThrown){
        var error_msg = "Network error: " + textStatus + "\n"
                        + XMLHttpRequest.status + "\n"
                        + XMLHttpRequest.statusText + "\n\n"
                        + XMLHttpRequest.responseText + "\n\n";
      
         js_breakpad_report(error_msg, "clinet.js", 62); 
      }
      
   }
  );


}

/****************************************************************************
  Sends a request to the server, with a JSON packet.
****************************************************************************/
function send_request(packet_payload) 
{
  $.post(civwebserver_url, packet_payload, client_handle_packet, "json");
}


