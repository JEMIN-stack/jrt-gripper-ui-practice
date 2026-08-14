const btnConnect = document.getElementById("btnConnect");
const btnDisconnect = document.getElementById("btnDisconnect");
const connectionStatus = document.getElementById("connectionStatus");
const btnOpen = document.getElementById("btnOpen");
const btnClose = document.getElementById("btnClose");
const btnStop = document.getElementById("btnStop");
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

const inputStandbyPreset = document.getElementById("inputStandbyPreset");
const btnSaveStandbyPreset = document.getElementById("btnSaveStandbyPreset");
const btnRunStandbyPreset = document.getElementById("btnRunStandbyPreset");

const inputGripPreset = document.getElementById("inputGripPreset");
const btnSaveGripPreset = document.getElementById("btnSaveGripPreset");
const btnRunGripPreset = document.getElementById("btnRunGripPreset");

const inputInternalRange = document.getElementById("inputInternalRange");
const inputExternalRange = document.getElementById("inputExternalRange");
const selectGripMode = document.getElementById("selectGripMode");


let connected = false;
let motionTimerId = null;
let feedbackTimerId = null;

let mockPosition = 0;
let mockSpeed = 0;
let mockTorque = 0;
let mockInternalRange = 0;
let mockExternalRange = 0;

let mockOperation = "IDLE";
let mockGripDetected = false;


class MockDataModel {

    constructor() {
        this.data = {};
    }

    set(key, value) {
        this.data[key] = value ;   //    this.data["position"] = 500; 
    }

    get(key){
        return this.data[key];            // key에 해당하는 값을 객체에서 꺼내 반환
    }

    has(key) {
        return key in this.data;      // in 연산자 --> 해당 key가 있으면 true, 없으면 false 반환

    }
}


const dataModel = new MockDataModel();


function openView() {
    if (feedbackTimerId != null){
        return;
    }

    feedbackTimerId = setInterval(updateFeedback, 500);
}

function closeView(){
    if (feedbackTimerId !== null){
        clearInterval(feedbackTimerId);
        feedbackTimerId = null;
    }    
    
    if (motionTimerId !== null){
        clearTimeout(motionTimerId);
        motionTimerId = null;
    }
}

// Rodi-X Tutorial의 updatePage() 역할을 Mock으로 구현
function updateFeedback() {
    
    if(!connected) {
        return;
    }
    
    actualPosition.textContent = mockPosition;
    actualSpeed.textContent = mockSpeed;
    actualTorque.textContent = mockTorque;
    currentOperation.textContent = mockOperation;
    gripDetected.textContent = mockGripDetected;
}


function resetFeedback() {
    actualSpeed.textContent = 0;
    actualTorque.textContent = 0;
    currentOperation.textContent = 'DISCONNECTED';
    gripDetected.textContent = false;
}




btnConnect.addEventListener("click", function() {
    
    connected = true;
    connectionStatus.textContent = "CONNECTED";
    
    openView();
});

btnDisconnect.addEventListener("click", function(){
    
    connected = false;
    connectionStatus.textContent = "DISCONNECTED";
    mockOperation = 0;
    mockGripDetected = false;
    mockSpeed = 0;
    mockTorque = 0;
    closeView();
    resetFeedback();
});

btnOpen.addEventListener("click", function() {

    if (connected === false) {
        logArea.textContent = "Gripper is not connected.";
        return;
    }

    if (motionTimerId != null){
        logArea.textContent = "Motion is already in progress";
        return;
    }

    mockOperation = "OPENING";
    logArea.textContent = "Open command started."

    motionTimerId = setTimeout(function() {

        logArea.textContent = "Open operation complete";
        mockOperation = "IDLE";
        mockPosition = 1000;
        motionTimerId = null;
    }, 1000);
});

btnClose.addEventListener("click", function() {

    if (connected === false) {
        logArea.textContent = "Gripper is not connected.";
        return;
    }

    if (motionTimerId != null){
        logArea.textContent = "Motion is already in progress";
        return;
    }
    
    mockOperation = "CLOSING";
    logArea.textContent = "Close command started.";

    motionTimerId = setTimeout(function() {

        mockOperation = "IDLE";
        mockPosition = 0;
        logArea.textContent = "Close operation complete";
        motionTimerId = null;

    }, 1000);

});


btnStandby.addEventListener("click", function() {

    if (connected === false) {
        logArea.textContent = "Gripper is not connected";
        return;
    }

    if (motionTimerId != null){
        logArea.textContent = "Motion is already in progress";
        return;
    }

    let targetPosition = Number(inputPosition.value);
    let targetSpeed = Number(inputSpeed.value);
    let targetTorque = Number(inputTorque.value);
    
    mockOperation = "STANDBY MODE";
    
    logArea.textContent = "Standby command started. Target = " + targetPosition +
                          ", Speed = " + targetSpeed +
                          ", Torque = " + targetTorque;
    // 1초 뒤 Standby 완료
    motionTimerId = setTimeout(function(){
        
        mockPosition = targetPosition;
        mockSpeed = targetSpeed;
        mockTorque = targetTorque;

        mockOperation = "IDLE";
        
        logArea.textContent = "Standby operation complete";

        motionTimerId = null;
    }, 1000 );
    
});


