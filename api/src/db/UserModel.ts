import mongoose from 'mongoose';
import crypto from 'crypto';

export interface FlexableObject {
    [key: string]: any
}

export interface UserObject {
    name: string,
    username: string,
    email: string,
    pwhash: string,
    pwsalt: string
}

export const schema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    pwhash: String,
    pwsalt: String
});

schema.methods.validPassword = (password: string, salt: string, hash: string) => {
    if(!password || password == "") return;
    const pwhash2 = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("utf-8");
    return hash === pwhash2;
};

const UserModel = mongoose.model("ODS_User", schema);
console.log("[Model] Registered model: User.");

export const setPassword = (_id: string, password: string, callback: mongoose.Callback) => {
    if(!password || password == "") return;
    const pwsalt = crypto.randomBytes(16).toString("utf-8");
    const pwhash = crypto.pbkdf2Sync(password, pwsalt, 1000, 64, "sha512").toString("utf-8");
    UserModel.findOneAndUpdate({ _id: _id }, { pwsalt: pwsalt, pwhash: pwhash }, {}, callback);
};

export default UserModel;