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
			 * CREATE DEVICE
			 */
			var device = new Device("testtest", "testtest", "other");
			if (!soxEvent.soxClient.createDevice(device)) {
				status("Couldn't create device: " + soxEvent.soxClient);
			}
		};
		soxEventListener.connectionFailed = function(soxEvent) {
			status("Connection Failed: " + soxEvent.soxClient);
		};
		soxEventListener.created = function(soxEvent){
			status("Created "+soxEvent.device);

			/**
			 * DELETE DEVICE
			 */
		};
		soxEventListener.creationFailed = function(soxEvent){
			status("Creation Failed "+soxEvent.device);
		};
		soxEventListener.deleted = function(soxEvent){
			status("Deleted "+soxEvent.device);
		}

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
