import React, { Component } from "react";
import moment from "moment-timezone";
import TextArea from "react-textarea-autosize";

import Page from "../../components/containers/Page";
import VWSContainer from "../../components/containers/VWSContainer";

import VWSText from "../../components/views/VWSText";
import VWSButton from "../../components/views/VWSButton";
import VWSInput from "../../components/views/VWSInput";
import Consumer from "../../context";

import { addComment, getComments } from "./util";

class ProblemPage extends Component {
  state = { comment: "", comments: [] };
  componentDidMount() {
    this._ismounted = true;
    const problemID = this.props.problem._id;
    getComments(this.handleChange, problemID);
  }
  componentWillUnmount() {
    this._ismounted = false;
  }
  handleChange = stateObject => {
    if (this._ismounted) this.setState(stateObject);
  };
  createComment = comment => {
    const problemID = this.props.problem._id;
    addComment(
      (comments, success) => {
        if (success) {
          this.setState({ comment: "", comments });
        } else
          alert("Something went wrong :( Please reload the page and try again");
      },
      comment,
      problemID
    );
  };
  render() {
    const { author, createdAt, description, title } = this.props.problem;
    const { comment, comments = [] } = this.state;
    return (
      <Page
        className="column align-center py32"
        description="Problem"
        keywords=""
        title="Problem"
      >
        <VWSContainer className="column x-50">
          <VWSContainer className="column x-fill bg-white pa32 br16">
            <VWSText className="tac mb16" text={title} type="h4" />
            <VWSText className="x-fill mb16" text={description} type="p" />
          </VWSContainer>
          <VWSText
            className="x-fill tar white mb16"
            text={`Created at ${new moment(createdAt).format("LLLL")}`}
            type="p"
          />
          <VWSText
            className="x-fill tar white mb16"
            text={`By ${author.name}`}
            type="p"
          />
        </VWSContainer>
        <VWSContainer className="column x-50 mb16">
          <TextArea
            className="x-fill bg-white pa16 mb8 br8"
            onChange={event =>
              this.handleChange({ comment: event.target.value })
            }
            placeholder="Type a helpful message here :) ..."
            style={{ minHeight: "100px" }}
            value={comment}
          />
          <VWSContainer className="x-fill justify-end">
            <VWSButton
              className="bg-white py4 px8 br8"
              onClick={() => this.createComment(comment)}
              text="Submit"
            />
          </VWSContainer>
        </VWSContainer>

        {comments.length > 0 && (
          <VWSContainer className="column x-50 bg-white pa32 br16">
            {comments.map((comment, index) => (
              <VWSContainer key={index}>{comment.text}</VWSContainer>
            ))}
          </VWSContainer>
        )}
      </Page>
    );
  }
}

export default ProblemPage;
