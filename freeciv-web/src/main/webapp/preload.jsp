<!DOCTYPE html>
<html>
<head>

<%
String redir_url = "" + request.getParameter("redir");

String username = "" + session.getAttribute("username");
if (username == null || "null".equals(username)) {
	// User isn't logged in.
	redir_url = "/wireframe.jsp?do=guest_user&redir=" + redir_url;
}


%>
<script type="text/javascript" src="/javascript-compressed/webclient.js"></script>

<script type="text/javascript">	
function fc_redirect_init()
{
    setTimeout("fc_redirect();", 800); 
}

function fc_redirect() 
{
  window.location='<%= redir_url %>'
}

window.onload=fc_redirect_init;

</script>
</head>

<body onload="fc_redirect_init();" text="#eeeeee" bgcolor="#202020">

<center>


	<br><br>

 	<img src="/images/freeciv-splash.png">


	<br><br>


<br><br>
<h2>Please wait while Freeciv.net is loading...</h2>

<%
String ua = "" + request.getHeader("User-Agent");
boolean isOpera = ( ua != null && ua.indexOf( "Opera" ) != -1 );
if (!isOpera) {
%>
  <img src="/tileset/freeciv-web-tileset-1.png" width="1" height="1">
  <img src="/tileset/freeciv-web-tileset-2.png" width="1" height="1">

<% } else { %>
    <jsp:include page="tiles/freeciv-web-tileset-small-preload.html" flush="false"/>
<% } %>
</center>


</body>
</html>
