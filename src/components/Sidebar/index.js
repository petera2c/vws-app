import React, { useContext, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import { Space } from "antd";

import { faChartNetwork } from "@fortawesome/pro-solid-svg-icons/faChartNetwork";
import { faCog } from "@fortawesome/free-solid-svg-icons/faCog";
import { faComments } from "@fortawesome/pro-duotone-svg-icons/faComments";
import { faInfo } from "@fortawesome/pro-duotone-svg-icons/faInfo";
import { faPen } from "@fortawesome/pro-duotone-svg-icons/faPen";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faUserAstronaut } from "@fortawesome/pro-duotone-svg-icons/faUserAstronaut";
import { faUserFriends } from "@fortawesome/pro-duotone-svg-icons/faUserFriends";
import { faUsers } from "@fortawesome/pro-duotone-svg-icons/faUsers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../containers/Container";
import MakeAd from "../MakeAd";

import { UserContext } from "../../context";

import {
  getTotalOnlineUsers,
  isPageActive,
  signOut,
  useIsMounted,
} from "../../util";

function SideBarLink({ icon, link, onClick, pathname, text }) {
  if (link)
    return (
      <Link
        className={
          "x-fill align-center grid-1 button-4 clickable py8 " +
          isPageActive(link, pathname)
        }
        to={link}
      >
        <Container className="flex x-fill full-center">
          <FontAwesomeIcon icon={icon} />
        </Container>
        <h5 className="grey-1 inherit-color">{text}</h5>
      </Link>
    );

  if (onClick)
    return (
      <Container
        className="x-fill align-center grid-1 button-4 clickable py8"
        onClick={onClick}
      >
        <Container className="flex x-fill full-center">
          <FontAwesomeIcon icon={icon} />
        </Container>
        <h5 className="grey-1 inherit-color">{text}</h5>
      </Container>
    );
}

function Sidebar() {
  const isMounted = useIsMounted();
  const { pathname } = useLocation();
  const { user } = useContext(UserContext);

  const [totalOnlineUsers, setTotalOnlineUsers] = useState(0);

  useEffect(() => {
    let onlineUsersUnsubscribe;

    onlineUsersUnsubscribe = getTotalOnlineUsers((totalOnlineUsers) => {
      if (isMounted()) setTotalOnlineUsers(totalOnlineUsers);
    });

    return () => {
      if (onlineUsersUnsubscribe) onlineUsersUnsubscribe.off("value");
    };
  }, []);

  return (
    <Space
      className="column ov-auto bg-white border-top pa16"
      direction="vertical"
    >
      <SideBarLink
        icon={faUserFriends}
        link="/online-users"
        pathname={pathname}
        text={
          totalOnlineUsers +
          " " +
          (totalOnlineUsers === 1 ? "Person" : "People") +
          " Online"
        }
      />
      <SideBarLink
        icon={faPen}
        link="/vent-to-strangers"
        pathname={pathname}
        text="Post a Vent"
      />
      {user && (
        <SideBarLink
          icon={faComments}
          link="/conversations"
          pathname={pathname}
          text="Inbox"
        />
      )}
      <SideBarLink
        icon={faUsers}
        link="/make-friends"
        pathname={pathname}
        text="Make Friends"
      />

      {false && <MakeAd className="mt16" slot="4732645487" />}

      {user && (
        <SideBarLink
          icon={faChartNetwork}
          link="/profile"
          pathname={pathname}
          text="My Public Profile"
        />
      )}
      {user && (
        <SideBarLink
          icon={faUser}
          link="/account"
          pathname={pathname}
          text="Account"
        />
      )}
      {user && (
        <SideBarLink
          icon={faUserAstronaut}
          link="/avatar"
          pathname={pathname}
          text="Avatar"
        />
      )}
      {user && (
        <SideBarLink
          icon={faCog}
          link="/settings"
          pathname={pathname}
          text="Notifications / Settings"
        />
      )}
      <SideBarLink
        icon={faInfo}
        link="/site-info"
        pathname={pathname}
        text="Site Info"
      />
      {user && (
        <SideBarLink
          icon={faCog}
          onClick={() => {
            signOut(user.uid);
          }}
          pathname={pathname}
          text="Sign Out"
        />
      )}
    </Space>
  );
}

export default Sidebar;