var Chess = require('./node_modules/chess.js').Chess;
const model = require('./models/firstModel') 
const tf = require('@tensorflow/tfjs');
var chessEnv = require('./ChessEnv')

chessEnv = new chessEnv;

chessEnv.TakeTurn();

