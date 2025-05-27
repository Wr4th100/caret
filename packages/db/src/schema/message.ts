import { relations } from 'drizzle-orm';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';

import { chat } from './chat';
import { timestamps } from './columns.helpers';

export const message = pgTable('message', {
  id: serial('id').primaryKey(),
  chatId: serial('chat_id')
    .notNull()
    .references(() => chat.id, { onDelete: 'cascade' }),
  role: text('role').notNull(), // Use 'user' or 'ai'
  content: text('content').notNull(), // You can change this to JSONB if using rich content
  jsonOutput: text('json_output'), // Optional field for JSON output
  webLinks: text('web_links').array(), // Optional field for web links
  ...timestamps,
});

export const messageRelations = relations(message, ({ one }) => ({
  chat: one(chat, {
    fields: [message.chatId],
    references: [chat.id],
  }),
}));
