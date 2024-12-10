const bcrypt = require("bcrypt");
const userSchema = require("../schemas/userSchema");

const User = class {
    constructor({ email, username, password, name }) {
        this.name = name;
        this.username = username;
        this.password = password;
        this.email = email;
    }

    register() {
        return new Promise(async (resolve, reject) => {

            try {
                const userExist = await userSchema.findOne({
                    $or: [{ email: this.email }, { username: this.username }]
                })

                if (userExist && userExist.email === this.email) {
                    reject("Email already exists");
                }

                if (userExist && userExist.username === this.username) {
                    reject("Username already exists")
                }

                const hasPassword = await bcrypt.hash(this.password, Number(process.env.SALT));

                const userData = new userSchema({
                    name: this.name,
                    email: this.email,
                    username: this.username,
                    password: hasPassword,
                });

                const userDb = await userData.save();
                resolve(userDb);
            }
            catch (err) {
                reject(err);
            }
        })
    }

    static findUserWithLoginID(loginId) {
        return new Promise(async(resolve, reject) => {
           try
           {
             const user = await userSchema.findOne({
                $or: [{email: loginId}, {username: loginId}]
             }).select("+password");

             if(user)
             {
                resolve(user);
             }
             reject("User not found! Please Signup first");
           }
           catch(err)
           {
             reject(err);
           }
        })
    }
}

module.exports = User;