import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../config/db_init";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { message } from "antd";

import { getEndAtValueTimestamp } from "../../util";

dayjs.extend(utc);

export const deleteQuote = async (
  quoteID,
  setCanUserCreateQuote,
  setQuoteID,
  setQuotes
) => {
  await deleteDoc(doc(db, "quotes", quoteID));

  if (setQuotes)
    setQuotes((quotes) => {
      quotes.splice(
        quotes.findIndex((comment) => comment.id === quoteID),
        1
      );
      return [...quotes];
    });
  setCanUserCreateQuote(true);
  setQuoteID(null);
  message.success("Quote deleted!");
};

export const getCanUserCreateQuote = async (
  isMounted,
  setCanUserCreateQuote,
  userID
) => {
  const todaysFormattedDate = new dayjs(Timestamp.now().toMillis())
    .utcOffset(0)
    .format("MM-DD-YYYY");

  const userQuotesTodaySnapshot = await getDocs(
    query(
      collection(db, "quotes"),
      where("formatted_date", "==", todaysFormattedDate),
      where("userID", "==", userID),
      limit(1)
    )
  );

  if (
    userQuotesTodaySnapshot.docs &&
    userQuotesTodaySnapshot.docs.length > 0 &&
    isMounted()
  )
    setCanUserCreateQuote(false);
  else if (isMounted()) setCanUserCreateQuote(true);
};

export const getHasUserLikedQuote = async (quoteID, setHasLiked, userID) => {
  const quoteHasLikedDoc = await getDoc(
    doc(db, "quote_likes", quoteID + "|||" + userID)
  );

  if (!quoteHasLikedDoc.exists()) return;
  let value = quoteHasLikedDoc.data();
  if (value) value = value.liked;

  setHasLiked(Boolean(value));
};

export const getQuotes = async (
  isMounted,
  quotes,
  setCanLoadMoreQuotes,
  setQuotes
) => {
  let startAt = getEndAtValueTimestamp(quotes);
  const todaysFormattedDate = new dayjs().utcOffset(0).format("MM-DD-YYYY");

  const quotesSnapshot = await getDocs(
    query(
      collection(db, "quotes"),
      where("formatted_date", "==", todaysFormattedDate),
      orderBy("like_counter", "desc"),
      startAfter(startAt),
      limit(10)
    )
  );

  if (!isMounted()) return;

  let newQuotes = [];

  if (quotesSnapshot.docs && quotesSnapshot.docs.length > 0) {
    for (let index in quotesSnapshot.docs) {
      const quoteDoc = quotesSnapshot.docs[index];
      newQuotes.push({
        id: quoteDoc.id,
        doc: quoteDoc,
        ...quoteDoc.data(),
      });
    }

    if (newQuotes.length < 10) setCanLoadMoreQuotes(false);
    if (quotes) {
      return setQuotes((oldQuotes) => {
        if (oldQuotes) return [...oldQuotes, ...newQuotes];
        else return newQuotes;
      });
    } else return setQuotes(newQuotes);
  } else setCanLoadMoreQuotes(false);
};

export const likeOrUnlikeQuote = (hasLiked, quote, user) => {
  if (!user)
    return message.info(
      "You must sign in or register an account to support a comment!"
    );

  setDoc(doc(db, "quote_likes", quote.id + "|||" + user.uid), {
    liked: !hasLiked,
    quoteID: quote.id,
    userID: user.uid,
  });
};

export const reportQuote = (option, quoteID, userID) => {
  setDoc(doc(db, "quote_reports", quoteID + "|||" + userID), {
    option,
    quoteID,
    userID,
  });

  message.success("Report successful :)");
};

export const saveQuote = async (
  canUserCreateQuote,
  isMounted,
  quote,
  quoteID,
  setCanUserCreateQuote,
  setMyQuote,
  setQuotes,
  userID
) => {
  if (quote.length > 150)
    return message.error(
      "Your quote has too many characters. There is a max of 150 characters."
    );
  if (quoteID) {
    await updateDoc(doc(db, "quotes", quoteID), { userID, value: quote });

    if (isMounted()) {
      setQuotes((oldQuotes) => {
        const quoteIndex = oldQuotes.findIndex((quote) => quote.id === quoteID);
        oldQuotes[quoteIndex].value = quote;
        return [...oldQuotes];
      });
      setMyQuote("");
    }
    message.success("Updated successfully! :)");
  } else if (canUserCreateQuote) {
    const newQuote = await addDoc(collection(db, "quotes"), {
      userID,
      value: quote,
    });

    const newQuoteDoc = await getDoc(newQuote);

    message.success("Quote saved!");

    if (isMounted()) {
      setQuotes((oldQuotes) => [
        { id: newQuote.id, doc: newQuoteDoc, ...newQuoteDoc.data() },
        ...oldQuotes,
      ]);
      setCanUserCreateQuote(false);
      setMyQuote("");
    }
  } else {
    message.error("You can only create one quote per day");
  }
};
