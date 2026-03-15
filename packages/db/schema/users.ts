import { pgTable, uuid, text, varchar, timestamp, pgEnum, boolean, integer } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ───────────────────────────────────────────────
export const userRoleEnum = pgEnum("user_role", ["student", "counselor", "admin"]);
export const accessLevelEnum = pgEnum("access_level", ["free", "standard", "premium"]);
export const localeEnum = pgEnum("locale", ["fr", "tr", "en"]);
export const profileTypeEnum = pgEnum("profile_type", [
  "collegien",
  "lyceen",
  "superieur",
  "adulte",
]);
export const schoolLevelEnum = pgEnum("school_level", [
  "college_6e",
  "college_5e",
  "college_4e",
  "college_3e",
  "lycee_2nde",
  "lycee_1ere",
  "lycee_terminale",
  "bac_plus_1",
  "bac_plus_2",
  "bac_plus_3",
  "bac_plus_4",
  "bac_plus_5",
  "working",
  "seeking",
  "retraining",
]);

// ─── Users ───────────────────────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  role: userRoleEnum("role").notNull().default("student"),
  accessLevel: accessLevelEnum("access_level").notNull().default("free"),
  locale: localeEnum("locale").notNull().default("fr"),
  birthDate: timestamp("birth_date", { mode: "date" }),
  city: varchar("city", { length: 255 }),
  country: varchar("country", { length: 100 }),
  phone: varchar("phone", { length: 50 }),
  schoolLevel: schoolLevelEnum("school_level"),
  profileType: profileTypeEnum("profile_type"),
  onboardingCompletedAt: timestamp("onboarding_completed_at"),
  choicesSubmittedAt: timestamp("choices_submitted_at"),
  assignedCounselorId: uuid("assigned_counselor_id"),
  progressResetCount: integer("progress_reset_count").notNull().default(0),
  stripeCustomerId: varchar("stripe_customer_id", { length: 255 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  lastLoginAt: timestamp("last_login_at"),
});

// ─── Counselor Profiles ──────────────────────────────────
export const counselorProfiles = pgTable("counselor_profiles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  maxClients: integer("max_clients").notNull().default(30),
  invitationCode: varchar("invitation_code", { length: 20 }).unique(),
  speciality: text("speciality"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ─── Counselor Assignments ───────────────────────────────
export const counselorAssignments = pgTable("counselor_assignments", {
  id: uuid("id").primaryKey().defaultRandom(),
  counselorId: uuid("counselor_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  clientId: uuid("client_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  assignedAt: timestamp("assigned_at").notNull().defaultNow(),
});

// ─── Relations ───────────────────────────────────────────
export const usersRelations = relations(users, ({ one, many }) => ({
  counselorProfile: one(counselorProfiles, {
    fields: [users.id],
    references: [counselorProfiles.userId],
  }),
  assignedCounselor: one(users, {
    fields: [users.assignedCounselorId],
    references: [users.id],
    relationName: "counselor",
  }),
  clientAssignments: many(counselorAssignments, { relationName: "counselorClients" }),
  assignedToMe: many(counselorAssignments, { relationName: "clientCounselor" }),
}));

export const counselorAssignmentsRelations = relations(counselorAssignments, ({ one }) => ({
  counselor: one(users, {
    fields: [counselorAssignments.counselorId],
    references: [users.id],
    relationName: "counselorClients",
  }),
  client: one(users, {
    fields: [counselorAssignments.clientId],
    references: [users.id],
    relationName: "clientCounselor",
  }),
}));
