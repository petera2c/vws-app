import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/db_init";
import { getEndAtValueTimestamp, soundNotify } from "../../util";

export const conversationsListener = (navigate, userID) => {
  const unsubscribe = onSnapshot(
    query(
      collection(db, "conversations"),
      where("members", "array-contains", userID),
      orderBy("last_updated", "desc"),
      limit(1)
    ),
    (snapshot) => {
      if (snapshot.docs && snapshot.docs[0]) {
        const doc = snapshot.docs[0];
        if (doc.data().go_to_inbox) navigate("/chat?" + doc.id);
      }
    }
  );

  return unsubscribe;
};

export const getMobileOperatingSystem = () => {
  var userAgent = navigator.userAgent || navigator.vendor || window.opera;

  // Windows Phone must come first because its UA also contains "Android"
  if (/windows phone/i.test(userAgent)) {
    return "android";
  }

  if (/android/i.test(userAgent)) {
    return "android";
  }

  // iOS detection from: http://stackoverflow.com/a/9039885/177710
  if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
    return "ios";
  }

  return "unknown";
};

export const getNotifications = async (
  isMounted,
  notifications,
  setCanShowLoadMore,
  setNotificationCounter,
  setNotifications,
  user
) => {
  let startAt = getEndAtValueTimestamp(notifications);

  const snapshot = await getDocs(
    query(
      collection(db, "notifications"),
      where("userID", "==", user.uid),
      orderBy("server_timestamp", "desc"),
      startAfter(startAt),
      limit(10)
    )
  );
  if (!isMounted) return;

  let newNotifications = [];

  let notificationCounter = 0;
  for (let index in snapshot.docs) {
    if (!snapshot.docs[index].data().hasSeen) notificationCounter++;

    newNotifications.push({
      id: snapshot.docs[index].id,
      ...snapshot.docs[index].data(),
      doc: snapshot.docs[index],
    });
  }
  if (setNotificationCounter) setNotificationCounter(notificationCounter);

  if (newNotifications.length < 10 && setCanShowLoadMore)
    setCanShowLoadMore(false);

  setNotifications((oldNotifications) => {
    if (
      oldNotifications &&
      oldNotifications.length > 0 &&
      notifications &&
      notifications.length > 0
    )
      return [...oldNotifications, ...newNotifications];
    else return newNotifications;
  });
};

export const newNotificationsListener = (
  isMounted,
  setNotificationCounter,
  setNotifications,
  user,
  first = true
) => {
  const unsubscribe = onSnapshot(
    query(
      collection(db, "notifications"),
      where("userID", "==", user.uid),
      orderBy("server_timestamp", "desc"),
      limit(1)
    ),
    (snapshot) => {
      if (first) {
        first = false;
      } else if (
        snapshot.docs &&
        snapshot.docs[0] &&
        !snapshot.docs[0].data().hasSeen &&
        isMounted()
      ) {
        if (setNotificationCounter)
          setNotificationCounter((oldAmount) => {
            oldAmount++;
            return oldAmount;
          });

        setNotifications((oldNotifications) => [
          {
            id: snapshot.docs[0].id,
            ...snapshot.docs[0].data(),
            doc: snapshot.docs[0],
          },
          ...oldNotifications,
        ]);

        soundNotify();
      }
    }
  );
  return unsubscribe;
};

export const getUnreadConversations = (
  isMounted,
  isOnSearchPage,
  pathname,
  setUnreadConversations,
  userID,
  first = true
) => {
  const unsubscribe = onSnapshot(
    doc(db, "unread_conversations_count", userID),
    (doc) => {
      if (doc.data() && doc.data().count) {
        if (!first && !isOnSearchPage) soundNotify();
        if (pathname === "/chat" && doc.data().count > 0) {
          return resetUnreadConversationCount(
            isMounted,
            setUnreadConversations,
            userID
          );
        }

        if (isMounted()) setUnreadConversations(doc.data().count);
      } else {
        if (isMounted()) setUnreadConversations(0);
      }
      first = false;
    }
  );

  return unsubscribe;
};

export const howCompleteIsUserProfile = (
  setMissingAccountPercentage,
  userBasicInfo
) => {
  let percentage = 0;

  if (userBasicInfo.gender) percentage += 0.125;
  if (userBasicInfo.pronouns) percentage += 0.125;
  if (userBasicInfo.birth_date) percentage += 0.125;
  if (userBasicInfo.partying) percentage += 0.125;
  if (userBasicInfo.politicalBeliefs) percentage += 0.125;
  if (userBasicInfo.education) percentage += 0.125;
  if (userBasicInfo.kids) percentage += 0.125;
  if (userBasicInfo.avatar) percentage += 0.125;

  setMissingAccountPercentage(percentage);
};

export const isUserInQueueListener = (isMounted, setIsUserInQueue, userID) => {
  const unsubscribe = onSnapshot(doc(db, "chat_queue", userID), (doc) => {
    if (doc.data() && doc.data().userID === userID && isMounted())
      setIsUserInQueue(true);
    else if (isMounted()) setIsUserInQueue(false);
  });

  return unsubscribe;
};

export const leaveQueue = async (userID) => {
  await deleteDoc(doc(db, "chat_queue", userID));
};

export const readNotifications = (notifications, setNotificationCounter) => {
  for (let index in notifications) {
    const notification = notifications[index];
    if (!notification.hasSeen) {
      updateDoc(doc(db, "notifications", notification.id), {
        hasSeen: true,
      });
    }
  }
  if (setNotificationCounter) setNotificationCounter(0);
};

export const resetUnreadConversationCount = (
  isMounted,
  setUnreadConversationsCount,
  userID
) => {
  if (isMounted())
    setDoc(doc(db, "unread_conversations_count", userID), { count: 0 });
  if (isMounted()) setUnreadConversationsCount(0);
};
