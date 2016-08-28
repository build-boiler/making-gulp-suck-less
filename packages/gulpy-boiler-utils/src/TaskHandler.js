import EventEmitter from 'events';

export default class TaskHandler extends EventEmitter {
  constructor(name) {
    super();
    this.name = name;
  }

  on(event, cb) {
    super.on(event, cb);
  }
}
