class MockJrtDaemon {
    constructor() {
        // Daemon 프로세스가 실제로 동작중인지 나타내는 값
        this.running = false;
    }

    startProcess() {
        this.running = true;
        console.log("[JRT Daemon] Process started")
    }

    stopProcess() {
        this.running = false;
        console.log("[JRT Daemon] Process stopped")
    }

    executeCommand(command) {
        if (!this.running){
            console.log("[JRT Daemon] Process need to start!")
            return;
        }

        if (command === "OPEN"){
            console.log("[JRT Daemon] Open command received");
        }

        
        else if (command === "GRIP"){
            console.log("[JRT Daemon] GRIP command received");
        }

        
        else if (command === "STOP"){
            console.log("[JRT Daemon] STOP command received");
        }

        else{
            console.log("[JRT Daemon] Unknown command");
            return;
        }
    }
}

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

class MockJrtClient{
    constructor(jrtDaemon){
        this.jrtDaemon = jrtDaemon;
    }

    sendCommand(command) {
        this.jrtDaemon.executeCommand(command);
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

class MockDaemonService {
    constructor(daemonController){
    this.daemonController = daemonController;
    
    }


    getDaemon() {        
        return this.daemonController;

    }
}


const daemonService = new MockDaemonService(controller);

daemonService.getDaemon().start();

console.log(daemonService.getDaemon().getState());

daemonService.getDaemon().stop();

console.log(daemonService.getDaemon().getState());





















