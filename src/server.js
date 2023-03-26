import http from 'http'
import mqtt from 'mqtt';
import mongo from './utils/mongo.js';
import newModel from './model/news.model.js'
import dataModel from './model/data.model.js'

mongo()
  .then(() => console.log('Connect'))
  .catch((err) => console.log(err))

const topic="W/+/+/+/info"
const topicData="W/+/+/+/data"

const options = {
  clean: true,
  connectTimeout: 4000,
  host: '185.196.214.190',
  port: 1883,
  username: 'emqx',
  password: '12345',
};

const client = mqtt.connect(options);

// !INFO ----------------------------------------------
client.on('connect', () => {
  client.subscribe(topic)
  console.log('Client has subscribed successfully');
})

client.on('error', (error) => {
  console.log('Connection failed:', error);
});

client.on('message', async(topic, message) => {
  console.log(JSON.parse(message.toString()));
  const id = message.toString().slice(6, 21)
  const foundMessage = await newModel.findOne({id: id})
  .catch(err => console.log(err))

  if(foundMessage){
    await newModel.findOneAndUpdate({id:id}, {id: id, receive_message: message.toString()})
  }else {
    const newMessage = new newModel({id: id, receive_message: message.toString()})
    await newMessage.save()
  .catch(err => console.log(err))
  }
});
// ! DATA ----------------------------------
// client.on('connect', () => {
//   client.subscribe(topicData)
//   console.log('Client has subscribed successfully');
// })

// client.on('error', (error) => {
//   console.log('Connection failed:', error);
// });

// client.on('message', async(topicData, message) => {
//   const id = message.toString().slice(6, 21)
//   const existingInfo = await newModel.findOne({id: id})
//   .catch(err => console.log(err))

//   if(existingInfo){
//     const existingData = await dataModel.findOne({id: id})
//     .catch(err => console.log(err))

//     if(existingData){
//       await dataModel.findOneAndUpdate({id: id}, {id:id, data_message: message.toString()})
//       return
//     }

//     const newData = new dataModel({id: id, data_message: message.toString()})
//     await newData.save()
//     .catch(err => console.log(err))
//   }

//   console.log('Received data:' + message.toString());
// })

http.createServer(async (request, response) => {
  if(request.method == 'GET'){
    const url = request.url.split('/')[1]

    if(url == 'list'){
      return response.end(JSON.stringify(await newModel.find()))
    }

    if(url == 'data'){
      return response.end(JSON.stringify(await dataModel.find()))
    }
  }
})
.listen(9090, console.log(9090))