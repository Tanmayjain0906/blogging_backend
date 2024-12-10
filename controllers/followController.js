const { findUser, followUser, getFollowingList, getFollowerList, isFollow, unfollowUser } = require("../models/followModel");

const followUserController = async (req, res) => {
    const followerUserId = req.session.user.userId;
    const { followingUserId } = req.body;

    if (followerUserId.equals(followingUserId)) {
        return res.send({
            status: 400,
            message: "Not able to follow",
        })
    }

    try {
        await findUser(followerUserId);
    } catch (error) {
        return res.send({
            status: 400,
            message: "Invalid follower userId",
            error: error,
        })
    }

    try {
        await findUser(followingUserId);
    } catch (error) {
        return res.send({
            status: 400,
            message: "Invalid following userId",
            error: error,
        })
    }

    try {
        await isFollow({ followerUserId, followingUserId })
    } catch (error) {
        return res.send({
            status: 400,
            message: error,
        })
    }

    try {
        const db = await followUser({ followerUserId, followingUserId });

        return res.send({
            status: 201,
            message: "Follow successfull",
            data: db
        })
    } catch (error) {
        return res.send({
            status: 500,
            message: "Internal Server Error",
            data: error,
        })
    }
}

const getFollowingListController = async (req, res) => {
    const followerUserId = req.session.user.userId;
    const SKIP = Number(req.query.skip) || 0;
    try {
        await findUser(followerUserId);
    } catch (error) {
        return res.send({
            status: 400,
            message: "Invalid follower userId",
            error: error,
        })
    }


    try {
        const list = await getFollowingList({ followerUserId, SKIP });

        if (list.length === 0) {
            return res.send({
                status: 203,
                message: "No following found",
            });
        }

        return res.send({
            status: 200,
            message: "Read success",
            data: list,
        });
    } catch (error) {
        console.log(error);
        return res.send({
            status: 500,
            message: "Internal Server Error",
            data: error,
        })
    }

}

const getFollowerListController = async (req, res) => {
    const followingUserId = req.session.user.userId;
    const SKIP = Number(req.query.skip) || 0;
    try {
        await findUser(followingUserId);
    } catch (error) {
        return res.send({
            status: 400,
            message: "Invalid follower userId",
            error: error,
        })
    }


    try {
        const list = await getFollowerList({ followingUserId, SKIP });

        if (list.length === 0) {
            return res.send({
                status: 203,
                message: "No follower found",
            });
        }

        return res.send({
            status: 200,
            message: "Read success",
            data: list,
        });
    } catch (error) {
        console.log(error);
        return res.send({
            status: 500,
            message: "Internal Server Error",
            data: error,
        })
    }
}

const unfollowUserController = async (req, res) => {
    const followerUserId = req.session.user.userId;
    const { followingUserId } = req.body;

    if (followerUserId.equals(followingUserId)) {
        return res.send({
            status: 400,
            message: "Not able to unfollow",
        })
    }


    try {
        const db = await unfollowUser({ followerUserId, followingUserId });
        return res.send({
            status: 200,
            message: "Unfollow successfull",
            data: db,
        });

    } catch (error) {
        return res.send({
            status: 500,
            message: "Internal server error",
            error: error,
        });
    }
}

module.exports = { followUserController, getFollowingListController, getFollowerListController, unfollowUserController };