const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const problemSchema = new Schema(
  {
    author: {
      id: { require: true, type: Schema.Types.ObjectId },
      name: { require: true, type: String }
    },
    comments: [
      {
        author: {
          id: { require: true, type: Schema.Types.ObjectId },
          name: { require: true, type: String }
        },
        text: { require: true, type: String }
      },
      {
        timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
      }
    ],
    description: { require: true, type: String },
    title: { require: true, type: String }
  },
  {
    timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
  }
);

module.exports = mongoose.model("problems", problemSchema);