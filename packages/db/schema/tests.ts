import { pgTable, uuid, text, varchar, timestamp, integer, jsonb, pgEnum, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

// ─── Enums ───────────────────────────────────────────────
export const testTypeEnum = pgEnum("test_type", ["riasec", "bigfive", "values"]);

// ─── Test Results ────────────────────────────────────────
export const testResults = pgTable(
  "test_results",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    testType: testTypeEnum("test_type").notNull(),
    scores: jsonb("scores").notNull().$type<Record<string, number>>(),
    analysis: jsonb("analysis").$type<Record<string, unknown>>(),
    interpretation: text("interpretation"),
    version: integer("version").notNull().default(1),
    completedAt: timestamp("completed_at").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("test_results_user_idx").on(table.userId),
    index("test_results_user_type_idx").on(table.userId, table.testType),
  ],
);

// ─── Test Drafts ─────────────────────────────────────────
export const testDrafts = pgTable(
  "test_drafts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    testType: testTypeEnum("test_type").notNull(),
    answers: jsonb("answers").notNull().$type<Record<string, number>>(),
    currentIndex: integer("current_index").notNull().default(0),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("test_drafts_user_type_idx").on(table.userId, table.testType)],
);

// ─── Test Retake Invitations ─────────────────────────────
export const testRetakeInvitations = pgTable(
  "test_retake_invitations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    counselorId: uuid("counselor_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    testType: testTypeEnum("test_type").notNull(),
    reason: text("reason"),
    status: varchar("status", { length: 20 }).notNull().default("pending"),
    expiresAt: timestamp("expires_at").notNull(),
    usedAt: timestamp("used_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("retake_student_idx").on(table.studentId),
    index("retake_status_idx").on(table.studentId, table.status),
  ],
);

// ─── Relations ───────────────────────────────────────────
export const testResultsRelations = relations(testResults, ({ one }) => ({
  user: one(users, { fields: [testResults.userId], references: [users.id] }),
}));

export const testDraftsRelations = relations(testDrafts, ({ one }) => ({
  user: one(users, { fields: [testDrafts.userId], references: [users.id] }),
}));

export const testRetakeRelations = relations(testRetakeInvitations, ({ one }) => ({
  student: one(users, { fields: [testRetakeInvitations.studentId], references: [users.id] }),
  counselor: one(users, { fields: [testRetakeInvitations.counselorId], references: [users.id] }),
}));
