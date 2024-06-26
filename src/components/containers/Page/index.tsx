import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ReactGA from "react-ga";
import { Helmet } from "react-helmet";

import Container from "../Container";

function Page({
  children,
  className,
  description,
  id,
  keywords,
  style,
  title,
}) {
  const { pathname, search } = useLocation();

  const [description2, setDescription2] = useState("");
  const [keywords2, setkeywords2] = useState("");
  const [title2, settitle2] = useState("");

  useEffect(() => {
    if (process.env.NODE_ENV !== "development") {
      ReactGA.initialize("UA-140815372-2");
      ReactGA.pageview(pathname);
    }

    import("./util").then((functions) => {
      const { description, keywords, title } = functions.getMetaData(
        pathname,
        search
      );
      if (description) setDescription2(description);
      if (keywords) setkeywords2(keywords);
      if (title) settitle2(title);
    });

    window.scrollTo(0, 0);
  }, [pathname, search]);

  return (
    <Container
      className={"column flex-fill ov-auto bg-blue-2 " + className}
      id={id}
      style={style}
    >
      <Helmet defer={false}>
        <meta charSet="utf-8" />
        {(title || title2) && <title>{title ? title : title2}</title>}
        {(title || title2) && (
          <meta content={title ? title : title2} name="title" />
        )}
        {(title || title2) && (
          <meta content={title ? title : title2} name="og:title" />
        )}
        {(description || description2) && (
          <meta
            content={description ? description : description2}
            name="description"
          />
        )}
        {(description || description2) && (
          <meta
            content={description ? description : description2}
            name="og:description"
          />
        )}
        {(keywords || keywords2) && (
          <meta content={keywords ? keywords : keywords2} name="keywords" />
        )}
      </Helmet>

      {children}
    </Container>
  );
}

export default Page;
