ALTER TABLE profile ADD FOREIGN KEY(user_id) REFERENCES user(user_id) ON DELETE CASCADE;

ALTER TABLE user_friend ADD FOREIGN KEY(user_id) REFERENCES user(user_id) ON DELETE CASCADE;
ALTER TABLE user_friend ADD FOREIGN KEY(friend_id) REFERENCES user(user_id) ON DELETE CASCADE;

ALTER TABLE user_chat ADD FOREIGN KEY(room_id) REFERENCES chat_room(room_id) ON DELETE CASCADE;
ALTER TABLE user_chat ADD FOREIGN KEY(user_id) REFERENCES user(user_id) ON DELETE CASCADE;
ALTER TABLE user_chat ADD FOREIGN KEY(friend_id) REFERENCES user(user_id) ON DELETE SET NULL;

ALTER TABLE user_group ADD FOREIGN KEY(room_id) REFERENCES group_room(room_id) ON DELETE CASCADE;
ALTER TABLE user_group ADD FOREIGN KEY(user_id) REFERENCES user(user_id) ON DELETE CASCADE;

ALTER TABLE message ADD FOREIGN KEY(room_id) REFERENCES chat_room(room_id) ON DELETE CASCADE;
ALTER TABLE message ADD FOREIGN KEY(sender_id) REFERENCES user(user_id) ON DELETE SET NULL;
ALTER TABLE message ADD FOREIGN KEY(owner_id) REFERENCES user(user_id) ON DELETE CASCADE;
ALTER TABLE message ADD FOREIGN KEY(replying) REFERENCES message(message_id) ON DELETE SET NULL;

ALTER TABLE group_message ADD FOREIGN KEY(room_id) REFERENCES group_room(room_id) ON DELETE CASCADE;
ALTER TABLE group_message ADD FOREIGN KEY(sender_id) REFERENCES user(user_id) ON DELETE SET NULL;
ALTER TABLE group_message ADD FOREIGN KEY(owner_id) REFERENCES user(user_id) ON DELETE CASCADE;
ALTER TABLE group_message ADD FOREIGN KEY(replying) REFERENCES group_message(message_id) ON DELETE SET NULL;
ALTER TABLE group_message ADD FOREIGN KEY(refering) REFERENCES group_message(message_id) ON DELETE SET NULL;