btnGrip.addEventListener("click" , function() {
   // 1.연결상태 확인
    if (connected === false) {
        logArea.textContent = "Gripper is not connected";
        return;
    }
    
    if (motionTimerId != null){
        logArea.textContent = "Motion is already in progress";
        return;
    }

    // 2. 사용자 입력값 읽기
    let targetPosition = Number(inputPosition.value);
    let targetSpeed = Number(inputSpeed.value);
    let targetTorque = Number(inputTorque.value);
    
    dataModel.set("position", targetPosition);
    dataModel.set("speed", targetSpeed);
    dataModel.set("torque", targetTorque);

    let gripPosition = dataModel.get("position");
    let gripSpeed = dataModel.get("speed");
    let gripTorque = dataModel.get("torque"); 
    // 3. 동작 시작 상태
    mockOperation= "GRIP MODE";
    mockGripDetected = false;

    logArea.textContent = "Grip command started. Target = " + gripPosition +
                          ", Speed = " + gripSpeed +
                          ", Torque = " + gripTorque;

    // 4. 1초 뒤 동작 완료
    motionTimerId = setTimeout(function() {
        mockPosition = gripPosition;
        mockSpeed = gripSpeed;
        mockTorque = gripTorque;

        mockGripDetected = true;
        mockOperation = "IDLE";
        logArea.textContent = "Grip operation complete!";
        motionTimerId = null;
    }, 1000 );

});


btnStop.addEventListener("click", function () {
    if (!connected){
        logArea.textContent = "Gripper is not connected";
        return;
    }

    if (motionTimerId !== null) {
        clearTimeout(motionTimerId);
        motionTimerId = null;
        mockOperation= "STOPPED";
        logArea.textContent = "STOP operation complete!";
    }

});


btnSaveStandbyPreset.addEventListener("click", function() {
    // 연결 상태 확인 
    if (!connected) {
        logArea.textContent = "Gripper is not connected";
        return;
    }
    
    //1. preset 번호 읽기
    let presetIndex = Number(inputStandbyPreset.value);

    //2. Position / Speed / Torque 값 읽기
    let position = Number(inputPosition.value);
    let speed = Number(inputSpeed.value);
    let torque = Number(inputTorque.value);

    //3. 하나의 객체로 묶기
    let preset = {
        position: position,
        speed: speed,
        torque: torque
    };

    //4. 저장할 key 만들기
    let key = "StandbyPreset_" + presetIndex;

    //5. DataModel 저장
    dataModel.set(key, preset);

    //6. 로그출력
    logArea.textContent = " Standby Preset"+ presetIndex +" Saved!";
});



btnRunStandbyPreset.addEventListener("click", function() {
    
    // 연결 상태 확인 
    if (!connected) {
        logArea.textContent = "Gripper is not connected";
        return;
    }
    
    
    // motion 진행 중인지 확인
    if (motionTimerId != null){
        logArea.textContent = "Motion is already in progress";
        return;
    }

    //1. preset 번호 읽기
    let presetIndex = Number(inputStandbyPreset.value);

    // 2. key 생성
    let key = "StandbyPreset_" + presetIndex;
    
    //3. 저장된 preset 존재 여부 확인
    if (!dataModel.has(key)) {
        logArea.textContent = "Standby Preset " + presetIndex + "is not saved.";
        return;
    }

    //4. 저장된 preset 가져오기
    let preset = dataModel.get(key);

    //5. mockOperation 변경
    mockOperation = "STANDBY MODE";
    logArea.textContent = "Standby Preset run!";

    //6. setTimeout()
    motionTimerId = setTimeout(function() {

        logArea.textContent = "Standby preset run complete";
        mockOperation = "IDLE";
        mockPosition = preset.position;
        mockSpeed = preset.speed;
        mockTorque = preset.torque;
        motionTimerId = null;
    }, 1000)

});



btnSaveGripPreset.addEventListener("click", function() {

    // 연결 상태 확인 
    if (!connected) {
        logArea.textContent = "Gripper is not connected";
        return;
    }

    //1. preset 번호 읽기
    let presetIndex = Number(inputGripPreset.value);

    //2. Position / Speed / Torque / internalRange / externalRange  값 읽기
    let position = Number(inputPosition.value);
    let speed = Number(inputSpeed.value);
    let torque = Number(inputTorque.value);
    let internalRange = Number(inputInternalRange.value);
    let externalRange = Number(inputExternalRange.value);

    //3. 하나의 객체로 묶기
    let preset = {
        position: position,
        speed: speed,
        torque: torque,
        internalRange: internalRange,
        externalRange: externalRange
    };

    //4. 저장할 key 만들기
    let key = "GripPreset_" + presetIndex;

    //5. DataModel 저장
    dataModel.set(key, preset);

    //6. 로그출력
    logArea.textContent = key + " Saved!";
});


btnRunGripPreset.addEventListener("click", function() {

  
    // 연결 상태 확인 
    if (!connected) {
        logArea.textContent = "Gripper is not connected";
        return;
    }
    
    // motion 진행 중인지 확인
    if (motionTimerId != null){
        logArea.textContent = "Motion is already in progress";
        return;
    }
    
    //1. preset 번호 읽기
    let presetIndex = Number(inputGripPreset.value);
    
    // 2. key 생성
    let key = "GripPreset_" + presetIndex;

    // 저장된 preset 존재 여부 확인
    if (!dataModel.has(key)) {
        logArea.textContent = "Grip Preset " + presetIndex + " is not saved.";
        return;
    }
    //3. 저장된 preset 가져오기
    let preset = dataModel.get(key);

    

    // mockOperation 변경
    mockOperation = "GRIP MODE";
    logArea.textContent = "Grip Preset run!";

    // setTimeout()
    motionTimerId = setTimeout(function() {

        logArea.textContent = key + " run complete";
        mockOperation = "IDLE";
        mockPosition = preset.position;
        mockSpeed = preset.speed;
        mockTorque = preset.torque;
        mockGripDetected = true;
        motionTimerId = null;

        
    }, 1000)

});





