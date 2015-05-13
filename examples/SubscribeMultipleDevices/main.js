var boshService = "http://sox.ht.sfc.keio.ac.jp:5280/http-bind/";
var xmppServer = "sox.ht.sfc.keio.ac.jp";
var jid = "guest@sox.ht.sfc.keio.ac.jp";
var password = "miroguest";

window.onload = function() {
	//$("#content").html("<span>hoge</span>");
	
	var client = new SoxClient(boshService, xmppServer, jid, password);
	client.unsubscribeAll();
	
	var soxEventListener = new SoxEventListener();
	soxEventListener.connected = function(soxEvent) {
		console.log("[main.js] Connected "+soxEvent.soxClient);
		status("Connected: "+soxEvent.soxClient);
		
		var deviceNames = ["しらすの入荷情報湘南", "藤沢市役所", "江ノ島今日の天気", "神奈川県アメダス気温ランキング高温順", "江の電運行状況"];
//		var deviceNames = ["しらすの入荷情報湘南"];
		deviceNames.forEach(function(name){
			var device = new Device(name);//デバイス名に_dataや_metaはつけない
			/* クライアントに繋がったら、デバイスにサブスクライブする */
			if(!client.subscribeDevice(device)){
				/* サーバに繋がってない場合などで、要求を送信できなかった場合はfalseが返ってくる */
				status("Couldn't send subscription request: "+device);
			}			
		});
	};
	soxEventListener.connectionFailed = function(soxEvent) {
		status("Connection Failed: "+soxEvent.soxClient);
	};
	soxEventListener.subscribed = function(soxEvent){
		status("Subscribed: "+soxEvent.device);
	};
	soxEventListener.subscriptionFailed = function(soxEvent){
		status("Subscription Failed: "+soxEvent.device);
	};
	soxEventListener.metaDataReceived = function(soxEvent){
		/**
		 * SoXサーバからデバイスのメタ情報を受信すると呼ばれる。
		 * 受信したメタ情報に基づいて、Device内にTransducerインスタンスが生成されている。
		 */
		status("Meta data received: "+soxEvent.device);
	};
	soxEventListener.sensorDataReceived = function(soxEvent){
		/**
		 * SoXサーバからセンサデータを受信すると呼ばれる。
		 * 受信したデータはTransducerインスタンスにセットされ、そのTransducerがイベントオブジェクトとして渡される。
		 */
		status("Sensor data received: "+soxEvent.device);
	};
	
	client.setSoxEventListener(soxEventListener);
	client.connect();
};

function status(message){
	var html = (new Date().toLocaleString())+" [main.js] "+message+"<hr>\n"+$("#status").html();
	$("#status").html(html);
}
