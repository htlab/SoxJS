var boshService = "http://sox.ht.sfc.keio.ac.jp:5280/http-bind/";
var xmppServer = "sox.ht.sfc.keio.ac.jp";
var jid = "guest@sox.ht.sfc.keio.ac.jp";
var password = "miroguest";

window.onload = function() {
	//$("#content").html("<span>hoge</span>");
	
	var client = new SoxClient(boshService, xmppServer, jid, password);

	var soxEventListener = new SoxEventListener();
	soxEventListener.connected = function(soxEvent) {
		/**
		 * we are successfully connected to the server
		 */
		console.log("[main.js] Connected "+soxEvent.soxClient);
		status("Connected: "+soxEvent.soxClient);
		
		/**
		 * CREATE DEVICE INSTANCE
		 * first create a device specifying just a name
		 */
		var device = new Device("testNode");//デバイス名に_dataや_metaはつけない
		
		/**
		 * try to get the device's internal information from the server
		 */
		if(!client.resolveDevice(device)){
			/* we are failed. manually construct the device  */
			status("Warning: Couldn't resolve device: "+device+". Continuing...");
			var transducer = new Transducer();//create a transducer
			transducer.name = "temperature";
			transducer.id = "temperature";
			device.addTransducer(transducer);//add the transducer to the device
			var data = new SensorData("temperature", new Date(), "20", "20");//create a value to publish
			transducer.setSensorData(data);//set the value to the transducer
			soxEvent.soxClient.publishDevice(device);//publish
		}
	};
	soxEventListener.connectionFailed = function(soxEvent) {
		status("Connection Failed: "+soxEvent.soxClient);
	};
	soxEventListener.resolved = function(soxEvent){
		/**
		 * successfully acquired the device's internal information from the server
		 */
		status("Resolved: "+soxEvent.device);
		
		/**
		 * specify the transducer to publish
		 */
		var transducer = soxEvent.device.getTransducer("temperature");
		
		/**
		 * create a value
		 */
		var data = new SensorData("temperature", new Date(), "25", "25");
		
		/**
		 * set the value to the transducer
		 */
		transducer.setSensorData(data);
		
		/**
		 * publish
		 */
		soxEvent.soxClient.publishDevice(soxEvent.device);
	};
	soxEventListener.resolveFailed = function(soxEvent){
		status("Resolve Failed: "+soxEvent.device);
	};
	soxEventListener.published = function(soxEvent){
		status("Published: "+soxEvent.device);
	};
	soxEventListener.publishFailed = function(soxEvent){
		status("Publish Failed: "+soxEvent.device+" errorCode="+soxEvent.errorCode+" errorType="+soxEvent.errorType);
	};
	
	client.setSoxEventListener(soxEventListener);
	client.connect();
};

function status(message){
	var html = (new Date().toLocaleString())+" [main.js] "+message+"<hr>\n"+$("#status").html();
	$("#status").html(html);
}
