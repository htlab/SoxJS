var boshService = "http://sox.ht.sfc.keio.ac.jp:5280/http-bind/";
var xmppServer = "sox.ht.sfc.keio.ac.jp";
var jid = "guest@sox.ht.sfc.keio.ac.jp";
var password = "miroguest";

var client = new SoxClient(boshService, xmppServer, jid, password);

window.onload = function() {
	try {
		// $("#content").html("<span>hoge</span>");

		client.unsubscribeAll();

		var soxEventListener = new SoxEventListener();
		soxEventListener.connected = function(soxEvent) {
			console.log("Connected " + soxEvent.soxClient);
			status("Connected: " + soxEvent.soxClient);

			/**
			 * GET DEVICE
			 */
			if (!soxEvent.soxClient.discoverDevices("hogehoge")) {
				status("Couldn't get device list: " + soxEvent.soxClient);
			}
		};
		
		soxEventListener.discovered = function(soxEvent) {
			console.log("[main.js] Discovered " + soxEvent.devices);
			if(soxEvent.devices.length == 1){
				status("Discovered "+soxEvent.devices[0]);
				/**
				 * OPTION 1: subscribing device
				 * on subscribing a device, the last published item of the device's meta
				 * node is received from the server. this gives us the meta information 
				 * of the device including the list of transducers
				 */
				soxEvent.soxClient.subscribeDevice(soxEvent.devices[0]);
				/**
				 * OPTION 2: resolving device
				 * by resolving device, we can fix the list of transducers in the device
				 * and {meta,data} node configurations 
				 */
				soxEvent.soxClient.resolveDevice(soxEvent.devices[0]);
			}
		};
		soxEventListener.discoveryFailed = function(soxEvent) {
			console.log("[main.js] Discovery failed " + soxEvent);
		};
		soxEventListener.connectionFailed = function(soxEvent) {
			console.log("[main.js] Connection Failed " + soxEvent.soxClient);
			status("Connection Failed: " + soxEvent.soxClient);
		};
		soxEventListener.subscribed = function(soxEvent){
			status("Subscribed "+soxEvent.device);
		};
		soxEventListener.resolved = function(soxEvent){
			status("Resolved "+soxEvent.device);
		};
		soxEventListener.resolveFailed = function(soxEvent){
			/* couldn't get device information from the server */
			status("Resolve Failed: "+soxEvent.device+" code="+soxEvent.errorCode+" type="+soxEvent.errorType);
		};

		client.setSoxEventListener(soxEventListener);
		client.connect();
	} catch (e) {
		console.log(e);
	}
};

function status(message) {
	var html = (new Date().toLocaleString()) + " [main.js] " + message + "<hr>\n" + $("#status").html();
	$("#status").html(html);
}
