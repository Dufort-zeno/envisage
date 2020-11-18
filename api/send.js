const webpush = require('web-push') //requiring the web-push module
require('dotenv').config()

const vapidKeys = {
  publicKey:
    process.env.PUBKEY,
  privateKey: process.env.PRIVKEY,
}
webpush.setVapidDetails(
  'mailto:anunay.j1@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)//function to send the notification to the subscribed device\
let subscription = {
  endpoint: '',
  keys: {
    auth: '',
    p256dh: ''
  },
  location: { latitude: 0, longitude: 0 }
}
let response = webpush.sendNotification(subscription, JSON.stringify(
  {title:"Also a Test notification :P",
  options:{
    data:{
      url:"https://youtu.be/dQw4w9WgXcQ"
    }
  }
}))
response.then(e => console.log(e))