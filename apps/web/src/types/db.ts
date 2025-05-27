import { chat, document, message } from '@caret/db/schema';

export type Document = typeof document.$inferSelect;

export type Chat = typeof chat.$inferSelect;

export type Message = typeof message.$inferSelect;
