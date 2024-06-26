import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import loadable from "@loadable/component";
import { Space } from "antd";

import { faBaby } from "@fortawesome/pro-solid-svg-icons/faBaby";
import { faComments } from "@fortawesome/pro-duotone-svg-icons/faComments";
import { faGlassCheers } from "@fortawesome/pro-solid-svg-icons/faGlassCheers";
import { faLandmark } from "@fortawesome/pro-solid-svg-icons/faLandmark";
import { faPray } from "@fortawesome/pro-solid-svg-icons/faPray";
import { faSchool } from "@fortawesome/pro-solid-svg-icons/faSchool";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../containers/Container";
import DisplayName from "../views/DisplayName";
import StarterModal from "../modals/Starter";

import { UserContext } from "../../context";

import { startConversation } from "../../components/Vent/util";
import {
  educationList,
  kidsList,
  partyingList,
  politicalBeliefsList,
} from "../../PersonalOptions";
import {
  calculateKarma,
  capitolizeFirstChar,
  getUserBasicInfo,
  useIsMounted,
  userSignUpProgress,
} from "../../util";

const MakeAvatar = loadable(() => import("../views/MakeAvatar"));

dayjs.extend(relativeTime);

function UserComponent({
  additionalUserInfo,
  displayName,
  isUserOnline,
  lastOnline,
  showAdditionaluserInformation,
  showMessageUser,
  userID,
}) {
  const isMounted = useIsMounted();
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({ displayName });
  const [starterModal, setStarterModal] = useState(false);

  const [karmaPoints, setKarmaPoints] = useState(0);

  useEffect(() => {
    getUserBasicInfo((newUserInfo) => {
      if (isMounted) {
        setUserInfo(newUserInfo);
        setKarmaPoints(calculateKarma(newUserInfo));
      }
    }, userID);
  }, [isMounted, userID]);

  return (
    <Link
      className="button-6 flex column container twentyvw ov-hidden bg-white br8 pa16"
      to={"/profile?" + userID}
    >
      <Container className="column x-fill flex-fill gap8">
        <Container className="x-fill full-center">
          <MakeAvatar
            displayName={userInfo.displayName}
            size="large"
            userBasicInfo={userInfo}
          />
        </Container>

        <Container className="flex-fill justify-end column gap4">
          <Container className="x-fill align-center wrap gap8">
            <DisplayName
              big
              displayName={userInfo.displayName}
              isLink={false}
              isUserOnline={isUserOnline}
              noAvatar
              userBasicInfo={userInfo}
            />
          </Container>
          <p className="lh-1">{karmaPoints} Karma Points</p>
        </Container>
        {(userInfo.birth_date || userInfo.gender || userInfo.pronouns) && (
          <Container className="gap8">
            {Boolean(
              new dayjs().year() - new dayjs(userInfo.birth_date).year()
            ) && (
              <Container className="column">
                <h6 className="fw-400">Age</h6>
                <h6 className="grey-1 fw-400">
                  {new dayjs().year() - new dayjs(userInfo.birth_date).year()}
                </h6>
              </Container>
            )}

            {userInfo.gender && (
              <Container className="column">
                <h6 className="fw-400">Gender</h6>
                <h6 className="grey-1 fw-400">{userInfo.gender}</h6>
              </Container>
            )}
            {userInfo.pronouns && (
              <Container className="column">
                <h6 className="fw-400">Pronouns</h6>
                <h6 className="grey-1 fw-400">{userInfo.pronouns}</h6>
              </Container>
            )}
          </Container>
        )}

        {showAdditionaluserInformation && (
          <Space wrap>
            {additionalUserInfo.education !== undefined && (
              <Container className="border-all align-center px8 py4 br4">
                <p>
                  <FontAwesomeIcon className="mr8" icon={faSchool} />
                  {educationList[additionalUserInfo.education]}
                </p>
              </Container>
            )}
            {additionalUserInfo.kids !== undefined && (
              <Container className="border-all align-center px8 py4 br4">
                <p>
                  <FontAwesomeIcon className="mr8" icon={faBaby} />
                  {kidsList[additionalUserInfo.kids]}
                </p>
              </Container>
            )}
            {additionalUserInfo.partying !== undefined && (
              <Container className="border-all align-center px8 py4 br4">
                <p>
                  <FontAwesomeIcon className="mr8" icon={faGlassCheers} />
                  {partyingList[additionalUserInfo.partying]}
                </p>
              </Container>
            )}
            {additionalUserInfo.politics !== undefined && (
              <Container className="border-all align-center px8 py4 br4">
                <p>
                  <FontAwesomeIcon className="mr8" icon={faLandmark} />
                  {politicalBeliefsList[additionalUserInfo.politics]}
                </p>
              </Container>
            )}
            {additionalUserInfo.religion !== undefined && (
              <Container className="border-all align-center px8 py4 br4">
                <p>
                  <FontAwesomeIcon className="mr8" icon={faPray} />
                  {additionalUserInfo.religion}
                </p>
              </Container>
            )}
          </Space>
        )}

        {showMessageUser && (
          <Container className="column flex-fill justify-end gap8">
            {(!user || (user && user.uid !== userID)) && (
              <button
                className="x-fill button-2 px16 py8 br8"
                onClick={(e) => {
                  e.preventDefault();

                  const userInteractionIssues = userSignUpProgress(user);

                  if (userInteractionIssues) {
                    if (userInteractionIssues === "NSI") setStarterModal(true);
                    return;
                  }

                  startConversation(navigate, user, userID);
                }}
              >
                <FontAwesomeIcon className="mr8" icon={faComments} />
                <p className="ic ellipsis">
                  Message {capitolizeFirstChar(userInfo.displayName)}
                </p>
              </button>
            )}
            {lastOnline && (
              <p className="x-fill lh-1">
                Last Seen: {dayjs(lastOnline).fromNow()}
              </p>
            )}
          </Container>
        )}
      </Container>
      {starterModal && (
        <StarterModal
          activeModal={starterModal}
          setActiveModal={setStarterModal}
        />
      )}
    </Link>
  );
}

export default UserComponent;
