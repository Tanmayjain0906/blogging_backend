const express = require("express");
const { followUserController, getFollowingListController, getFollowerListController, unfollowUserController } = require("../controllers/followController");
const followRouter = express.Router();


followRouter.post("/follow-user", followUserController);
followRouter.get("/get-followingList", getFollowingListController);
followRouter.get("/get-followerList", getFollowerListController);
followRouter.post("/unfollow", unfollowUserController)

module.exports = followRouter;