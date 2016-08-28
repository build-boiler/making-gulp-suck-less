import EslintBoiler from '../packages/gulpy-boiler-task-eslint';

export default class Eslint extends EslintBoiler {
  constructor(name, plugins, config) {
    super(name, plugins, config);

    this.on('change', (data) => {
      console.log('**CHANGED**', this.name);
      console.log(Object.keys(data));

      data.bleep = 'bloop';
    });
  }
}
