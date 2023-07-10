import mongoose from "mongoose";

const user = mongoose.Schema({

    "first_name": String
});

const User = mongoose.model('user', user);

export default User;