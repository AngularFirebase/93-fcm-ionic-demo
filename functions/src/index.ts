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

    const promises = []
    
    devices.forEach(result => {
        const token = result.data().token;

       promises.push( admin.messaging().sendToDevice(token, payload) )
    })

    return Promise.all(promises)


    // return devicesRef.get()






    //     .then(snapshot => snapshot.data() )
    //     .then(user => {
            
    //         const tokens = user.fcmTokens ? Object.keys(user.fcmTokens) : []

    //         if (!tokens.length) {
    //            throw new Error('User does not have any tokens!')
    //         }

    //         return admin.messaging().sendToDevice(tokens, payload)
    //     })
    //     .catch(err => console.log(err) )
});