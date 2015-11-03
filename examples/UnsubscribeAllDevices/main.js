var boshService = "http://sox.ht.sfc.keio.ac.jp:5280/http-bind/";
var xmppServer = "sox.ht.sfc.keio.ac.jp";
var jid = "guest@sox.ht.sfc.keio.ac.jp";
var password = "miroguest";

window.onload = function() {
	// $("#content").html("<span>hoge</span>");

	var client = new SoxClient(boshService, xmppServer, jid, password);
	
	var soxEventListener = new SoxEventListener();
	soxEventListener.connected = function(soxEvent) {
		console.log("[main.js] Connected " + soxEvent.soxClient);
		status("Connected: " + soxEvent.soxClient);
		client.unsubscribeAll();
	};
	soxEventListener.connectionFailed = function(soxEvent) {
		console.log("[main.js] Connection Failed " + soxEvent.soxClient);
		status("Connection Failed: " + soxEvent.soxClient);
	};
	soxEventListener.unsubscribed = function(soxEvent) {
		status("Unsubscribed: " + soxEvent.device);
	};
	soxEventListener.subscriptionFailed = function(soxEvent) {
		status("Unsubscription Failed: " + soxEvent.device);
	};
	soxEventListener.metaDataReceived = function(soxEvent) {
		/**
		 * SoXサーバからデバイスのメタ情報を受信すると呼ばれる。
		 * 受信したメタ情報に基づいて、Device内にTransducerインスタンスが生成されている。
		 */
		status("Meta data received: " + soxEvent.device);
	};
	soxEventListener.sensorDataReceived = function(soxEvent) {
		/**
		 * SoXサーバからセンサデータを受信すると呼ばれる。
		 * 受信したデータはTransducerインスタンスにセットされ、そのTransducerがイベントオブジェクトとして渡される。
		 */
		status("Sensor data received: " + soxEvent.device);
	};
	client.setSoxEventListener(soxEventListener);
	client.connect();
};

function status(message) {
	var html = (new Date().toLocaleString())+" [main.js] "+message+"<hr>\n"+$("#status").html();
	$("#status").html(html);
}
