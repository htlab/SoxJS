var boshService = "http://sox.ht.sfc.keio.ac.jp:5280/http-bind/";
var xmppServer = "sox.ht.sfc.keio.ac.jp";
var jid = "guest@sox.ht.sfc.keio.ac.jp";
//anonymous 接続の場合は使いません
var password = "miroguest";
//anonymous接続の場合は使いません

window.onload = function() {
	//まずはクライアントをつくってSOXサーバと接続します。

	//(1)匿名ユーザとして接続する例です。単純にデータを取得したい場合はanonymousユーザとして接続がよいです
	var client = new SoxClient(boshService, xmppServer);

	//(2)これは特定ユーザとして接続する例です。今回は使いません。
	//var client = new SoxClient(boshService, xmppServer, jid, password);

	//次にイベントリスナを定義します。
	var soxEventListener = new SoxEventListener();

	//SOXサーバに接続した際に呼ばれる関数です。
	//SOXサーバに接続したらhogehogeを取得して、メタデータの表示、サブスクライブをするプログラムになっています。
	soxEventListener.connected = function(soxEvent) {
		console.log("[main.js] Connected " + soxEvent.soxClient);
		status("Connected: " + soxEvent.soxClient);

		//hogehogeデバイスのインスタンスを作ります。ここのノード名を他のにすると、そのノード名のデータが表示されるようになります。
		var device = new Device("hogehoge");

		//hogehogeデバイスの情報を表示してみます
		//soxEventListener.resolved = function(soxEvent) 部分が呼ばれます。
		client.resolveDevice(device);

		/* hogehogeデバイスをサブスクライブします */
		//データがとんでくると、soxEventListener.sensorDataReceived = function(soxEvent)　部分が呼ばれます。
		client.subscribeDevice(device);

	};

	soxEventListener.connectionFailed = function(soxEvent) {
		status("Connection Failed: " + soxEvent.soxClient);
	};
	soxEventListener.subscribed = function(soxEvent) {
		status("Subscribed: " + soxEvent.device);
	};
	soxEventListener.subscriptionFailed = function(soxEvent) {
		/* デバイスが存在しないなどのときはここに来る */
		status("Subscription Failed: " + soxEvent.device);
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

		//データの中身をみて、<div id="latestData">部分で表示します
		var dataString = "";
		for (var i = 0; i < soxEvent.device.transducers.length; i++) {

			if (soxEvent.device.transducers[i].sensorData != null) {

				//もし画像データの場合は<img>タグで表示します。
				if (soxEvent.device.transducers[i].sensorData.rawValue.lastIndexOf("data:image", 0) === 0) {
					dataString = dataString + soxEvent.device.transducers[i].id + ": <img src='" + soxEvent.device.transducers[i].sensorData.rawValue + "'><br>";
				} else {
					dataString = dataString + "【"+soxEvent.device.transducers[i].id + "】" + soxEvent.device.transducers[i].sensorData.rawValue + "<br>";
				}
			}
		}
		$("#latestData").html(dataString);

		//ログのところに表示します。
		status("Sensor data received: " + soxEvent.device);
	};

	soxEventListener.resolved = function(soxEvent) {
		//ログのところに表示します
		status("Resolved " + soxEvent.device);

		//ノード情報を表示してみます
		var metaDataStr = "ノード名:" + soxEvent.device.name + " タイプ:" + soxEvent.device.type + "<br>";
		var transducerInfoStr = "搭載されてるトランスデューサーの数：" + soxEvent.device.transducers.length + "個<br>";

		for (var i = 0; i < soxEvent.device.transducers.length; i++) {
			var t = soxEvent.device.transducers[i];
			transducerInfoStr = transducerInfoStr + " Transducer " + i + ": 名前=" + t.name + " ID=" + t.id + " Unit=" + t.units + "<br>";
		}
		$("#metaInfo").html(metaDataStr + transducerInfoStr);
	};

	soxEventListener.resolveFailed = function(soxEvent) {
		/* couldn't get device information from the server */
		status("Resolve Failed: " + soxEvent.device + " code=" + soxEvent.errorCode + " type=" + soxEvent.errorType);
	};

	client.setSoxEventListener(soxEventListener);
	client.connect();
};

function status(message) {
	var html = (new Date().toLocaleString()) + " [main.js] " + message + "<hr>\n" + $("#status").html();
	$("#status").html(html);
}
