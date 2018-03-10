"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
exports.newSubscriberNotification = functions.firestore
    .document('subscribers/{subscriptionId}')
    .onCreate((event) => __awaiter(this, void 0, void 0, function* () {
    const data = event.data.data();
    const userId = data.userId;
    const subscriber = data.subscriberId;
    // Notification content
    const payload = {
        notification: {
            title: 'New Subscriber',
            body: `${subscriber} is following your content!`,
            icon: 'https://goo.gl/Fz9nrQ'
        }
    };
    // ref to the parent document
    const db = admin.firestore();
    const devicesRef = db.collection('devices').where('userId', '==', userId);
    // get users tokens and send notifications
    const devices = yield devicesRef.get();
    const promises = [];
    devices.forEach(result => {
        const token = result.data().token;
        promises.push(admin.messaging().sendToDevice(token, payload));
    });
    return Promise.all(promises);
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
}));
//# sourceMappingURL=index.js.map