const admin = require("firebase-admin");
const { createNotification } = require("./notification");
const { createVentLink } = require("./util");

const newVentListener = (doc, context) => {
  const vent = { id: doc.id, ...doc.data() };

  return createNotification(
    createVentLink(vent),
    "Your new vent is live!",
    vent.userID
  );
};

const newVentLikeListener = async (change, context) => {
  const { ventIDuserID } = context.params;
  const ventIDuserIDArray = ventIDuserID.split("|||");

  const ventDoc = await admin
    .firestore()
    .collection("vents")
    .doc(ventIDuserIDArray[0])
    .get();
  const vent = { id: ventDoc.id, ...ventDoc.data() };

  const hasLiked = change.after.data() ? change.after.data().liked : false;
  let increment = 1;
  if (!hasLiked) increment = -1;

  await admin
    .firestore()
    .collection("vents")
    .doc(ventIDuserIDArray[0])
    .update({
      like_counter: admin.firestore.FieldValue.increment(increment),
    });

  createNotification(
    createVentLink(vent),
    "Someone has supported your vent!",
    vent.userID
  );
};

const ventDeleteListener = async (doc, context) => {
  const ventID = doc.id;
  const commentsOfVentSnapshot = await admin
    .firestore()
    .collection("comments")
    .where("ventID", "==", ventID)
    .get();

  if (commentsOfVentSnapshot.docs) {
    for (let index in commentsOfVentSnapshot.docs) {
      admin
        .firestore()
        .collection("comments")
        .doc(commentsOfVentSnapshot.docs[index].id)
        .delete();
    }
  }

  const ventLikesSnapshot = await admin
    .firestore()
    .collection("vent_likes")
    .where("ventID", "==", ventID)
    .get();

  if (ventLikesSnapshot.docs)
    for (let index in ventLikesSnapshot.docs) {
      admin
        .firestore()
        .collection("vent_likes")
        .doc(ventLikesSnapshot.docs[index].id)
        .delete();
    }
};

module.exports = { newVentLikeListener, newVentListener, ventDeleteListener };
