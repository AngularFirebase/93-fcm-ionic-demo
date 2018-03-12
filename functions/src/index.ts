import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';
admin.initializeApp(functions.config().firebase);


exports.newSubscriberNotification = functions.firestore
    .document('subscribers/{subscriptionId}')
    .onCreate(async event => {
        
    const data = event.data.data();

    const userId = data.userId
    const subscriber = data.subscriberId

    // Notification content
    const payload = {
        notification: {
            title: 'New Subscriber',
            body: `${subscriber} is following your content!`,
            icon: 'https://goo.gl/Fz9nrQ'
        }
    }

    // ref to the parent document
    const db = admin.firestore()
    const devicesRef = db.collection('devices').where('userId', '==', userId)


    // get users tokens and send notifications

    const devices = await devicesRef.get()

    const tokens = []
    
    devices.forEach(result => {
        const token = result.data().token;

       tokens.push( token )
    })

    return admin.messaging().sendToDevice(tokens, payload)

});