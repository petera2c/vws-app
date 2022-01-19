import { useCallback, useEffect, useRef } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/database";
import { sendEmailVerification } from "firebase/auth";
import db from "./config/firebase";
import { message, Modal } from "antd";

import { setUserOnlineStatus } from "./pages/util";

export const blockUser = async (userID, userIDToBlock) => {
  const sortedUserArray = [userID, userIDToBlock].sort();
  await db
    .collection("block_check")
    .doc(sortedUserArray[0] + "|||" + sortedUserArray[1])
    .set({
      [userID]: true,
    });
  alert("User has been blocked");
  window.location.reload();
};

export const calculateKarma = (usereBasicInfo) => {
  return usereBasicInfo.karma ? usereBasicInfo.karma : 0;
};

export const canUserPost = (userBasicInfo) => {
  if (calculateKarma(userBasicInfo) <= -50) {
    message.error(
      "Your karma is currently " +
        calculateKarma(userBasicInfo) +
        ". This indicates you have not been following our rules and are now forbidden to comment or post."
    );
    return false;
  } else return true;
};

export const displayNameErrors = (displayName) => {
  if (getInvalidCharacters(displayName)) {
    return message.error(
      "These characters are not allowed in your display name. " +
        getInvalidCharacters(displayName)
    );
  } else if (displayName.length > 15)
    return message.error("Display name is too long :'(");
  else return false;
};

// Taken from stack overflow
export const capitolizeWordsInString = (str) => {
  return str.replace(/\b\w/g, (l) => l.toUpperCase());
};
export const capitolizeFirstChar = (string) => {
  if (string) return string.charAt(0).toUpperCase() + string.slice(1);
  else return;
};

export const combineObjectWithID = (id, object) => {
  object.id = id;
  return object;
};

export const getEndAtValueTimestampFirst = (array) => {
  let startAt = 10000000000000;

  if (array && array[0] && array[0].doc) startAt = array[0].doc;
  return startAt;
};

export const getEndAtValueTimestamp = (array) => {
  let startAt = 10000000000000;

  if (array && array[array.length - 1] && array[array.length - 1].doc)
    startAt = array[array.length - 1].doc;
  return startAt;
};

export const getIsUserOnline = (setIsUserOnline, userID) => {
  const ref = firebase.database().ref("status/" + userID);

  ref.on("value", (snapshot) => {
    if (snapshot.val() && snapshot.val().state === "online")
      setIsUserOnline(snapshot.val());
    else setIsUserOnline({ state: false });
  });
};

const getInvalidCharacters = (displayName) => {
  const invalidCharactersArray = displayName.split(
    /[\x30-\x39|\x41-\x5A|\x61-\x7a|\x5F]+/gi
  );
  let invalidCharacters = "";

  for (let index in invalidCharactersArray) {
    invalidCharacters += invalidCharactersArray[index];
  }
  return invalidCharacters;
};

export const getTotalOnlineUsers = (callback) => {
  const ref = firebase.database().ref("total_online_users");

  ref.on("value", (doc) => {
    callback(doc.val());
  });

  return ref;
};

export const getUserBasicInfo = async (callback, userID) => {
  if (!userID) return {};

  const authorDoc = await db.collection("users_display_name").doc(userID).get();

  callback(authorDoc.exists ? { ...authorDoc.data(), id: authorDoc.id } : {});
};

export const hasUserBlockedUser = async (userID, userID2, callback) => {
  const sortedUserArray = [userID, userID2].sort();
  const blockCheck = await db
    .collection("block_check")
    .doc(sortedUserArray[0] + "|||" + sortedUserArray[1])
    .get();

  if (blockCheck.exists) return callback(true);
  else return callback(false);
};

export const isMobileOrTablet = () => window.screen.width < 940;

export const isPageActive = (page, pathname) => {
  if (page === pathname) return " active ";
  else return "";
};

export const signOut = async (userID) => {
  await setUserOnlineStatus("offline", userID);

  firebase
    .auth()
    .signOut()
    .then(() => {
      window.location.reload();
    });
};

export const soundNotify = (sound = "bing") => {
  let audio = new Audio("/static/" + sound + ".mp3");

  audio.play();
};

export const useIsMounted = () => {
  const isMountedRef = useRef(true);
  const isMounted = useCallback(() => isMountedRef.current, []);

  useEffect(() => {
    return () => void (isMountedRef.current = false);
  }, []);

  return isMounted;
};

export const userSignUpProgress = (user, noAlert) => {
  if (!user) {
    return "NSI";
  } else if (!user.emailVerified) {
    if (!noAlert) {
      sendEmailVerification(user)
        .then(() => {
          Modal.info({
            title: "Verify Email",
            centered: true,
            content: "We have re-sent you a verification email :)",
          });
        })
        .catch((err) => {
          Modal.error({
            title: "Verify Email",
            content: err,
          });
        });
    }
    return "NVE";
  } else return false;
};
