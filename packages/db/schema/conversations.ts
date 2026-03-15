import { pgTable, uuid, text, varchar, timestamp, jsonb, pgEnum, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";
import { testTypeEnum } from "./tests";

// ─── Enums ───────────────────────────────────────────────
export const conversationTypeEnum = pgEnum("conversation_type", [
  "test_debrief",
  "messaging",
  "general",
]);

export const messageRoleEnum = pgEnum("message_role", ["system", "user", "assistant"]);

// ─── Conversations ───────────────────────────────────────
export const conversations = pgTable(
  "conversations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    contextType: conversationTypeEnum("context_type").notNull(),
    testType: testTypeEnum("test_type"),
    status: varchar("status", { length: 20 }).notNull().default("active"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("conversations_user_idx").on(table.userId),
    index("conversations_user_type_idx").on(table.userId, table.contextType),
  ],
);

// ─── Messages (AYRI TABLO - Reflektif'teki JSON array hatasını düzeltiyoruz) ─
export const messages = pgTable(
  "messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    conversationId: uuid("conversation_id")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    role: messageRoleEnum("role").notNull(),
    content: text("content").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("messages_conversation_idx").on(table.conversationId, table.createdAt),
  ],
);

// ─── Direct Messages (Student ↔ Counselor) ───────────────
export const directMessages = pgTable(
  "direct_messages",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    senderId: uuid("sender_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    receiverId: uuid("receiver_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    isRead: timestamp("is_read"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("dm_sender_receiver_idx").on(table.senderId, table.receiverId, table.createdAt),
    index("dm_receiver_unread_idx").on(table.receiverId, table.isRead),
  ],
);

// ─── Debrief Insights Cache ──────────────────────────────
export const debriefInsights = pgTable(
  "debrief_insights",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    testType: testTypeEnum("test_type").notNull(),
    insights: jsonb("insights").notNull().$type<{
      summary: string;
      keyThemes: string[];
      revealedStrengths: string[];
      careerInsights: string[];
      nuances: string[];
    }>(),
    conversationHash: varchar("conversation_hash", { length: 64 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("debrief_insights_user_test_idx").on(table.userId, table.testType),
  ],
);

// ─── Relations ───────────────────────────────────────────
export const conversationsRelations = relations(conversations, ({ one, many }) => ({
  user: one(users, { fields: [conversations.userId], references: [users.id] }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  conversation: one(conversations, {
    fields: [messages.conversationId],
    references: [conversations.id],
  }),
}));

export const directMessagesRelations = relations(directMessages, ({ one }) => ({
  sender: one(users, { fields: [directMessages.senderId], references: [users.id] }),
  receiver: one(users, { fields: [directMessages.receiverId], references: [users.id] }),
}));
