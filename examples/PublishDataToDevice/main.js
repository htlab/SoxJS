var boshService = "http://sox.ht.sfc.keio.ac.jp:5280/http-bind/";
var xmppServer = "sox.ht.sfc.keio.ac.jp";
var jid = "guest@sox.ht.sfc.keio.ac.jp";
var password = "miroguest";

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
		var device = new Device("hogehoge");//デバイス名に_dataや_metaはつけない
		
		/**
		 * try to get the device's internal information from the server
		 */
		if(!client.resolveDevice(device)){
			/* we are failed. manually construct the device  */
			status("Warning: Couldn't resolve device: "+device+". Continuing...");
			var transducer_temp = new Transducer();//create a transducer
			transducer_temp.name = "temperature";
			transducer_temp.id = "temperature";
			device.addTransducer(transducer_temp);//add the transducer to the device
			var data_temp = new SensorData("temperature", new Date(), "20", "20");//create a value to publish
			transducer_temp.setSensorData(data_temp);//set the value to the transducer

			var transducer_lat = new Transducer();//create a transducer
			transducer_lat.name = "latitude";
			transducer_lat.id = "latitude";
			device.addTransducer(transducer_lat);//add the transducer to the device
			var data_lat = new SensorData("latitude", new Date(), "35.388210", "35.388210");//create a value to publish
			transducer_lat.setSensorData(data_lat);//set the value to the transducer

			var transducer_lng = new Transducer();//create a transducer
			transducer_lng.name = "longitude";
			transducer_lng.id = "longitude";
			device.addTransducer(transducer_lng);//add the transducer to the device
			var data_lng = new SensorData("longitude", new Date(), "139.425387", "139.425387");//create a value to publish
			transducer_lng.setSensorData(data_lng);//set the value to the transducer
            
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
		var transducer_temp = soxEvent.device.getTransducer("temperature");
		var transducer_lat = soxEvent.device.getTransducer("latitude");
		var transducer_lng = soxEvent.device.getTransducer("longitude");
		
		/**
		 * create a value
		 */
		var data_temp = new SensorData("temperature", new Date(), "25", "25");
		var data_lat = new SensorData("latitude", new Date(), "35.388210", "35.388210");
		var data_lng = new SensorData("longitude", new Date(), "139.425387", "139.425387");
		
		/**
		 * set the value to the transducer
		 */
		transducer_temp.setSensorData(data_temp);
		transducer_lat.setSensorData(data_lat);
		transducer_lng.setSensorData(data_lng);
		
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
