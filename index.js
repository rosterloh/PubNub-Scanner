/**
 * Module dependencies.
 */

var program = require('commander'),
    colors  = require('colors'),
    pkg     = require('./package.json'),
    PUBNUB = require('pubnub');

program
  .version(pkg.version)
  .description(pkg.description)
  .option('-s, --subscribe [key]', 'Subscribe key', 'sub-c-0313f6b2-b2c0-11e4-ab0e-02ee2ddab7fe')
  .option('-p, --publish [key]', 'Publish key', 'pub-c-e3a95948-182a-46fd-b5f3-52c184eb3c12')
  .parse(process.argv);

var pubnub = PUBNUB.init({
  publish_key   : program.publish,
  subscribe_key : program.subscribe,
  //ssl           : true,
});

console.log(pubnub.get_version());

function consoleOut(m) {
  console.log('[callback] '.yellow + JSON.stringify(m));
}

function errorOut(m) {
  console.log('[error] '.red + JSON.stringify(m));
}

function dataOut(m) {
  console.log('[data] '.blue + JSON.stringify(m));
}

pubnub.subscribe({
  channel     : 'my_channel',
  message     : dataOut,
  connect     : consoleOut,
  disconnect  : consoleOut,
  reconnect   : consoleOut,
  error       : errorOut
});

var readline = require('readline'),
    rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt(
  'p: Publish Test data\n' +
  's: Toggle subscription\n');
rl.prompt();

rl.on('line',function (line) {
  switch (line.trim()) {
    case 'p':
      pubnub.publish({
        channel   : 'my_channel',
        message   : 'test',
        callback  : consoleOut,
        error     : errorOut
      });
      break;
    case '?':
      rl.prompt();
      break;
    default:
      break;
  }
}).on('close', function () {
  console.log('got ctrl+c, exiting...'.blue);
  process.exit(0);
});
