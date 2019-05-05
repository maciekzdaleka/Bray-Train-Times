/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
var parseString = require('xml2js').parseString;
var today = new Date();

const GetRemoteDataHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest'
      || (handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'GetRemoteDataIntent');
  },
  async handle(handlerInput) {
    let outputSpeech = 'This is the default message.';
    await getRemoteData('http://api.irishrail.ie/realtime/realtime.asmx/getStationDataByNameXML?StationDesc=BRAY')
      .then((response) => {

       parseString(response, function (err, result) {
        const data  = JSON.stringify(result);
        const data1 = JSON.parse(data);
        var currenTime = today.getHours() + 1 + ":" + today.getMinutes();
        var minutes;
        if(data1.ArrayOfObjStationData.objStationData.length === 0  ){
          outputSpeech = `Sorry, There are currently no trains departuring from Bray,`;
        }
        else if (data1.ArrayOfObjStationData.objStationData.length >= 3  ){
            outputSpeech = `Next three trains from Bray, `;
            var amorpm = 'am';
            for (let i = 0; i < 3; i++) {
                if (i === 0) {
                //first record
                if (parseInt(data1.ArrayOfObjStationData.objStationData[i].Expdepart) > 12){
                  amorpm = 'pm';
                }
                else{
                  amorpm = 'am';
                
                }
                minutes = parseTime(data1.ArrayOfObjStationData.objStationData[i].Expdepart) - parseTime(currenTime);
                outputSpeech = outputSpeech + 'First train leaves in ' + minutes + ' minutes at ' + data1.ArrayOfObjStationData.objStationData[i].Expdepart + ' ' + amorpm + 
                ' direction ' + data1.ArrayOfObjStationData.objStationData[i].Destination + ', '
              } 
              else if (i === 1) {
                if (parseInt(data1.ArrayOfObjStationData.objStationData[i].Expdepart) > 12){
                amorpm = 'pm';
                }
                else{
                amorpm = 'am';
                }
                minutes = parseTime(data1.ArrayOfObjStationData.objStationData[i].Expdepart) - parseTime(currenTime);
                outputSpeech = outputSpeech + 'Second train leaves in ' + minutes + ' minutes at ' + data1.ArrayOfObjStationData.objStationData[i].Expdepart + ' ' + amorpm + 
                ' direction '+ data1.ArrayOfObjStationData.objStationData[i].Destination + ', '
              }
              else if (i === 2) {
                //last record
                if (parseInt(data1.ArrayOfObjStationData.objStationData[i].Expdepart) > 12){
                  amorpm = 'pm';
                }
                else{
                  amorpm = 'am';
                }
                minutes = parseTime(data1.ArrayOfObjStationData.objStationData[i].Expdepart) - parseTime(currenTime);
                outputSpeech = outputSpeech + 'and third train leaves in ' + minutes + ' minutes at ' + data1.ArrayOfObjStationData.objStationData[i].Expdepart + ' ' + amorpm + 
                ' direction '+ data1.ArrayOfObjStationData.objStationData[i].Destination
              } else {
              // middle record(s)
              outputSpeech = outputSpeech =  'No Data,'
              }  
        }
      }
      else if (data1.ArrayOfObjStationData.objStationData.length < 3  ){
        var train_amount = parseInt(data1.ArrayOfObjStationData.objStationData.length);
        if(train_amount > 1){
          outputSpeech = `Next ${data1.ArrayOfObjStationData.objStationData.length} trains from Bray,`;
        }
        else
        {
          outputSpeech = `Warning, Last train,`;
        }
        var amorpm = 'am';
        for (let i = 0; i < data1.ArrayOfObjStationData.objStationData.length; i++) {
            if (i === 0 && train_amount > 1) {
            //first record
            if (parseInt(data1.ArrayOfObjStationData.objStationData[i].Expdepart) > 12){
              amorpm = 'pm';
            }
            else{
              amorpm = 'am';
            }
            minutes = parseTime(data1.ArrayOfObjStationData.objStationData[i].Expdepart) - parseTime(currenTime);
            outputSpeech = outputSpeech + 'First train leaves in ' + minutes + ' minutes at ' + data1.ArrayOfObjStationData.objStationData[i].Expdepart + ' ' + amorpm 
            ' direction '+ data1.ArrayOfObjStationData.objStationData[i].Destination + ', '
          } 
          else if (i === train_amount ) {
            if (parseInt(data1.ArrayOfObjStationData.objStationData[i].Expdepart) > 12){
            amorpm = 'pm';
            }
            else{
            amorpm = 'am';
            }
            minutes = parseTime(data1.ArrayOfObjStationData.objStationData[i].Expdepart) - parseTime(currenTime);
            outputSpeech = outputSpeech + 'Last train leaves Bray in ' + minutes + ' minutes at ' + data1.ArrayOfObjStationData.objStationData[i].Expdepart + ' ' + amorpm +
            ' direction '+ data1.ArrayOfObjStationData.objStationData[i].Destination 
          }
          else {
          // middle record(s)
            minutes = parseTime(data1.ArrayOfObjStationData.objStationData[i].Expdepart) - parseTime(currenTime);
            outputSpeech = outputSpeech + 'next train leaves in ' + minutes + ' minutes at ' + data1.ArrayOfObjStationData.objStationData[i].Expdepart + ' ' + amorpm +
            ' direction '+ data1.ArrayOfObjStationData.objStationData[i].Destination + ', '
          }  
    }
  }
        });
      })
      .catch((err) => {
        outputSpeech = 'Error' + err;
        //set an optional error message here
        //outputSpeech = err.message;
      });

    return handlerInput.responseBuilder
      .speak(outputSpeech)
      .getResponse();

  },
};

function parseTime(s) {
  var splitstring = s + '';
  var c = splitstring.split(':');
  return parseInt(c[0]) * 60 + parseInt(c[1]);
}

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can introduce yourself by telling me your name';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const getRemoteData = function (url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? require('https') : require('http');
    const request = client.get(url, (response) => {
      if (response.statusCode < 200 || response.statusCode > 299) {
        reject(new Error('Failed with status code: ' + response.statusCode));
      }
      const body = [];
      response.on('data', (chunk) => body.push(chunk));
      response.on('end', () => resolve(body.join('')));
    });
    request.on('error', (err) => reject(err))
  })
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetRemoteDataHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

