// 실제 외부 JRT제어 프로그램 흉내
class MockJrtDaemon {
    constructor() {
        // Daemon 프로세스가 실제로 동작중인지 나타내는 값
        this.running = false;
        this.connected = false;
    }

    startProcess() {
        this.running = true;
        console.log("[JRT Daemon] Process started")
    }

    stopProcess() {
        this.running = false;
        console.log("[JRT Daemon] Process stopped")
    }

    // -1 = Daemon not running
    // -2 = Unknown command
    executeCommand(command, params) {
        if (!this.running){
            console.log("[JRT Daemon] Process need to start!")
            return {
                success: false,
                errorCode: -1
            };
        }

        if (command === "OPEN"){
            console.log("[JRT Daemon] Open command received");

            return {
                success: true,
                errorCode: 0
            };
        }

        else if (command === "GRIP"){
            console.log("[JRT Daemon] GRIP command received");

            console.log(params.pos);
            console.log(params.speed);
            console.log(params.torque);

            return {
                success: true,
                errorCode: 0
            };
        }

        
        else if (command === "STOP"){
            console.log("[JRT Daemon] STOP command received");
        
            return {
                success: true,
                errorCode: 0
            };
        }


        else{
            console.log("[JRT Daemon] Unknown command");
            return{
                success: false,
                errorCode: -2
            };
        }
    }
}


// Daemon 프로세스 실행,종료,상태 제어
class MockDaemonController{
    constructor(jrtDaemon) {
        this.jrtDaemon = jrtDaemon;
    }

    start(){
        this.jrtDaemon.startProcess();
    }
    
    stop(){
        this.jrtDaemon.stopProcess();
    }

    getState(){
        return this.jrtDaemon.running;
    }

}

// 실행 중인 JRT Daemon에 명령 전달
class MockJrtClient{
    constructor(jrtDaemon){
        this.jrtDaemon = jrtDaemon;
    }

    sendCommand(command , params) {
        return this.jrtDaemon.executeCommand(command, params);
    }

}


// 테스트 코드

const jrtDaemon = new MockJrtDaemon();

const controller =  new MockDaemonController(jrtDaemon);

// controller.start();

// console.log("Daemon state: " + controller.getState());

// jrtDaemon.executeCommand("OPEN");

// controller.stop();

// console.log("Daemon state: " + controller.getState());


const jrtClient = new MockJrtClient(jrtDaemon);

// jrtClient.sendCommand("OPEN");

// controller.start(); 

// jrtClient.sendCommand("OPEN");
// jrtClient.sendCommand("GRIP");


// DaemonController을 외부 Contribution에 제공
class MockDaemonService {
    constructor(daemonController){
    this.daemonController = daemonController;    
    }


    getDaemon() {        
        return this.daemonController;
    }
}


const daemonService = new MockDaemonService(controller);

// daemonService.getDaemon().start();

// console.log(daemonService.getDaemon().getState());

// daemonService.getDaemon().stop();

// console.log(daemonService.getDaemon().getState());


// UI/Plug-in 로직 입장에서 위 기능들을 조합
class MockGripperContribution {
    constructor(daemonService, jrtClient) {
        this.daemonService = daemonService;        
        this.jrtClient = jrtClient;
    }

    startDaemon() {
        this.daemonService.getDaemon().start();
    }

    stopDaemon() {
        this.daemonService.getDaemon().stop();
    }

    open() {
        const result = this.jrtClient.sendCommand("OPEN");
        
        if (result.success) {
            console.log("[Contribution] OPEN success");
        }
        else {
            console.log("[Contribution] OPEN failed!");
            console.log("[Contribution] errorCode =", result.errorCode);
        }
    }

    grip() {
        const params = {
            pos: 500,
            speed: 50,
            torque: 50
        };

        const result = this.jrtClient.sendCommand("GRIP", params);
        
        if (result.success)  {
            console.log("[Contribution] Grip success");
        }

        else {
            console.log("[Contribution] Grip failed");
            console.log("[Contribution] Grip errorCode =", result.errorCode);
        }
    }

    stopMotion() {

        this.jrtClient.sendCommand("STOP"); 
    }

}


const contribution = new MockGripperContribution(daemonService, jrtClient);

// contribution.open();
// contribution.startDaemon();
// contribution.open();
// contribution.grip();
// contribution.stopMotion();
// contribution.stopDaemon();

// controller.start();
// const result2 = jrtClient.sendCommand("OPEN");
// console.log(result2);
// console.log(result2.success);
// console.log(result2.errorCode);


// contribution.open();
// controller.start();
// contribution.open();

contribution.grip();

controller.start();
contribution.grip();

