var _ = require('lodash');
var model = require('./models/firstModel');
const tf = require('@tensorflow/tfjs');
var EventEmitter = require('events').EventEmitter;


const REWARD_DECAY_RATE = 0.97;
const MEMORY_LENGTH = 10000

var ReplayMemory =function(colour) {
  this.colour = colour;  
  this.qold = [];

  this.memoryLength = 100;
   
  this.model = model;

  this.runData = {
      rewards: [],
      qValues: [],
      states:  [],
      dates:   [],
      actions: []
    }
  _.bindAll(this);

  this.dates = {
      rewards: [],
      states:  [],
      qValues: []
  }

}



//Logs Q-Values into replay memory
ReplayMemory.prototype.LogQValues = function(QValues){
    var length = this.runData.qValues.length;
    this.runData.qValues[length] = QValues
}

//Logs States into replay memory
ReplayMemory.prototype.LogStates = function(state){
    var length = this.runData.states.length;
    this.runData.states[length] = state;  
}




//Performs backsweep through replay memory and updates rewards and Q-Values
ReplayMemory.prototype.RMBackSweep = function(){
    

}

//Pulls random batch from replay memory
//Size of the batch passed as a variable to function
ReplayMemory.prototype.RandomBatch = function(batchSize){

}

//Runs data through model to get Q values
ReplayMemory.prototype.GetQValues = async function(tensor){
    outputTensor = await this.model.predict(tensor)
    return outputTensor;
}

//Teaches model on data passed to it
ReplayMemory.prototype.TeachModel = function(){
    
}

// does things
ReplayMemory.prototype.Tick = function(){

}

module.exports = ReplayMemory;

FindMax = function(arr){
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