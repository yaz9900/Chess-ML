
var Chess = require('./node_modules/chess.js').Chess;
const model = require('./models/firstModel') 
const tf = require('@tensorflow/tfjs');
var ReplayMemory = require('./ReplayMemory')
var events = require('events');
var eventEmitter = new events.EventEmitter();

//const string for parsing the board state returned by chess.js
const PAWN =  'p'
const ROOK = 'r'
const KNIGHT = 'n'
const BISHOP ='b'
const QUEEN = 'q'
const KING = 'k'
//const objects NO LONGER USED
const PAWN_BLACK = { type: 'p', color: 'b' }
const ROOK_BLACK = { type: 'r', color: 'b' }
const KNIGHT_BLACK = { type: 'n', color: 'b' }
const BISHOP_BLACK = { type: 'b', color: 'b' }
const QUEEN_BLACK = { type: 'q', color: 'b' }
const KING_BLACK = { type: 'k', color: 'b' }

//Const arrays for assembling the board state                        
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

//Attack vectors for parsing the Z index of the move from change of the board state
// to get an index for Z axis  use formula Zindex = 112 - 15 * Xmove + Ymove 
// Where Zindex is the Z index you need to find
// Xmove is how many squares in vertical direction piece have moved, up is positive
// Ymove is how many squares in horizontal direction piece have moved, right is positive
const RAYS = [
  // 1,  2,  3,  4,  5,  6,  7,  8,  9, 10, 11, 12, 13, 14, 15,  
    48,  0,  0,  0,  0,  0,  0,  6,  0,  0,  0,  0,  0,  0, 34, //1
     0, 47,  0,  0,  0,  0,  0,  5,  0,  0,  0,  0,  0, 33,  0, //2
     0,  0, 46,  0,  0,  0,  0,  4,  0,  0,  0,  0, 32,  0,  0, //3
     0,  0,  0, 45,  0,  0,  0,  3,  0,  0,  0, 31,  0,  0,  0, //4
     0,  0,  0,  0, 44,  0,  0,  2,  0,  0, 30,  0,  0,  0,  0, //5
     0,  0,  0,  0,  0, 43, 57,  1, 56, 29,  0,  0,  0,  0,  0, //6
     0,  0,  0,  0,  0, 62, 42,  0, 28, 60,  0,  0,  0,  0,  0, //7
    27, 26, 25, 24, 23, 22, 21,  0, 14, 15, 16, 17, 18, 19, 20, //8
     0,  0,  0,  0,  0, 63, 35,  7, 49, 61,  0,  0,  0,  0,  0, //9
     0,  0,  0,  0,  0, 36, 59,  8, 58, 50,  0,  0,  0,  0,  0, //10
     0,  0,  0,  0, 37,  0,  0,  9,  0,  0, 51,  0,  0,  0,  0, //11
     0,  0,  0, 38,  0,  0,  0, 10,  0,  0,  0, 52,  0,  0,  0, //12
     0,  0, 39,  0,  0,  0,  0, 11,  0,  0,  0,  0, 53,  0,  0, //13
     0, 40,  0,  0,  0,  0,  0, 12,  0,  0,  0,  0,  0, 54,  0, //14
    41,  0,  0,  0,  0,  0,  0, 13,  0,  0,  0,  0,  0,  0, 55  //15
 ];
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
// Takes turn on the board
// Automatically processes the colour and position
chessEnv.prototype.TakeTurn = async function(){
    this.stateTensor = AssembleBoardState(this.chess.board())
    this.QTensor = await this.ReplayMemory.GetQValues(this.stateTensor);
    this.ReplayMemory.LogQValues(this.QTensor)
    this.legalMoves = chess.moves({verbose: true})
    this.Qtensor = await ParselegalMoves(this.QTensor, this.legalMoves)


    this.managedToTakeTurn = await this.TakeAction()  
    
    if(!this.managedToTakeTurn){
        await this.PunishFailedMove();
    }else{
        this.ReplayMemory.LogStates(this.stateTensor);
        this.ReplayMemory.LogQValues(this.QTensor);
    }
    
    eventEmitter.emit('end turn');
}

// Chooses the action to take
// plays the optimal action from Q-values with illegal actions set to zero
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

//Checks the state of the game, if cant take turn retunrs false
chessEnv.prototype.CheckGameState = function(){
    if(chess.in_checkmate()){return false}
    if(chess.in_draw()){return false}
    if(chess.in_stalemate()){return false}
    if(chess.insufficient_material()){return false}
    return this.managedToTakeTurn;
}

//Resets Board to default state
chessEnv.prototype.ResetBoard = function(){
    chess.reset();
    this.managedToTakeTurn = true;
}
chessEnv.prototype.PunishFailedMove = async function(){
     

}

//Assembles board state into tensor that can be eaten by Neural Network
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

