
var Chess = require('./node_modules/chess.js').Chess;
const model = require('./models/firstModel') 
const tf = require('@tensorflow/tfjs');
var ReplayMemory = require('./ReplayMemory')


const PAWN =  'p'
const ROOK = 'r'
const KNIGHT = 'n'
const BISHOP ='b'
const QUEEN = 'q'
const KING = 'k'

const PAWN_BLACK = { type: 'p', color: 'b' }
const ROOK_BLACK = { type: 'r', color: 'b' }
const KNIGHT_BLACK = { type: 'n', color: 'b' }
const BISHOP_BLACK = { type: 'b', color: 'b' }
const QUEEN_BLACK = { type: 'q', color: 'b' }
const KING_BLACK = { type: 'k', color: 'b' }
                        //[1,2,3,4,5,6,7,8,9,0,1,2]
const PAWN_WHITE_ARR    = [1,0,0,0,0,0,0,0,0,0,0,0]
const ROOK_WHITE_ARR    = [0,1,0,0,0,0,0,0,0,0,0,0]
const KNIGHT_WHITE_ARR  = [0,0,1,0,0,0,0,0,0,0,0,0]
const BISHOP_WHITE_ARR  = [0,0,0,1,0,0,0,0,0,0,0,0]
const QUEEN_WHITE_ARR   = [0,0,0,0,1,0,0,0,0,0,0,0]
const KING_WHITE_ARR    = [0,0,0,0,0,1,0,0,0,0,0,0]

const PAWN_BLACK_ARR    = [0,0,0,0,0,0,1,0,0,0,0,0]
const ROOK_BLACK_ARR    = [0,0,0,0,0,0,0,1,0,0,0,0]
const KNIGHT_BLACK_ARR  = [0,0,0,0,0,0,0,0,1,0,0,0]
const BISHOP_BLACK_ARR  = [0,0,0,0,0,0,0,0,0,1,0,0]
const QUEEN_BLACK_ARR   = [0,0,0,0,0,0,0,0,0,0,1,0]
const KING_BLACK_ARR    = [0,0,0,0,0,0,0,0,0,0,0,1]

const EMPTY             = [0,0,0,0,0,0,0,0,0,0,0,0]
// const PAWN_WHITE_ARR    = [[1],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]]
// const ROOK_WHITE_ARR    = [[0],[1],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]]
// const KNIGHT_WHITE_ARR  = [[0],[0],[1],[0],[0],[0],[0],[0],[0],[0],[0],[0]]
// const BISHOP_WHITE_ARR  = [[0],[0],[0],[1],[0],[0],[0],[0],[0],[0],[0],[0]]
// const QUEEN_WHITE_ARR   = [[0],[0],[0],[0],[1],[0],[0],[0],[0],[0],[0],[0]]
// const KING_WHITE_ARR    = [[0],[0],[0],[0],[0],[1],[0],[0],[0],[0],[0],[0]]

// const PAWN_BLACK_ARR    = [[0],[0],[0],[0],[0],[0],[1],[0],[0],[0],[0],[0]]
// const ROOK_BLACK_ARR    = [[0],[0],[0],[0],[0],[0],[0],[1],[0],[0],[0],[0]]
// const KNIGHT_BLACK_ARR  = [[0],[0],[0],[0],[0],[0],[0],[0],[1],[0],[0],[0]]
// const BISHOP_BLACK_ARR  = [[0],[0],[0],[0],[0],[0],[0],[0],[0],[1],[0],[0]]
// const QUEEN_BLACK_ARR   = [[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[1],[0]]
// const KING_BLACK_ARR    = [[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[1]]

// const EMPTY             = [[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0]]


var chessEnv = function(){
    this.chess = new Chess();
    this.ReplayMemory = new ReplayMemory;

    this.nnWhite = model;
    this.nnBlack = model;
    this.board = this.chess.board();
}

chessEnv.prototype.TakeTurn = async function(){
    stateTensor = AssembleBoardState(this.chess.board())
    QTensor = await this.ReplayMemory.GetQValues(stateTensor);
    console.log(await QTensor.data())
    qnew = tf.argMax(QTensor,0)
    console.log(await qnew.data())

    // qnew = tf.argMax(qnew)
    // console.log(qnew)
    // qnew = tf.argMax(qnew)
    // console.log(qnew)
    // //qnew = tf.argMax(qnew)
    // console.log(await qnew.data())

    this.ReplayMemory.LogStates(stateTensor);
    this.ReplayMemory.LogQValues(QTensor);
    
}



//console.log(chess.history())
//console.log(chess.pgn());

AssembleBoardState = function(board){
    var state = []
    for(a=0; a<8; a++){
        state[a] =[];
        for(b=0; b<8; b++){
            var boardCell = board[a][b]
            if(boardCell === null){
                state[a][b] = EMPTY
            }else if(boardCell.color === 'w'){
                if(boardCell.type == PAWN){state[a][b] = PAWN_WHITE_ARR}
                if(boardCell.type == ROOK){state[a][b] = ROOK_WHITE_ARR}
                if(boardCell.type == KNIGHT){state[a][b] = KNIGHT_WHITE_ARR}
                if(boardCell.type == BISHOP){state[a][b] = BISHOP_WHITE_ARR}
                if(boardCell.type == QUEEN){state[a][b] = QUEEN_WHITE_ARR}
                if(boardCell.type == KING){state[a][b] = KING_WHITE_ARR}
            }else if(boardCell.color === 'b'){
                if(boardCell.type === PAWN){state[a][b] = PAWN_BLACK_ARR}
                if(boardCell.type === ROOK){state[a][b] = ROOK_BLACK_ARR}
                if(boardCell.type === KNIGHT){state[a][b] = KNIGHT_BLACK_ARR}
                if(boardCell.type === BISHOP){state[a][b] = BISHOP_BLACK_ARR}
                if(boardCell.type === QUEEN){state[a][b] = QUEEN_BLACK_ARR}
                if(boardCell.type === KING){state[a][b] = KING_BLACK_ARR}
            }
            
        }
    }
    
    return tf.tensor4d([state]);
}


module.exports = chessEnv;
// stateTensor = AssembleBoardState(chess.board())

// outputTensor = nnWhite.predict(stateTensor)

// data = outputTensor.print()
// console.log();



// while (!chess.game_over()) {
//   var moves = chess.moves();
//   var move = moves[Math.floor(Math.random() * moves.length)];
//   chess.move(move);
  
// }