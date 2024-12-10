const { lIMIT } = require("../privateConstants");
const followSchema = require("../schemas/followSchema");
const userSchema = require("../schemas/userSchema");
const ObjectId = require("mongodb").ObjectId;

const findUser = (userId) => {
    return new Promise(async(resolve, reject) => {
        if (!userId) {
            reject("Please provide userId");
        }

        if(!ObjectId.isValid(userId))
        {
            reject("Incorrect format of Id");
        }

        try {
            const user = await userSchema.findOne({_id: userId});

            if (user) {
                resolve(user);
            }
            reject("User not found!");
        }
        catch (err) {
            reject(err);
        }
    })
}

const isFollow = ({followerUserId, followingUserId}) => {
    return new Promise(async(resolve,reject) => {
        try {
            const db = await followSchema.findOne({followerUserId, followingUserId});
            if(db)
            {
                reject("You already Followed");
            }
            resolve();
        } catch (error) {
            reject(error)
        }
    })
}

const followUser = ({followerUserId, followingUserId}) => {
    return new Promise(async(resolve, reject) => {
        try {
            const obj = new followSchema({ followerUserId, followingUserId, creationDateTime: Date.now()});

            const db = await obj.save();

            resolve(db);
        } catch (error) {
            reject(error);
        }
    })
}

const getFollowingList = ({followerUserId, SKIP}) => {
    return new Promise(async(resolve,reject) => {
        try {
            // const list = await followSchema.find({followerUserId}).populate("followingUserId").sort({creationDateTime : -1}).skip(Number(SKIP)).limit(Number(lIMIT));
            
            const list = await followSchema.aggregate([
                {
                    $match : {followerUserId},
                },
                {
                    $sort: {creationDateTime: -1}
                },
                {
                    $skip: SKIP,
                },
                {
                    $limit: lIMIT,
                }
            ])
            
            const followingListIds = list.map((item) => item.followingUserId);

            const followingList = await userSchema.find({
                _id: {$in: followingListIds}
            })

            resolve(followingList.reverse());
        } catch (error) {
            reject(error);
        }
    })
}

const getFollowerList = ({followingUserId, SKIP}) => {
    return new Promise(async(resolve,reject) => {
        try {
            // const list = await followSchema.find({followerUserId}).populate("followingUserId").sort({creationDateTime : -1}).skip(Number(SKIP)).limit(Number(lIMIT));
            
            const list = await followSchema.aggregate([
                {
                    $match : {followingUserId},
                },
                {
                    $sort: {creationDateTime: -1}
                },
                {
                    $skip: SKIP,
                },
                {
                    $limit: lIMIT,
                }
            ])
            
            const followerListIds = list.map((item) => item.followerUserId);

            const followerList = await userSchema.find({
                _id: {$in: followerListIds}
            })

            resolve(followerList.reverse());
        } catch (error) {
            reject(error);
        }
    })
}

const unfollowUser = ({followerUserId, followingUserId}) => {
    return new Promise(async(resolve, reject) => {
        try {
            const db = await followSchema.findOneAndDelete({followerUserId, followingUserId});
            
            resolve(db);
        } catch (error) {
            reject(error);
        }
    })
}

module.exports = {findUser, isFollow, followUser, getFollowingList, getFollowerList, unfollowUser};