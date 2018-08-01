
var Chess = require('./node_modules/chess.js').Chess;
const model = require('./models/firstModel') 
const tf = require('@tensorflow/tfjs');
var ReplayMemory = require('./ReplayMemory')
var events = require('events');
var eventEmitter = new events.EventEmitter();


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
var chess = new Chess();

var chessEnv = function(){
    this.chess = new Chess();
    this.board = this.chess.board();
    this.ReplayMemory = new ReplayMemory

    this.managedToTakeTurn = true;
}

chessEnv.prototype.TakeTurn = async function(){
    this.stateTensor = AssembleBoardState(this.chess.board())
    this.QTensor = await this.ReplayMemory.GetQValues(this.stateTensor);
    this.ReplayMemory.LogQValues(this.QTensor)

    this.managedToTakeTurn = await this.TakeAction()  
    
    if(!this.managedToTakeTurn){
        await this.PunishFailedMove();
    }else{
        this.ReplayMemory.LogStates(this.stateTensor);
        this.ReplayMemory.LogQValues(this.QTensor);
    }
    
    eventEmitter.emit('end turn');
}


chessEnv.prototype.TakeAction = async function(){

    index = await FindMaxQValueIndex(this.QTensor)
    move = ParseMove(index)
    console.log(index)
    console.log(move)

    results = chess.move(move)

    if(results){
        console.log("made a move")
        console.log(results)
        return true;
    }else{
        console.log("Failed to make a move")
        return false;
    }
    
}

chessEnv.prototype.CheckGameState = function(){
    if(chess.in_checkmate()){return false}
    if(chess.in_draw()){return false}
    if(chess.in_stalemate()){return false}
    if(chess.insufficient_material()){return false}
    return this.managedToTakeTurn;
}
chessEnv.prototype.ResetBoard = function(){
    chess.reset();
    this.managedToTakeTurn = true;
}
chessEnv.prototype.PunishFailedMove = async function(){
    StateMask = 

}

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
FindMaxQValueIndex = async function(tensor){
    reducedTensor = tf.argMax(tensor, 3)   
    var index = [[],[],[],[],[],[],[],[]];
    for(xAxis = 0; xAxis<8; xAxis++){
        for(yAxis = 0; yAxis<8; yAxis++){
            temp = (await reducedTensor.slice([0,xAxis,yAxis],[1,1,1]).data())[0]
            index[xAxis][yAxis] = (await tensor.slice([0,xAxis,yAxis,temp],[1,1,1,1]).data())[0]           
        }
    }
    tempIndex = []
    tempVal = []
    for(i=0;i<8;i++){
        tempIndex[i] = indexOfMax(index[i])
        tempVal[i] = index[i][tempIndex[i]];
    }
    indexX = indexOfMax(tempVal)
    indexY = tempIndex[indexX]
    indexZ = (await reducedTensor.slice([0,indexX,indexY],[1,1,1]).data())[0]
    return index = {
        X: indexX,
        Y: indexY,
        Z: indexZ,
    }
}
function indexOfMax(arr) {
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }

    return maxIndex;
}
ParseMove = function(index){
    var toX = 0;
    var toY = 0;
    var indexZ = index.Z
    var indexX = 8 - index.X
    var from = ''+(8 - index.X)+String.fromCharCode(97 + index.Y);
    if(index.Z<56){
        if(indexZ<7){
            toX= indexX + indexZ + 1;
            toY= index.Y;
        }else
        if(index.Z<14){
            indexZ = indexZ-7;
            toX= indexX - indexZ - 1;
            toY= index.Y;
        }else
        if(index.Z<21){
            indexZ = indexZ- 14;
            toX= indexX
            toY= index.Y + indexZ + 1;
        }else
        if(index.Z<28){
            indexZ = 21;
            toX= indexX
            toY= index.Y - indexZ - 1;
        }else
        if(index.Z<35){
            indexZ =indexZ- 28;
            toX= indexX + indexZ + 1;
            toY= index.Y + indexZ + 1;
        }else
        if(index.Z<42){
            indexZ =indexZ- 35;
            toX= indexX - indexZ - 1;
            toY= index.Y - indexZ - 1;
        }else
        if(index.Z<49){
            indexZ =indexZ- 42;
            toX= indexX + indexZ + 1;
            toY= index.Y + indexZ - 1;
        }else
        if(index.Z<56){
            indexZ =indexZ- 49;
            toX= indexX - indexZ - 1;
            toY= index.Y - indexZ + 1;
        }
    }else{
        switch(index.Z){
            case 56:
                toX = indexX + 2
                toY = index.Y + 1
            case 57:
                toX = indexX + 2
                toY = index.Y - 1
            case 58:
                toX = indexX - 2
                toY = index.Y + 1
            case 59:
                toX = indexX - 2
                toY = index.Y - 1
            case 60:
                toX = indexX + 1
                toY = index.Y + 2
            case 61:
                toX = indexX - 1
                toY = index.Y + 2
            case 62:
                toX = indexX + 1
                toY = index.Y - 2
            case 63:
                toX = indexX - 1
                toY = index.Y - 2

            case 64:
                toX = indexX - 1
                toY = index.Y - 2
            // case 65:
            // case 66:
            // case 67:
            // case 68:
            // case 69:
            // case 70:
            // case 71:
            // case 72:
            // case 73:
        }
    }
    var to = ''+toX+String.fromCharCode(97 + toY);
    return {from: from, to: to}
}

module.exports = chessEnv;
