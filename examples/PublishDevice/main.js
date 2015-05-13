var boshService = "http://sox.ht.sfc.keio.ac.jp:5280/http-bind/";
var xmppServer = "sox.ht.sfc.keio.ac.jp";
//var jid = "guest@sox.ht.sfc.keio.ac.jp";
//var password = "miroguest";
//var jid = "sensorizer@sox.ht.sfc.keio.ac.jp";
//var password = "miromiro";

window.onload = function() {
	//$("#content").html("<span>hoge</span>");
	
	//var client = new SoxClient(boshService, xmppServer, jid, password);
	var client = new SoxClient(boshService, xmppServer);

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
		var device = new Device("テラスモール湘南駐車場");//デバイス名に_dataや_metaはつけない
		
		/**
		 * try to get the device's internal information from the server
		 */
		if(!client.resolveDevice(device)){
			/* we are failed. manually construct the device  */
			status("Warning: Couldn't resolve device: "+device+". Continuing...");
			var transducer = new Transducer();//create a transducer
			transducer.name = "occupancy";
			transducer.id = "occupancy";
			device.addTransducer(transducer);//add the transducer to the device
			var data = new SensorData("occupancy", new Date(), "空車", "空車");//create a value to publish
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
		var transducer = soxEvent.device.getTransducer("occupancy");
		
		/**
		 * create a value
		 */
		var data = new SensorData("occupancy", new Date(), "空車", "空車");
		
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
