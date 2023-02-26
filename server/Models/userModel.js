import mongoose from 'mongoose'

const UserSchema = mongoose.Schema(
    {
        username: {
            type: String,
            required : true
        },
        password : {
            type : String,
            required : true
        },
        firstname: {
            type: String ,
            required : true
        },
        lastname : {
            type : String,
            required : true
        },
        isManager :{
            type: Boolean ,
            default : false,
        },
        isActive :{
            type: Boolean ,
            default : true ,
        },
        profilePicture: String,
        coverPicture : String, 
        about : String ,
        livesin : String ,
        score : {
            type : Number ,
            default : 0
        },
        connections : [] 

    },
    {timestamps:  true}
)

const UserModel = mongoose.model("Users"  , UserSchema);

export default UserModel;