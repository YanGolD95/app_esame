
'use strict';

var app = {
    initialize: function() {
        this.bindEvents();
        this.showMainPage();
    },
    bindEvents: function() {

        var TOUCH_START = 'touchstart';
        /*if (window.navigator.msPointerEnabled) { // windows phone
            TOUCH_START = 'MSPointerDown';
        }*/
        document.addEventListener('deviceready', this.onDeviceReady, false);
        refreshButton.addEventListener(TOUCH_START, this.refreshDeviceList, false);
        
        disconnectButton.addEventListener(TOUCH_START, this.disconnect, false);
        deviceList.addEventListener('touchstart', this.connect, false);
    },
    onDeviceReady: function() {
        app.refreshDeviceList();
    },
    refreshDeviceList: function() {
        bluetoothSerial.list(app.onDeviceList, app.onError);
    },
    onDeviceList: function(devices) {
        var option;

        // remove existing devices
        deviceList.innerHTML = "";
        app.setStatus("");

        devices.forEach(function(device) {

            var listItem = document.createElement('li'),
                html = '<b>' + device.name + '</b><br/>' + device.id;

            listItem.innerHTML = html;

           // if (cordova.platformId === 'windowsphone') {
              // This is a temporary hack until I get the list tap working
              /*var button = document.createElement('button');
              button.innerHTML = "Connect";
              button.addEventListener('click', app.connect, false);
              button.dataset = {};
              button.dataset.deviceId = device.id;
              listItem.appendChild(button);
            } else {*/
              listItem.dataset.deviceId = device.id;
            //}
            deviceList.appendChild(listItem);
        });

        if (devices.length === 0) {

            option = document.createElement('option');
            option.innerHTML = "No Bluetooth Devices";
            deviceList.appendChild(option);

            /*if (cordova.platformId === "ios") {*/ // BLE
                /*app.setStatus("No Bluetooth Peripherals Discovered.");
            } else {*/ // Android or Windows Phone
                app.setStatus("Please Pair a Bluetooth Device.");
            //}

        } else {
            app.setStatus("Found " + devices.length + " device" + (devices.length === 1 ? "." : "s."));
        }

    },
    connect: function(e) {
        var onConnect = function() {
                // subscribe for incoming data
                //bluetoothSerial.subscribe('\n', app.onData, app.onError);

                resultDiv.innerHTML = "";
                app.setStatus("Connected");
                app.showDetailPage();
            };

        var deviceId = e.target.dataset.deviceId;
        if (!deviceId) { // try the parent
            deviceId = e.target.parentNode.dataset.deviceId;
        }
		$("#bluen").css('display','none');
		$("#bluey").css('display','block');
        bluetoothSerial.connect(deviceId, onConnect, app.onError);
    },
    /*onData: function(data) { // data received from Arduino
        console.log(data);
        resultDiv.innerHTML = resultDiv.innerHTML + "Received: " + data + "<br/>";
        resultDiv.scrollTop = resultDiv.scrollHeight;
    },*/
    sendData: function(h) { // send data to Arduino

        var success = function() {
            console.log("success");
            
        };

        var failure = function() {
            alert("Failed writing data to Bluetooth peripheral");
        };

        var data = h;
        bluetoothSerial.write(data, success, failure);
    },
    disconnect: function(event) {
		$("#bluey").css('display','none');
		$("#bluen").css('display','block');
		localStorage.setItem("i","");
        bluetoothSerial.disconnect(app.showMainPage, app.onError);
    },
    
    showDetailPage: function() {
        blue.style.display = "none";
        tasti.style.display = "";
    },
    setStatus: function(message) {
        console.log(message);

        window.clearTimeout(app.statusTimeout);
        statusDiv.innerHTML = message;
        statusDiv.className = 'fadein';

        // automatically clear the status with a timer
        app.statusTimeout = setTimeout(function () {
            statusDiv.className = 'fadeout';
        }, 5000);
    },
    onError: function(reason) {
        alert("ERROR: " + reason); // real apps should use notification.alert
    },
	null: function(){}
};

