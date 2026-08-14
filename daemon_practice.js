class MockDaemon {
    constructor() {
        //처음에는 실행 중이 아님
        this.running_state = false;
    }

    start() {
        // running 상태를 true로 변경
        this.running_state = true;
        // 콘솔에 실행 메시지 출력
        console.log("Daemon started")
    }

    stop() {
        // running 상태를 false로 변경
        this.running_state = false;
        // 콘솔에 실행 메시지 출력
        console.log("Daemon stopped");
    }
    
    getState() {
        // 현재 running 상태 반환
        return this.running_state;
    }
}

//const daemon = new MockDaemon();

class MockDaemonService {
    constructor(DaemonClass) {
        // 외부 클래스 MockDaemon 활용
        this.daemon = new DaemonClass();
    }

    getDaemon(){
        // 저장된 daemon 반환
        return this.daemon;
    }
}

const daemonService = new MockDaemonService(MockDaemon);

const damn = daemonService.getDaemon();

daemonService.getDaemon().start();
console.log(damn.getState());

daemonService.getDaemon().stop();
console.log(damn.getState());


class MockGripperContribution {
    constructor(daemonService){
        this.daemonService = daemonService;
    }

    startDaemon() {
        this.daemonService.getDaemon().start();
        return this.daemonService.getDaemon().getState();

    }

    stopDaemon() {
        this.daemonService.getDaemon().stop();
        return this.daemonService.getDaemon().getState();

    }
}

const iwanttogohome = new MockGripperContribution(daemonService);

console.log(iwanttogohome.startDaemon());

console.log(iwanttogohome.stopDaemon());







