import EventEmitter from 'events';

export default class Practice extends EventEmitter {
  task(gulp, plugins, config) {

    console.log('before');
    return () => {
      this.emit('bleep');

      console.log('after');
    };
  }
}
