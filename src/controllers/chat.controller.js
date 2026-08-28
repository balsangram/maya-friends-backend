
import {
    createPrivateChatService,
    createGroupChatService,
    getUserChatsService,
    getChatDetailsService,
    deleteChatService,
} from "../services/chat.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import { successResponse } from "../utils/response.js";


// Create private chat
export const createPrivateChat = asyncHandler(async (req, res) => {
    console.log("==================")
    const userId = req.user.id;
console.log("userId",userId)
    const { userId: friendId } = req.body;

    const chat = await createPrivateChatService(
        userId,
        friendId
    );

    return successResponse(
        res,
        "Private chat created successfully",
        chat,
    );
});


// Create group
export const createGroupChat = asyncHandler(
  async (req, res) => {
    const userId = req.user.id;

    const {
      groupName,
      groupImage,
      memberIds = [],
    } = req.body || {};

    const group =
      await createGroupChatService({
        userId,
        groupName,
        groupImage,
        memberIds,
        file: req.file,
      });

    return successResponse(
      res,
      "Group created successfully",
      group,
      201
    );
  }
);


// Get logged-in user's chats
export const getUserChats = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const chats = await getUserChatsService(userId);

    return successResponse(
        res,
         "Chats fetched successfully",
         chats,
    );
});


// Get particular chat
export const getChatDetails = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const { chatId } = req.params;

    const chat = await getChatDetailsService(
        chatId,
        userId
    );

    return successResponse(
        res,
         "Chat details fetched successfully",
        chat,
    );
});


// Delete/deactivate chat
export const deleteChat = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const { chatId } = req.params;

    await deleteChatService(
        chatId,
        userId
    );

    return successResponse(
       res,
         "Chat deleted successfully",
         null
    );
});