//Finds Max Q Value in a tensor 
//Only accepts the 4D tensor for the Neural Network
FindMaxQValueIndex = async function(tensor){
    //Makes a reduedTensor that is an 8X8 chessboard matrix with indices of highest values on Z axis 
    //as values
    reducedTensor = tf.argMax(tensor, 3)   
    var index = [[],[],[],[],[],[],[],[]];
    //Makes a matrix of Actual values from Z axis referencing reducedTensor
    //!!!Probably can be modified to avoid a for loop and improve speed!!!
    for(xAxis = 0; xAxis<8; xAxis++){
        for(yAxis = 0; yAxis<8; yAxis++){
            temp = (await reducedTensor.slice([0,xAxis,yAxis],[1,1,1]).data())[0]
            index[xAxis][yAxis] = (await tensor.slice([0,xAxis,yAxis,temp],[1,1,1,1]).data())[0]           
        }
    }
    //finds the index of highest values in rows of matrix made in last step 
    //and reduces matrix to a one dimensional array
    tempIndex = []
    tempVal = []
    for(i=0;i<8;i++){
        tempIndex[i] = indexOfMax(index[i])
        tempVal[i] = index[i][tempIndex[i]];
    }
    //finds the highest values in previously made array
    //and assembles the index of this values as an object
    indexX = indexOfMax(tempVal)
    indexY = tempIndex[indexX]
    indexZ = (await reducedTensor.slice([0,indexX,indexY],[1,1,1]).data())[0]
    return index = {
        X: indexX,
        Y: indexY,
        Z: indexZ,
    }
}

//Finds index of Highest value in an array
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

//parses move from index of Highest legal move in a Neural Network output tensor
//Returns object that can be eaten my move() function in chess.js
ParseMove = function(index){
    var toX = 0;
    var toY = 0;
    var indexZ = index.Z
    var indexX = 8 - index.X // count X from the bottom starting with one
    var from = ''+(8 - index.X)+String.fromCharCode(97 + index.Y);
    if(index.Z<56){
        //All possible queen moves, covers everything except Knight moves and pawn promotions

        if(indexZ<7){//Vertical UP
            toX= indexX + indexZ + 1; //Moves up on board
            toY= index.Y;             //stays same on horizontal
        }else
        if(index.Z<14){//Vertial DOWN
            indexZ = indexZ-7;
            toX= indexX - indexZ - 1; //Moves left on board
            toY= index.Y;             //stays same on horizontal
        }else
        if(index.Z<21){//Horizontal RIGHT
            indexZ = indexZ- 14;
            toX= indexX                //stays same on vertical
            toY= index.Y + indexZ + 1; //Moves right on horiontal
        }else
        if(index.Z<28){//Horizontal LEFT
            indexZ = 21;
            toX= indexX                //stays same on vertical
            toY= index.Y - indexZ - 1; //Moves left on horiontal
        }else
        if(index.Z<35){//Diagonal NE
            indexZ =indexZ- 28;
            toX= indexX + indexZ + 1; //Moves up on vertical
            toY= index.Y + indexZ + 1; //moves right on horizontal
        }else
        if(index.Z<42){//Diagonal SW
            indexZ =indexZ- 35; 
            toX= indexX - indexZ - 1; //Moves down on vertical
            toY= index.Y - indexZ - 1; //moves left on horizontal
        }else
        if(index.Z<49){//Diagonal NW
            indexZ =indexZ- 42;
            toX= indexX + indexZ + 1; //moves up on vertical 
            toY= index.Y - indexZ - 1; //moves left on horizontal
        }else
        if(index.Z<56){// Diagonal SE
            indexZ =indexZ- 49;
            toX= indexX - indexZ - 1; //moves down on vertical
            toY= index.Y + indexZ + 1; //moves right on horiontal
        }
    }else{
        //Covers all possible Knight moves 
        switch(index.Z){
            case 56: //moves 2 up 1 right
                toX = indexX + 2
                toY = index.Y + 1
            case 57: //moves 2 up 1 left
                toX = indexX + 2
                toY = index.Y - 1
            case 58: //moves 2 down 1 right
                toX = indexX - 2
                toY = index.Y + 1
            case 59: //moves 2 down 1 left
                toX = indexX - 2
                toY = index.Y - 1
            case 60: //moves 2 right 1 up
                toX = indexX + 1
                toY = index.Y + 2
            case 61: //moves 2 right 1 down
                toX = indexX - 1
                toY = index.Y + 2
            case 62: //moves 2 left 1 up
                toX = indexX + 1
                toY = index.Y - 2
            case 63: //moves 2 left 1 down
                toX = indexX - 1
                toY = index.Y - 2

            //Covers all Pawn promotions
            //To be made    
            // case 65:
            // case 66:
            // case 67:
            // case 68:
            // case 69:
            // case 70:
            // case 71:
            // case 72:
        }
    }
    var to = ''+toX+String.fromCharCode(97 + toY);
    return {from: from, to: to}
}

//Parses legal moves that are returned by .moves({verbose: true}) function inside the chess.js
//and returns a one hot tensor for the legal moves 
ParselegalMoves = function(tensor, moves){
    movesLength = moves.length
    index = []
    
    //Makes a mast with ones for the legal moves
    maskLegalMoves = tf.buffer([8,8,73]); 
    for(i=0; i<movesLength; i++){
        from = ParsePositionIndex(moves[i].from)
        to = ParsePositionIndex(moves[i].to)
        index[i].X = from.X
        index[i].Y = from.Y
        index[i].Z = 112 - 15 * (to.X - from.X) + (to.Y - from.Y) 
        await maskLegalMoves.set(1, index[i].X, index[i].Y, index[i].Z)
    }
    //Multiplies the Qvalues tensor to 
    returnTensor = await tf.mul(tensor, maskLegalMoves)
    return returnTensor
}

//Parses index of position from a letter/number representation used in chess.js output
//returns array with X as column index and Y as row index
ParsePositionIndex = function(position){
    var index
    var temp
    index.Y = (position.slice(0).charCodeAt(0) - 97);
    temp = position.slice(1)
    index.X = 8 - parseInt(position.slice(1))
    return index
}
module.exports = chessEnv;
