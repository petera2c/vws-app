export const commentProblem = (
  commentString,
  context,
  problem1,
  problemIndex
) => {
  context.socket.emit(
    "comment_problem",
    commentString,
    problem1._id,
    returnObj => {
      const { comment, success } = returnObj;

      context.addComment(comment, problemIndex);
    }
  );
};
export const getProblemComments = (context, problem, problemIndex) => {
  context.socket.emit("get_problem_comments", problem._id, returnObj => {
    const { comments, message, success } = returnObj;

    if (success) {
      problem.commentsArray = comments;
    }

    context.updateProblem(problem, problemIndex);
  });
};
export const likeProblem = (context, problem, problemIndex) => {
  context.socket.emit("like_problem", problem._id, returnObj => {
    const { message, success } = returnObj;

    if (success) {
      problem.upVotes++;
      problem.dailyUpvotes++;
      problem.hasLiked = true;

      context.updateProblem(problem, problemIndex);
    } else {
      context.notify({
        message,
        type: "danger"
      });
    }
  });
};

export const unlikeProblem = (context, problem, problemIndex) => {
  context.socket.emit("unlike_problem", problem._id, returnObj => {
    const { message, success } = returnObj;

    if (success) {
      problem.upVotes--;
      problem.dailyUpvotes--;
      problem.hasLiked = false;

      context.updateProblem(problem, problemIndex);
    } else {
      context.notify({
        message,
        type: "danger"
      });
    }
  });
};
