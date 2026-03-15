import { pgTable, uuid, text, varchar, timestamp, jsonb, boolean, pgEnum, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

// ─── Enums ───────────────────────────────────────────────
export const notificationTypeEnum = pgEnum("notification_type", [
  "test_completed",
  "debrief_completed",
  "diagnostic_draft",
  "diagnostic_validated",
  "diagnostic_published",
  "admission_generated",
  "admission_published",
  "choices_submitted",
  "parent_completed",
  "access_upgraded",
  "counselor_assigned",
  "appointment_update",
  "new_message",
  "system",
]);

// ─── Notifications ───────────────────────────────────────
export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: notificationTypeEnum("type").notNull(),
    titleFr: text("title_fr").notNull(),
    titleTr: text("title_tr").notNull(),
    titleEn: text("title_en"),
    messageFr: text("message_fr").notNull(),
    messageTr: text("message_tr").notNull(),
    messageEn: text("message_en"),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("notifications_user_idx").on(table.userId, table.createdAt),
    index("notifications_unread_idx").on(table.userId, table.isRead),
  ],
);

// ─── Appointments ────────────────────────────────────────
export const appointments = pgTable(
  "appointments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    studentId: uuid("student_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    counselorId: uuid("counselor_id").references(() => users.id),
    reason: text("reason").notNull(),
    message: text("message"),
    preferredDate: timestamp("preferred_date"),
    preferredTime: varchar("preferred_time", { length: 20 }),
    contactMethod: varchar("contact_method", { length: 50 }),
    status: varchar("status", { length: 20 }).notNull().default("pending"),
    counselorNotes: text("counselor_notes"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("appointments_student_idx").on(table.studentId),
    index("appointments_status_idx").on(table.status),
  ],
);

// ─── Stripe Payments ─────────────────────────────────────
export const payments = pgTable(
  "payments",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    stripeSessionId: varchar("stripe_session_id", { length: 255 }),
    stripePaymentIntentId: varchar("stripe_payment_intent_id", { length: 255 }),
    plan: varchar("plan", { length: 50 }).notNull(),
    amount: integer("amount").notNull(),
    currency: varchar("currency", { length: 10 }).notNull().default("eur"),
    status: varchar("status", { length: 20 }).notNull().default("pending"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("payments_user_idx").on(table.userId)],
);

// ─── Relations ───────────────────────────────────────────
export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, { fields: [notifications.userId], references: [users.id] }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  student: one(users, { fields: [appointments.studentId], references: [users.id] }),
  counselor: one(users, { fields: [appointments.counselorId], references: [users.id] }),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  user: one(users, { fields: [payments.userId], references: [users.id] }),
}));
