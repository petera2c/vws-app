const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const Problem = require("../models/Problem");

const { addUserToObject } = require("./problem");

const getAggregate = (match, userID) => [
  {
    $match: match
  },
  {
    $project: {
      authorID: "$authorID",
      createdAt: "$createdAt",
      hasLiked: { $in: [userID, "$upVotes"] },
      text: "$text",
      upVotes: { $size: "$upVotes" }
    }
  },
  { $sort: { createdAt: -1 } },
  { $limit: 10 }
];

const commentProblem = (commentString, problemID, callback, socket) => {
  const userID = socket.request.user._id;

  const comment = new Comment({
    authorID: userID,
    problemID,
    text: commentString,
    upVotes: 0,
    upVotes: []
  });

  Problem.update(
    { _id: problemID },
    {
      $push: {
        comments: {
          id: comment._id
        }
      }
    },
    (err, saveData) => {
      if (saveData && !err)
        comment.save((err, comment) => {
          callback({ comment, success: true });
        });
      else callback({ success: false });
    }
  );
};

const getProblemComments = (problemID, callback, socket) => {
  const userID = socket.request.user._id;

  Problem.findById(problemID, { comments: 1 }, (err, problem) => {
    let counter = 0;
    let commentList = [];

    Comment.aggregate(
      getAggregate({ problemID: problem._id }, userID),
      (err, comments) => {
        if (comments && comments.length === 0)
          callback({ success: true, comments });
        else
          addUserToObject(
            comments => callback({ success: true, comments }),
            comments
          );
      }
    );
  });
};

const getUsersComments = (dataObj, callback, socket) => {
  const { searchID } = dataObj;

  Comment.aggregate(
    getAggregate(
      { authorID: mongoose.Types.ObjectId(searchID) },
      socket.request.user._id
    ),
    (err, comments) => {
      if (comments) {
        if (comments.length === 0) callback({ comments, success: true });
        else
          addUserToObject(
            comments => callback({ comments, success: true }),
            comments
          );
      } else callback({ message: "Unable to get posts.", success: false });
    }
  );
};

module.exports = { commentProblem, getProblemComments, getUsersComments };