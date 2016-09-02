#### Steps to Install & Run
- Install [NVM](https://github.com/creationix/nvm) to manage/install NodeJS
- `nvm install 6` to install Node 6
- `npm i -g npm@3` to update your NPM
- `npm i -g gulp-cli` to install Gulp task runner globally
- `npm i`
- `npm run lerna:bootstrap`
- `gulp babel` compile all of the `packages/*/dist` for the first time
- `gulp watch`
- `gulp build -q && gulp browser-sync` prod like build, without uglification/minification
- `gulp build && gulp browser-sync` prod like build, with uglification/minification

#### Weirdness
"packages" comprise the build and are build by the build. Therefore, if internal "packages" are in a bad state the "build/tasks/babel" ttask will override. Run `gulp babel` and an error might show in the terminal but packages should still build. Run any gulp task now and you should NOT see an error unless your compiled package has an error.

Troubleshooting:
- `rm -rf packages/*/dist`
- `gulp babel`
- `gulp watch` or `gulp dev`

Kil everything:
- `rm -rf node_modules && npm cache clean`
- `rm -rf packages/*/(node_modules|dist)`
- `npm i && npm run lerna:bootstrap`

#### Returning Users
- `nvm use && gulp watch`

#### Debugging
- install [iron-node](https://github.com/s-a/iron-node) `npm i -g iron-node@2.2.15`
- debug gulp tasks => first place `debugger` breakpoints
```
iron-node `which gulp` <your_task>
```

#### Testing
- write tests in `packages/*/test`
- `gulp ava` run all tests
- `gulp ava -f <test_file_name_no_ext>` run single test
- `gulp ava --debug` use `iron-node` to debug tests

#### Flow
- add the flow pragma `// @flow` at the top of any file in the `packages` or `build` directory
- `gulp flow` runs flow
- `gulp dev` runs `babel` && `flow` and watches for changes
- add declarations in the `declarations` directory and they will be exposed to `flow` globally
