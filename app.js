const btnConnect = document.getElementById("btnConnect");
const btnDisconnect = document.getElementById("btnDisconnect");
const connectionStatus = document.getElementById("connectionStatus");
const btnOpen = document.getElementById("btnOpen");
const btnClose = document.getElementById("btnClose");
const currentOperation = document.getElementById("currentOperation");
const logArea = document.getElementById("logArea");
const actualPosition = document.getElementById("actualPosition");
const btnStandby = document.getElementById("btnStandby");
const inputPosition = document.getElementById("inputPosition");

const btnGrip = document.getElementById("btnGrip");
const inputSpeed = document.getElementById("inputSpeed");
const inputTorque = document.getElementById("inputTorque");
const actualSpeed = document.getElementById("actualSpeed");
const actualTorque = document.getElementById("actualTorque");
const gripDetected = document.getElementById("gripDetected");

let connected = false;

btnConnect.addEventListener("click", function() {
    
    connected = true;
    connectionStatus.textContent = "CONNECTED";
});

btnDisconnect.addEventListener("click", function(){
    
    connected = false;
    connectionStatus.textContent = "DISCONNECTED";
});

btnOpen.addEventListener("click", function() {

    if (connected === false) {
        logArea.textContent = "Gripper is not connected.";
        return;
    }

    currentOperation.textContent = "OPENING";
    logArea.textContent = "Open command started."

    setTimeout(function() {

        currentOperation.textContent = "IDLE";
        logArea.textContent = "Open operation complete";
        actualPosition.textContent = "1000";

    }, 1000);
});

btnClose.addEventListener("click", function() {

    if (connected === false) {
        logArea.textContent = "Gripper is not connected.";
        return;
    }

    currentOperation.textContent = "CLOSING";
    logArea.textContent = "Close command started.";

    setTimeout(function() {

        currentOperation.textContent = "IDLE";
        logArea.textContent = "Close operation complete";
        actualPosition.textContent = "0";

    }, 1000);

});


btnStandby.addEventListener("click", function() {

    if (connected === false) {
        logArea.textContent = "Gripper is not connected";
        return;
    }

    let targetPosition = Number(inputPosition.value);

    currentOperation.textContent = "STANDBY MODE";
    logArea.textContent = "Standby command started. Target = " + targetPosition;    

    // 1초 뒤 Standby 완료
    setTimeout(function(){
        
        currentOperation.textContent = "IDLE";
        
        logArea.textContent = "Standby operation complete";

        actualPosition.textContent = targetPosition;
    }, 1000 );
    
});


btnGrip.addEventListener("click" , function() {
   // 1.연결상태 확인
    if (connected === false) {
        logArea.textContent = "Gripper is not connected";
        return;
    }

    // 2. 사용자 입력값 읽기
    let targetPosition = Number(inputPosition.value);
    let targetSpeed = Number(inputSpeed.value);
    let targetTorque = Number(inputTorque.value);
    
    // 3. 동작 시작 상태
    currentOperation.textContent = "GRIP MODE";

    gripDetected.textContent = "false";

    logArea.textContent = "Grip command started. Target = " + targetPosition +
                          ", Speed = " + targetSpeed +
                          ", Torque = " + targetTorque;

    // 4. 1초 뒤 동작 완료
    setTimeout(function() {
        actualPosition.textContent = targetPosition;
        actualSpeed.textContent = targetSpeed;
        actualTorque.textContent = targetTorque;

        gripDetected.textContent = "true";
        currentOperation.textContent = "IDLE";
        logArea.textContent = "Grip operation complete!";
    }, 1000 );

});


