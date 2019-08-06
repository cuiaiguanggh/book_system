
class observ {
  constructor() {
    this.handle = {};
  }

  //订阅
  addSubscribe(eventName, callback) {
    this.handle[eventName] = callback
  };

  //发布
  publish(eventName, parameter) {
    if (this.handle.hasOwnProperty([eventName])){
      this.handle[eventName](parameter)
    }
  };
}

let observer = new observ();
export default observer
