import { relations } from 'drizzle-orm';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';

import { user } from './auth';
import { timestamps } from './columns.helpers';
import { document } from './document';
import { message } from './message';

export const chat = pgTable('chat', {
  id: serial('id').primaryKey(),
  documentId: serial('document_id')
    .notNull()
    .references(() => document.id, { onDelete: 'cascade' }),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  location: text('location'), // Optional: section/paragraph reference
  ...timestamps,
});

export const chatRelations = relations(chat, ({ one, many }) => ({
  user: one(user, {
    fields: [chat.userId],
    references: [user.id],
  }),
  document: one(document, {
    fields: [chat.documentId],
    references: [document.id],
  }),
  messages: many(message),
}));