function clear() {
	$("#lv1y,#lv2y,#lv3y,#lv4y,#lv5y").css('display','none');
	$("#lv1n,#lv2n,#lv3n,#lv4n,#lv5n").css('display','block');
	
}

$(document).ready(function(){
	$("#back").click(function() {
		$("#blue").css('display','none');
		$("#tasti").css('display','block');
		app.sendData("W");
	});
	
	$("#lv1n").click(function() {
		clear();
		$("#lv1n").css('display','none');
		$("#lv1y").css('display','block');
		localStorage.setItem("lv", $("#lv1n").val() );
		app.sendData("0");
	});

	$("#lv2n").click(function() {
		clear();
		$("#lv2n").css('display','none');
		$("#lv2y").css('display','block');
		localStorage.setItem("lv", $("#lv2n").val() );	
		app.sendData("1");
	});
	$("#lv3n").click(function() {
		clear();
		$("#lv3n").css('display','none');
		$("#lv3y").css('display','block');
		localStorage.setItem("lv", $("#lv3n").val() );
		app.sendData("2");
	});
	$("#lv4n").click(function() {
		clear();
		$("#lv4n").css('display','none');
		$("#lv4y").css('display','block');
		localStorage.setItem("lv", $("#lv4n").val() );
		app.sendData("3");
	});
	$("#lv5n").click(function() {
		clear();
		$("#lv5n").css('display','none');
		$("#lv5y").css('display','block');
		localStorage.setItem("lv", $("#lv5n").val() );
		app.sendData("4");
	});
	$("#bluen").click(function() {
		$("#tasti").css('display','none');
		$("#blue").css('display','block');
		app.initialize();
	});
	$("#bluey").click(function() {
		app.disconnect();
		localStorage.setItem("i","");
	});
	$("#ledoff").click(function() {
		$("#ledoff").css('display','none');
		$("#ledon").css('display','block');
		app.sendData("W");
	});
	$("#ledon").click(function() {
		$("#ledoff").css('display','block');
		$("#ledon").css('display','none');
		app.sendData("W");
	});
	
	$("#su").mousedown(function() {
		localStorage.setItem("i","F");
		console.log(localStorage.getItem('i'));
		app.sendData(localStorage.getItem('i'));
	});
	$("#giu").mousedown(function() {
		localStorage.setItem("i","B");
		console.log(localStorage.getItem('i'));
		app.sendData(localStorage.getItem('i'));
	});
	$("#sinistra").mousedown(function() {
		if(localStorage.getItem('i')==='F'){
			localStorage.setItem("j","G");
			app.sendData(localStorage.getItem('j'));
		}
		else if(localStorage.getItem('i')==='B'){
			localStorage.setItem("j","H");
			app.sendData(localStorage.getItem('j'));
		}
		else{
			localStorage.setItem("i","L");
			console.log(localStorage.getItem('i'));
			app.sendData(localStorage.getItem('i'));
		}
	});
	$("#destra").mousedown(function() {
		if(localStorage.getItem('i')==='F'){
			localStorage.setItem("j","I");
			app.sendData(localStorage.getItem('j'));
		}
		else if(localStorage.getItem('i')==='B'){
			localStorage.setItem("j","J");
			app.sendData(localStorage.getItem('j'));
		}
		else{
			localStorage.setItem("i","R");
			console.log(localStorage.getItem('i'));
			app.sendData(localStorage.getItem('i'));
		}
		
	});
	$("#su,#giu,#sinistra,#destra").mouseup(function() {
		
		if(localStorage.getItem('j')==='I' || localStorage.getItem('j')==='G'){
			localStorage.setItem("j","");
			app.sendData(localStorage.getItem('i'));
		}
		else if(localStorage.getItem('j')==='J' || localStorage.getItem('j')==='H'){
			localStorage.setItem("j","");
			app.sendData(localStorage.getItem('i'));
		}
		else{
			localStorage.setItem("i","");
			console.log(localStorage.getItem('i'));
			app.sendData("S");
			
		}
		
	});
	
});
