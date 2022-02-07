import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "antd";

import Chat from "./chat";
import Container from "../../components/containers/Container";
import ConversationOption from "./ConversationOption";
import MobileIndex from "./MobileIndex";
import Page from "../../components/containers/Page";
import StarterModal from "../../components/modals/Starter";

import { UserContext } from "../../context";

import {
  getIsMobileOrTablet,
  useIsMounted,
  userSignUpProgress,
} from "../../util";
import {
  getConversations,
  mostRecentConversationListener,
  setInitialConversationsAndActiveConversation,
} from "./util";

function Conversations() {
  const isMounted = useIsMounted();
  const { user } = useContext(UserContext);

  const [activeConversation, setActiveConversation] = useState();
  const [activeUserBasicInfo, setActiveUserBasicInfo] = useState();
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [starterModal, setStarterModal] = useState(!user);

  useEffect(() => {
    let newMessageListenerUnsubscribe;

    if (user) {
      setStarterModal(false);
      newMessageListenerUnsubscribe = mostRecentConversationListener(
        isMounted,
        setConversations,
        user.uid
      );

      getConversations(
        [],
        isMounted,
        (newConversations) =>
          setInitialConversationsAndActiveConversation(
            isMounted,
            newConversations,
            setActiveConversation,
            setCanLoadMore,
            setConversations
          ),
        user.uid
      );
    }

    return () => {
      if (newMessageListenerUnsubscribe) newMessageListenerUnsubscribe();
    };
  }, [isMounted, user]);

  return (
    <Page className="bg-grey-2 ov-hidden">
      <Container className="flex-fill x-fill gap4 ov-hidden pa4">
        <Container className="container small column ov-auto bg-white br4 pa8">
          <Button className="mb8" size="large" type="primary">
            New Group
          </Button>
          {conversations.length === 0 && (
            <Link className="" to="/people-online">
              <h6 className="button-1 grey-1 tac">
                Start a conversation with someone!
              </h6>
            </Link>
          )}

          {conversations.map((conversation, index) => {
            return (
              <ConversationOption
                activeUserBasicInfo={activeUserBasicInfo}
                conversation={conversation}
                isActive={
                  activeConversation
                    ? conversation.id === activeConversation.id
                    : false
                }
                key={conversation.id}
                setActiveConversation={setActiveConversation}
                setActiveUserBasicInfo={setActiveUserBasicInfo}
                setConversations={setConversations}
                userID={user.uid}
              />
            );
          })}
          {!userSignUpProgress(user, true) && canLoadMore && (
            <button
              className="button-2 pa8 my8 br4"
              onClick={() => {
                getConversations(
                  conversations,
                  isMounted,
                  (newConversations, subtraction) => {
                    if (
                      newConversations.length < 5 - subtraction ||
                      (newConversations.length === 0 && isMounted())
                    )
                      setCanLoadMore(false);
                    if (isMounted())
                      setConversations((oldConversations) => [
                        ...oldConversations,
                        ...newConversations,
                      ]);
                  },
                  user.uid
                );
              }}
            >
              Load More Conversations
            </button>
          )}
        </Container>

        <Container className="column flex-fill ov-hidden bg-white br4">
          {!activeConversation && user && user.emailVerified && (
            <Link className="grey-1 tac pa32" to="/people-online">
              <h4 className="tac">
                Check your messages from friends on Vent With Strangers,{" "}
              </h4>
              <h1 className="blue">See Who is Online :)</h1>
            </Link>
          )}
          {(!user || (user && !user.emailVerified)) && (
            <h4
              className="button-1 grey-1 tac pa32"
              onClick={() => {
                if (!user) setStarterModal(true);
                else {
                  userSignUpProgress(user);
                }
              }}
            >
              Check your messages from friends on Vent With Strangers,
              <span className="blue">
                {user ? " verify your email!" : " get started here!"}
              </span>
            </h4>
          )}
          {user &&
            user.emailVerified &&
            activeConversation &&
            activeConversation.id && (
              <Chat
                activeConversation={activeConversation}
                activeUserBasicInfo={activeUserBasicInfo}
                isChatInConversationsArray={Boolean(
                  conversations.find(
                    (conversation) => conversation.id === activeConversation.id
                  )
                )}
                setActiveConversation={setActiveConversation}
                setActiveUserBasicInfo={setActiveUserBasicInfo}
                userID={user.uid}
              />
            )}
        </Container>
      </Container>
      {starterModal && (
        <StarterModal
          activeModal={starterModal}
          setActiveModal={setStarterModal}
        />
      )}
    </Page>
  );
}

let temp;

if (!getIsMobileOrTablet()) temp = Conversations;
else temp = MobileIndex;

export default temp;
