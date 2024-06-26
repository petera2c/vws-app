import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Space } from "antd";

import { faBirthdayCake } from "@fortawesome/pro-duotone-svg-icons/faBirthdayCake";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Container from "../../containers/Container";

import { getIsMobileOrTablet, useIsMounted } from "../../../util";

function BirthdayModal({ close }) {
  const isMounted = useIsMounted();

  const [canClose, setCanClose] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

  useEffect(() => {
    setIsMobileOrTablet(getIsMobileOrTablet());

    setTimeout(() => {
      if (isMounted()) setCanClose(true);
    }, 2000);
  }, [isMounted]);

  return (
    <Container
      className="modal-container full-center"
      onClick={() => {
        if (canClose) close();
      }}
    >
      <Container
        className={
          "modal column align-center ov-auto bg-white pa32 br8 " +
          (isMobileOrTablet ? "mx8" : "container medium")
        }
      >
        <Space className="column x-fill" size="large">
          <Container className="column">
            <h1 className="blue tac">Happy Birthday!</h1>
            <h4 className="tac">
              We are so happy to celebrate this special day with you!
            </h4>
          </Container>
          <Link to="/birthday-post">
            <Button onClick={close} size="large" type="primary">
              Create Birthday Post
            </Button>
          </Link>
          <Space>
            <FontAwesomeIcon className="blue" icon={faBirthdayCake} size="5x" />
            <FontAwesomeIcon
              className="purple"
              icon={faBirthdayCake}
              size="5x"
            />
            <FontAwesomeIcon
              className="orange"
              icon={faBirthdayCake}
              size="5x"
            />
            <FontAwesomeIcon className="red" icon={faBirthdayCake} size="5x" />
            <FontAwesomeIcon
              className="green"
              icon={faBirthdayCake}
              size="5x"
            />
          </Space>
        </Space>
      </Container>
      <Container className="modal-background" />
    </Container>
  );
}

export default BirthdayModal;
