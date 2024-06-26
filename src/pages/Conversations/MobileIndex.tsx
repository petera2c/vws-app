import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../../context";

import StarterModal from "../../components/modals/Starter";

import Page from "../../components/containers/Page";
import Container from "../../components/containers/Container";

import ConversationOption from "./ConversationOption";
import Chat from "./chat";

import { useIsMounted, userSignUpProgress } from "../../util";

import {
  getConversations,
  mostRecentConversationListener,
  setInitialConversationsAndActiveConversation,
} from "./util";

function MobileConversations() {
  const isMounted = useIsMounted();
  //const location = useLocation();
  //const { search } = location;
  const { user } = useContext(UserContext);

  const [activeConversation, setActiveConversation] = useState();
  const [activeChatUserBasicInfos, setActiveChatUserBasicInfos] = useState();
  const [canLoadMore, setCanLoadMore] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [starterModal, setStarterModal] = useState(!user);

  useEffect(() => {
    let newMessageListenerUnsubscribe;

    if (user) {
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
            false,
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
    <Page className="bg-blue-2">
      <Container
        className="flex-fill column ov-auto bg-white pa8 br4"
        style={{ display: activeConversation ? "none" : "flex" }}
      >
        {conversations.length === 0 && (
          <Link className="" to="/people-online">
            <h1 className="button-1 grey-1 tac">
              <span className="blue">Start</span> a conversation with someone!
            </h1>
          </Link>
        )}
        {conversations.map((conversation) => {
          return (
            <ConversationOption
              conversation={conversation}
              isActive={
                activeConversation
                  ? conversation.id === activeConversation.id
                  : false
              }
              key={conversation.id}
              setActiveConversation={setActiveConversation}
              setActiveChatUserBasicInfos={setActiveChatUserBasicInfos}
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
                (newConversations) => {
                  if (isMounted()) {
                    if (newConversations.length < 5) setCanLoadMore(false);

                    setConversations((oldConversations) => [
                      ...oldConversations,
                      ...newConversations,
                    ]);
                  }
                },
                user.uid
              );
            }}
          >
            Load More Conversations
          </button>
        )}
      </Container>
      {activeConversation && (
        <Container className="container mobile-full column ov-hidden flex-fill bg-white">
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
                activeChatUserBasicInfos={activeChatUserBasicInfos}
                isChatInConversationsArray={Boolean(
                  conversations.find(
                    (conversation) => conversation.id === activeConversation.id
                  )
                )}
                setActiveConversation={setActiveConversation}
                setActiveChatUserBasicInfos={setActiveChatUserBasicInfos}
                userID={user.uid}
              />
            )}
        </Container>
      )}
      {starterModal && (
        <StarterModal
          activeModal={starterModal}
          setActiveModal={setStarterModal}
        />
      )}
    </Page>
  );
}

export default MobileConversations;
