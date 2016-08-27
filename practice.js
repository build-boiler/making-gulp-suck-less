const EventEmitter = require('events');

class BuildBoiler extends EventEmitter {
  constructor(opts) {
    super();

    this.tasks = [];
  }

  run() {
    this.tasks.forEach(({name, task}) => task());
  }

  addTask(task) {
    this.tasks.push(task);
  }
}

class TaskHandler {
  constructor(name) {
    this.name = name;
  }

  makeEvent(event) {
    return `${this.name}:${event}`;
  }

  emit(event, data) {
    boiler.emit(
      this.makeEvent(event),
      data
    );
  }

  on(event, handler) {
    boiler.on(
      this.makeEvent(event),
      handler
    );
  }

  set task(fn) {
    if (this.registered) return; //only add the task once via prototype or set property

    boiler.addTask({
      name: this.name,
      task: fn.bind(this)
    });

    this.registered = true;
  }
}

const boiler = new BuildBoiler();

TaskHandler.prototype.task = function(gulp, plugins, config) {
  const data = {bleep: 'bloop'};

  this.emit('change', data);
  console.log('***********CALLED PROTO*************', data);
};

const handler = new TaskHandler('webpack');

handler.on('change', (d) => {
  d.handled = true;
});

handler.task = function(gulp, plugins, config) {
  const data = {bleep: 'bloop'};

  this.emit('change', data);
  console.log('***********CALLED*************', data);
};

boiler.run();
