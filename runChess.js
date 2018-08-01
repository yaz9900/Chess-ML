//var Chess = require('./node_modules/chess.js').Chess;
const model = require('./models/firstModel') 
const tf = require('@tensorflow/tfjs');
var chessEnv = require('./ChessEnv')
var events = require('events');
// var Model = require('./ReplayMemory')

var eventEmitter = new events.EventEmitter();
chessEnv = new chessEnv;

// var nnWhite = new Model('White');
// var nnBlack = new Model('Black');


PlayGame = async function(){

    while(chessEnv.ReplayMemory.runData.states.length < chessEnv.ReplayMemory.memoryLength){
        
        await chessEnv.TakeTurn();
        
        gameState = await chessEnv.CheckGameState();

        if(!gameState){
            await chessEnv.ResetBoard()
        }
    }

}


PlayGame()





// var TakeTurn = function () {
//     console.log('I took a turn');
//     chessEnv.TakeTurn();
// }

// var UpdateReplayMemory = function () {
//     console.log('I updated Replay memory');
// }

// var TeachModel = function () {
//     console.log('I taught a model');
// }

// eventEmitter.on('end turn', TakeTurn);


// TakeTurn()