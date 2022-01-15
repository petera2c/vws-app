import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { sendEmailVerification } from "firebase/auth";

import { faAnalytics } from "@fortawesome/pro-duotone-svg-icons/faAnalytics";
import { faBell } from "@fortawesome/pro-duotone-svg-icons/faBell";
import { faChevronDown } from "@fortawesome/pro-solid-svg-icons/faChevronDown";
import { faComments } from "@fortawesome/pro-duotone-svg-icons/faComments";
import { faConciergeBell } from "@fortawesome/pro-duotone-svg-icons/faConciergeBell";
import { faSearch } from "@fortawesome/pro-solid-svg-icons/faSearch";
import { faUsers } from "@fortawesome/pro-duotone-svg-icons/faUsers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../containers/Container";
import HandleOutsideClick from "../containers/HandleOutsideClick";
import MakeAvatar from "../MakeAvatar";
import NotificationList from "../NotificationList";
import StarterModal from "../modals/Starter";

import { UserContext } from "../../context";

import { capitolizeFirstChar, isPageActive, useIsMounted } from "../../util";
import {
  getNotifications,
  getUnreadConversations,
  newNotificationCounter,
  readNotifications,
  resetUnreadConversationCount,
} from "./util";

function Header() {
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const location = useLocation();
  const { pathname, search } = location;

  const { user, userBasicInfo } = useContext(UserContext);

  const [activeModal, setActiveModal] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(
    false
  );
  const [unreadConversationsCount, setUnreadConversationsCount] = useState();

  const [ventSearchString, setVentSearchString] = useState(
    pathname.substring(0, 7) === "/search"
      ? search.substring(1, search.length)
      : ""
  );
  useEffect(() => {
    let newNotificationsListenerUnsubscribe;
    let newConversationsListenerUnsubscribe;

    if (user) {
      newConversationsListenerUnsubscribe = getUnreadConversations(
        isMounted,
        pathname.substring(0, 7) === "/search",
        setUnreadConversationsCount,
        user.uid
      );

      newNotificationsListenerUnsubscribe = getNotifications(
        isMounted,
        setNotifications,
        user
      );
    }

    return () => {
      if (newNotificationsListenerUnsubscribe)
        newNotificationsListenerUnsubscribe();
      if (newConversationsListenerUnsubscribe)
        newConversationsListenerUnsubscribe();
    };
  }, [isMounted, pathname, user]);

  if (pathname === "/conversations" && user && unreadConversationsCount > 0)
    resetUnreadConversationCount(user.uid);

  return (
    <Container className="column x-fill">
      <Container className="column x-fill justify-center bg-white border-top large active">
        <Container className="x-fill align-center">
          <Container
            className="full-center"
            style={{ width: "calc(12.5vw - 24px)" }}
          >
            <img
              alt=""
              className="clickable"
              onClick={() => navigate("/")}
              src="/svgs/icon.svg"
              style={{ height: "50px" }}
            />
          </Container>

          <Container className="flex-fill align-center wrap">
            <Link
              className={
                "full-center flex button-3 mr32 " +
                isPageActive("/trending", pathname.substring(0, 9)) +
                isPageActive("/", pathname)
              }
              to="/trending"
            >
              <FontAwesomeIcon className="mr8" icon={faAnalytics} />
              <p className="py16">Trending</p>
            </Link>
            <Link
              className={
                "full-center flex button-3 mr32 " +
                isPageActive("/recent", pathname.substring(0, 7))
              }
              to="/recent"
            >
              <FontAwesomeIcon className="mr8" icon={faConciergeBell} />
              <p className="py16">Recent</p>
            </Link>
            <Link
              className={
                "full-center flex button-3 mr32 " +
                isPageActive("/conversations", pathname.substring(0, 14))
              }
              to="/conversations"
            >
              <FontAwesomeIcon className="mr8" icon={faComments} />
              <p className="py16">Inbox</p>

              {Boolean(unreadConversationsCount) && (
                <p className="fs-14 bg-red white round ml4 pa4 br4">
                  {unreadConversationsCount}
                </p>
              )}
            </Link>
            <Link
              className={
                "full-center flex button-3 mr32  " +
                isPageActive("/make-friends", pathname.substring(0, 13))
              }
              to="/make-friends"
            >
              <FontAwesomeIcon className="mr8" icon={faUsers} />
              <p className="py16">Make Friends</p>
            </Link>
            <Container className="full-center bg-grey-4 py4 px8 my16 mr16 br4">
              <FontAwesomeIcon className="grey-5 mr8" icon={faSearch} />
              <input
                autoFocus={
                  pathname.substring(0, 7) === "/search" ? true : false
                }
                className="no-border bg-grey-4 br4"
                onChange={(e) => {
                  setVentSearchString(e.target.value);
                  navigate("/search?" + e.target.value);
                }}
                placeholder="Search"
                type="text"
                value={ventSearchString}
              />
            </Container>
            <Link to="/vent-to-strangers">
              <Button size="large" type="primary">
                Post a Vent
              </Button>
            </Link>
          </Container>
          <Container className="full-center wrap mx32 my16">
            {!user && (
              <button
                className="blue fw-300 mx32"
                onClick={() => setActiveModal("login")}
              >
                Login
              </button>
            )}
            {!user && (
              <button
                className="white blue-fade px32 py8 br4"
                onClick={() => setActiveModal("signUp")}
              >
                Sign Up
              </button>
            )}
            {user && (
              <Container className="align-center wrap">
                <Link className="flex full-center mr16" to="/profile">
                  <MakeAvatar
                    displayName={user.displayName}
                    userBasicInfo={userBasicInfo}
                  />
                  <p className="mr8">{`Hello, ${capitolizeFirstChar(
                    user.displayName
                  )}`}</p>
                  <FontAwesomeIcon icon={faChevronDown} />
                </Link>

                <HandleOutsideClick
                  className="relative"
                  close={() => setShowNotificationDropdown(false)}
                >
                  <FontAwesomeIcon
                    className="clickable blue"
                    icon={faBell}
                    onClick={() => {
                      setShowNotificationDropdown(!showNotificationDropdown);

                      readNotifications(notifications);
                    }}
                    size="2x"
                  />
                  {showNotificationDropdown && (
                    <Container
                      className="container small bg-white shadow-2 ov-auto br8"
                      style={{
                        position: "absolute",
                        top: "calc(100% + 8px)",
                        right: 0,
                        maxHeight: "300px",
                        zIndex: 10,
                      }}
                    >
                      <NotificationList notifications={notifications} />
                    </Container>
                  )}
                  {newNotificationCounter(notifications) &&
                    !showNotificationDropdown && (
                      <p
                        className="fs-14 bg-red white pa4 br8"
                        style={{
                          position: "absolute",
                          top: "-12px",
                          right: "-12px",
                          pointerEvents: "none",
                        }}
                      >
                        {newNotificationCounter(notifications)}
                      </p>
                    )}
                </HandleOutsideClick>
              </Container>
            )}
          </Container>
        </Container>

        <StarterModal
          activeModal={activeModal}
          setActiveModal={setActiveModal}
        />
      </Container>
      {user && !user.emailVerified && (
        <Container className="x-fill full-center bg-grey-2">
          <h4 className="tac mr16">Please verify your email address!</h4>
          <button
            className="button-2 no-bold py8 px16 my16 br8"
            onClick={() => sendEmailVerification(user)}
          >
            Re-send verification link
          </button>
        </Container>
      )}
    </Container>
  );
}

export default Header;
