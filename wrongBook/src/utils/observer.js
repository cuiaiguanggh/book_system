

class observ {
  constructor() {
    this.subscribe = {};
  }

  //订阅
  addSubscribe(eventName, callback) {
    this.subscribe[eventName] = callback
  };

  //发布
  publish(eventName, ...parameter) {
    if (this.subscribe.hasOwnProperty([eventName])){
      this.subscribe[eventName](...parameter)
    }
  };

  remove(eventName) {
    if (this.subscribe.hasOwnProperty([eventName])){
      delete this.subscribe[eventName]
    }
  };
}

let observer = new observ();
export default observer
