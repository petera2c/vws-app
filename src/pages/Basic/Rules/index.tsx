import React from "react";
import { Space } from "antd";

import Container from "../../../components/containers/Container";
import Page from "../../../components/containers/Page";
import SubscribeColumn from "../../../components/SubscribeColumn";

function RulesPage() {
  return (
    <Page className="pa16">
      <Container>
        <Space
          className="flex-fill align-center bg-white pa32 br8"
          direction="vertical"
          size="large"
        >
          <h1 className="tac">VWS Rules</h1>

          <ol>
            <Space direction="vertical" size="large">
              <h4 className="tac">
                Failing to follow any of these rules will cause you to be
                permanently banned without warning.
              </h4>
              <li>
                Don't be creepy. No sexual usernames, do not ask for anyone's
                social media/email/phone number.
              </li>
              <li>
                No harassment, bullying, or attacking of people through vents,
                comments, or direct messages.
              </li>
              <li>No racist, sexist, prejudice or discriminatory content..</li>
              <li>
                Supportive comments only. We encourage everyone to comment on
                vents, but all comments must be supportive even if you disagree
                with the content of the vent.
              </li>
              <li>
                To protect from predators, we do not allow advertising of any
                social media profiles or pages.
              </li>

              <li>Have fun! :)</li>
            </Space>
          </ol>
        </Space>
        <SubscribeColumn slot="5139839598" />
      </Container>
    </Page>
  );
}

export default RulesPage;
