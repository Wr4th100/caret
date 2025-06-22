import { chat, document, message, user } from '@caret/db/schema';

export type Document = typeof document.$inferSelect;

export type Chat = typeof chat.$inferSelect;

export type Message = typeof message.$inferSelect;

export type User = typeof user.$inferSelect;
