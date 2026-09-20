import { getUsersByIds } from "../clients/user.client.js";

/**
 * Build a Map of userId -> public user from Auth service
 */
export const buildUserMap = async (userIds = []) => {
  const uniqueIds = [
    ...new Set(
      userIds
        .filter(Boolean)
        .map((id) => id.toString())
    ),
  ];

  if (uniqueIds.length === 0) {
    return new Map();
  }

  const users = await getUsersByIds(uniqueIds);

  return new Map(
    users.map((user) => [
      user._id.toString(),
      {
        _id: user._id,
        name: user.name || null,
        username: user.username || null,
        image: user.image || null,
      },
    ])
  );
};

const resolveUser = (userMap, id) => {
  if (!id) return null;
  const key = id.toString();
  return userMap.get(key) || { _id: id };
};

/**
 * Attach Auth-service user details onto chat documents
 */
export const enrichChatsWithUsers = async (chats = []) => {
  const list = Array.isArray(chats) ? chats : [chats];
  const ids = [];

  for (const chat of list) {
    if (!chat) continue;
    const plain = chat.toObject?.() || chat;

    (plain.participants || []).forEach((id) => ids.push(id));
    (plain.groupAdmins || []).forEach((id) => ids.push(id));
    if (plain.createdBy) ids.push(plain.createdBy);
  }

  const userMap = await buildUserMap(ids);

  const enriched = list.map((chat) => {
    if (!chat) return chat;
    const plain = chat.toObject?.() || { ...chat };

    return {
      ...plain,
      participants: (plain.participants || []).map((id) =>
        resolveUser(userMap, id)
      ),
      groupAdmins: (plain.groupAdmins || []).map((id) =>
        resolveUser(userMap, id)
      ),
      createdBy: resolveUser(userMap, plain.createdBy),
    };
  });

  return Array.isArray(chats) ? enriched : enriched[0];
};

/**
 * Attach sender details onto message documents
 */
export const enrichMessagesWithUsers = async (messages = []) => {
  const list = Array.isArray(messages) ? messages : [messages];
  const ids = list
    .filter(Boolean)
    .map((msg) => {
      const plain = msg.toObject?.() || msg;
      return plain.senderId;
    });

  const userMap = await buildUserMap(ids);

  const enriched = list.map((msg) => {
    if (!msg) return msg;
    const plain = msg.toObject?.() || { ...msg };

    return {
      ...plain,
      senderId: resolveUser(userMap, plain.senderId),
    };
  });

  return Array.isArray(messages) ? enriched : enriched[0];
};

/**
 * Attach user details onto group member documents
 */
export const enrichMembersWithUsers = async (members = []) => {
  const list = Array.isArray(members) ? members : [members];
  const ids = list
    .filter(Boolean)
    .map((member) => {
      const plain = member.toObject?.() || member;
      return plain.userId;
    });

  const userMap = await buildUserMap(ids);

  const enriched = list.map((member) => {
    if (!member) return member;
    const plain = member.toObject?.() || { ...member };

    return {
      ...plain,
      userId: resolveUser(userMap, plain.userId),
    };
  });

  return Array.isArray(members) ? enriched : enriched[0];
};
