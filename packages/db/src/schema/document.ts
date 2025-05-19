import { relations } from 'drizzle-orm';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';

import { user } from './auth';
import { timestamps } from './columns.helpers';

export const document = pgTable('document', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  description: text('description'),
  content: text('content'),
  type: text('type').notNull(),
  authorId: text('user_id')
    .references(() => user.id, { onDelete: 'cascade' })
    .notNull(),
  ...timestamps,
});

export const documentRelations = relations(document, ({ one }) => ({
  author: one(user, {
    fields: [document.authorId],
    references: [user.id],
  }),
}));
