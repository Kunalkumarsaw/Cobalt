import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    managerId: {
      type: String,
      required: true,
    },
    point: {
      type: Number,
      default: 0,
    },
    rate: {
      type : Number, 
      default : 0 ,
    },
    progress: {
      type: String,
      default: "assigned",
    },
    endDate: Date,
    userIds: [],
    image: [],
    updates: [
      {
        userId : String ,
        image : String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

var TaskModel = mongoose.model("Tasks", taskSchema);

export default TaskModel;
