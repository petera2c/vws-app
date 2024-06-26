import React, { useContext, useEffect, useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../config/db_init";
import { useDocument } from "react-firebase-hooks/firestore";
import { Button, message } from "antd";

import { faTimes } from "@fortawesome/pro-solid-svg-icons/faTimes";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../../components/containers/Container";
import LoadingHeart from "../../components/views/loaders/Heart";
import Page from "../../components/containers/Page";
import SubscribeColumn from "../../components/SubscribeColumn";

import { UserContext } from "../../context";
import {
  getIsMobileOrTablet,
  getUserBasicInfo,
  useIsMounted,
} from "../../util";
import { getBlockedUsers, unblockUser } from "./util";

function SettingsSection() {
  const { user } = useContext(UserContext);
  const isMounted = useIsMounted();

  const [blockedUsers, setBlockedUsers] = useState([]);
  const [canLoadMore, setCanLoadMore] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState();

  const settingsRef = doc(db, "users_settings", user.uid);
  const [settingsSnapshot] = useDocument(settingsRef, {
    idField: "id",
  });

  const handleChange = async (name, checked, notify = true) => {
    await updateDoc(settingsRef, { [name]: checked });
    if (notify) message.success("Setting updated!");
  };

  useEffect(() => {
    if (isMounted()) setIsMobileOrTablet(getIsMobileOrTablet());
  }, [isMounted]);

  if (!settingsSnapshot || !settingsSnapshot.data())
    return (
      <Container
        className={
          "align-center container column px16 " +
          (isMobileOrTablet ? "mobile-full" : "large")
        }
      >
        <LoadingHeart />
      </Container>
    );

  return (
    <Page className="pa16">
      <Container>
        <Container className="column flex-fill bg-white br8 gap16 mb2 pa16">
          <Container className="column">
            <h6 className="blue bold">Master Notifications</h6>
            <Setting
              description="Recieve a notification I post a new vent"
              handleChange={handleChange}
              setAll
              setting="vent_new"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Recieve a notification when my vent recieves a new comment"
              handleChange={handleChange}
              setAll
              setting="vent_commented"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Recieve a notification when my vent recieves a new like"
              handleChange={handleChange}
              setAll
              setting="vent_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Recieve a notification when someone tags me in a vent or comment"
              handleChange={handleChange}
              setAll
              setting="comment_tagged"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Recieve a notification when my comment recieves a new like"
              handleChange={handleChange}
              setAll
              setting="comment_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Recieve a notification when my quote recieves a new like"
              handleChange={handleChange}
              setAll
              setting="quote_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Recieve a notification when a user signs up using my unique link"
              handleChange={handleChange}
              setAll
              setting="link_sign_up"
              settingsSnapshot={settingsSnapshot}
            />
          </Container>

          <Container className="column pl32">
            <h6 className="blue bold">Email Notifications</h6>
            <Setting
              description="Email me when I post a new vent"
              handleChange={handleChange}
              setting="email_vent_new"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Email me when my vent recieves a new comment"
              handleChange={handleChange}
              setting="email_vent_commented"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Email me when my vent recieves a new like"
              handleChange={handleChange}
              setting="email_vent_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Email me when someone tags me in a vent or comment"
              handleChange={handleChange}
              setting="email_comment_tagged"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Email me when my comment recieves a new like"
              handleChange={handleChange}
              setting="email_comment_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Email me when my quote recieves a new like"
              handleChange={handleChange}
              setting="email_quote_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Email me when a user signs up using my link"
              handleChange={handleChange}
              setting="email_link_sign_up"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Receive periodic emails on important issues"
              handleChange={handleChange}
              setting="email_promotions"
              settingsSnapshot={settingsSnapshot}
            />
          </Container>

          <Container className="column pl32">
            <h6 className="blue bold">Mobile Push Notifications</h6>
            <Setting
              description="Send a notification to my phone when I post a new vent"
              handleChange={handleChange}
              setting="mobile_vent_new"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Send a notification to my phone when my vent recieves a new comment"
              handleChange={handleChange}
              setting="mobile_vent_commented"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Send a notification to my phone when my vent recieves a new like"
              handleChange={handleChange}
              setting="mobile_vent_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Send a notification to my phone when someone tags me in a vent or comment"
              handleChange={handleChange}
              setting="mobile_comment_tagged"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Send a notification to my phone when my comment recieves a new like"
              handleChange={handleChange}
              setting="mobile_comment_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Send a notification to my phone when my quote recieves a new like"
              handleChange={handleChange}
              setting="mobile_quote_like"
              settingsSnapshot={settingsSnapshot}
            />
            <Setting
              description="Send a notification when a user signs up using my link"
              handleChange={handleChange}
              setting="mobile_link_sign_up"
              settingsSnapshot={settingsSnapshot}
            />
          </Container>
          <h6 className="blue bold">Privacy and Content Preferences</h6>

          <Container className="column align-start gap16">
            <button
              className="button-4"
              onClick={() => {
                if (blockedUsers && blockedUsers.length > 0) {
                  setBlockedUsers([]);
                  setCanLoadMore(false);
                } else
                  getBlockedUsers(
                    [],
                    isMounted,
                    setBlockedUsers,
                    setCanLoadMore,
                    user.uid
                  );
              }}
            >
              Blocked Users
            </button>

            {blockedUsers.map((blockedUserID) => (
              <UserDisplay
                blockedUserID={blockedUserID}
                key={blockedUserID}
                setBlockedUsers={setBlockedUsers}
                userID={user.uid}
              />
            ))}
            {canLoadMore && (
              <Button
                onClick={() => {
                  getBlockedUsers(
                    blockedUsers,
                    isMounted,
                    setBlockedUsers,
                    setCanLoadMore,
                    user.uid
                  );
                }}
                size="large"
                type="primary"
              >
                Load More
              </Button>
            )}
          </Container>

          <p className="">
            Your private information will never be shared with anyone. Ever.
          </p>
        </Container>
        <SubscribeColumn slot="1120703532" />
      </Container>
    </Page>
  );
}

function UserDisplay({ blockedUserID, setBlockedUsers, userID }) {
  const isMounted = useIsMounted();
  const [userBasicInfo, setUserBasicInfo] = useState({});

  useEffect(() => {
    getUserBasicInfo((userBasicInfo) => {
      if (isMounted()) setUserBasicInfo(userBasicInfo);
    }, blockedUserID);
  }, [blockedUserID, isMounted]);

  return (
    <button
      className="button-2 fs-18 br4 gap8 pa8"
      onClick={() => unblockUser(blockedUserID, setBlockedUsers, userID)}
    >
      {userBasicInfo.displayName}
      <FontAwesomeIcon icon={faTimes} />
    </button>
  );
}

function Setting({
  description,
  handleChange,
  setAll,
  settingsSnapshot,
  setting,
}) {
  const master = "master_" + setting;
  const mobile = "mobile_" + setting;
  const email = "email_" + setting;

  let main = master;
  if (!setAll) main = setting;

  return (
    <Container
      className="clickable align-center"
      onClick={() => {
        if (setAll) {
          handleChange(master, !settingsSnapshot.data()[master]);
          handleChange(email, !settingsSnapshot.data()[master], false);
          handleChange(mobile, !settingsSnapshot.data()[master], false);
        } else handleChange(main, !settingsSnapshot.data()[main]);
      }}
    >
      <input
        className="mr8"
        checked={settingsSnapshot.data()[main]}
        style={{ minWidth: "13px" }}
        type="checkbox"
      />

      <p className="">{description}</p>
    </Container>
  );
}

export default SettingsSection;
