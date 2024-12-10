const { resolve } = require("path");

const isEmailValidate = ({ key }) => {
    const isEmail =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i.test(
            key
        );
    return isEmail;
};


const userValidation = ({ email, password, username }) => {
    return new Promise((res, rej) => {
        if (!email || !password || !username) {
            rej("Missing User Data");
        }
        if (typeof email !== "string") reject("Email is not a text");
        if (typeof username !== "string") reject("username is not a text");
        if (typeof password !== "string") reject("password is not a text");

        if (username.length < 3 || username.length > 50)
            rej("Username length should be 3-50");

        if (!isEmailValidate({ key: email })) {
            rej("Format of an email is incorrect");
        }
        res();
    })
}

module.exports = {isEmailValidate, userValidation};