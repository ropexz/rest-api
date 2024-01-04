import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  authentication: {
    password: {
      type: String,
      required: true,
      select: false,
    },
    salt: {
      type: String,
      select: false,
    },
    sessionToken: {
      type: String,
      select: false,
    },
  },
});

export const User = mongoose.model("User", UserSchema);

export const getUsers = () => {
  return User.find();
};

export const getUserByEmail = (email: string) => {
  return User.findOne({ email });
};

export const getUserBySessionToken = (sessionToken: string) => {
  return User.findOne({
    "authentication.sessionToken": sessionToken,
  });
};

export const getUserById = (id: string) => {
  return User.findById(id);
};

export const createUser = (values: Record<string, any>) => {
  return new User(values).save().then((user) => user.toObject());
};

export const deleteUserById = (id: string) => {
  return User.findOneAndDelete({ _id: id });
};

export const updateUserById = (id: string, values: Record<string, any>) => {
  return User.findByIdAndUpdate(id, values);
};
