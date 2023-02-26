import UserModel from "../Models/userModel.js";
import bcrypt from "bcrypt";

// get a User

export const getUser = async (req, res) => {
  const id = req.params.id;

  try {
    const user = await UserModel.findById(id);

    if (user) {
      const { password, ...otherDetails } = user._doc;

      res.status(200).json(otherDetails);
    } else {
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

// update a user

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const { currentUserId, currentUserAdminStatus, password } = req.body;
  console.log("update user called !");
  if (id === currentUserId || currentUserAdminStatus) {
    try {
      if (password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(password, salt);
      }
      const user = await UserModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });

      res.status(200).json(user);
    } catch (error) {
      res.status(500).json(error);
    }
  }else {
    res.status(403).json("Access Denied! you can only update on your own profile! ");

  }
};


// Delete User 

export const deleteUser = async (req , res) => {
    const id  = req.params.id
    const {currentUserId , currentUserAdminStatus , password} = req.body;

    if (currentUserId === id || currentUserAdminStatus) {
      try {
        await UserModel.findByIdAndDelete(id);
        res.status(200).json("User deleted succesfully");
      } catch (error) {
        res.status(500).json(error);
      }
    } else {
      res
        .status(403)
        .json("Access Denied! you can only delete on your own profile! ");
    }

}


// Follow a user // Add a connection

export const followUser = async (req, res)=>{
    const id = req.params.id;

    const {currentUserId} = req.body;
    console.log("Follow User called !")
    if(currentUserId === id){
        res.status(403).json("Action forbidden")
    }else{
        try {
            const followUser = await UserModel.findById(id)
            const followingUser = await UserModel.findById(currentUserId)

            if (!followUser.connections.includes(currentUserId)) {
              await followUser.updateOne({
                $push: { connections: currentUserId },
              });
              await followingUser.updateOne({ $push: { connections: id } });
              res.status(200).json("user followed!");
            } else {
              res.status(403).json("User is already followed!");
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
}

// UnFollow/Remove a connection.

export const unFollowUser = async (req, res)=>{
    const id = req.params.id;

    const {currentUserId} = req.body;
    console.log("Un Follow User called !")
    if(currentUserId === id){
        res.status(403).json("Action forbidden")
    }else{
        try {
            const followUser = await UserModel.findById(id)
            const followingUser = await UserModel.findById(currentUserId)

            if (followUser.connections.includes(currentUserId)) {
              await followUser.updateOne({
                $pull: { connections: currentUserId },
              });
              await followingUser.updateOne({ $pull: { connections: id } });
              res.status(200).json("user un followed!");
            } else {
              res.status(403).json("User is not folled by you!");
            }
        } catch (error) {
            res.status(500).json(error)
        }
    }
}
