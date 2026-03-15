import {
  pgTable,
  uuid,
  text,
  varchar,
  timestamp,
  integer,
  jsonb,
  index,
  uniqueIndex,
  real,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

// ─── Career Categories ───────────────────────────────────
export const careerCategories = pgTable("career_categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  nameFr: text("name_fr").notNull(),
  nameTr: text("name_tr").notNull(),
  nameEn: text("name_en").notNull(),
  icon: varchar("icon", { length: 50 }),
  sortOrder: integer("sort_order").notNull().default(0),
});

// ─── Careers ─────────────────────────────────────────────
export const careers = pgTable(
  "careers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    code: varchar("code", { length: 20 }).notNull().unique(),
    categoryId: uuid("category_id").references(() => careerCategories.id),
    nameFr: text("name_fr").notNull(),
    nameTr: text("name_tr"),
    nameEn: text("name_en"),
    descriptionFr: text("description_fr"),
    descriptionTr: text("description_tr"),
    descriptionEn: text("description_en"),
    educationLevel: varchar("education_level", { length: 50 }),
    riasecScores: jsonb("riasec_scores").$type<Record<string, number>>(),
    bigfiveScores: jsonb("bigfive_scores").$type<Record<string, number>>(),
    valuesScores: jsonb("values_scores").$type<Record<string, number>>(),
    salaryMin: integer("salary_min"),
    salaryMax: integer("salary_max"),
    salaryMedian: integer("salary_median"),
    growthOutlook: varchar("growth_outlook", { length: 50 }),
    marketDemand: varchar("market_demand", { length: 50 }),
    skillsRequired: jsonb("skills_required").$type<string[]>(),
    softSkills: jsonb("soft_skills").$type<string[]>(),
    hardSkills: jsonb("hard_skills").$type<string[]>(),
    aiImpact: jsonb("ai_impact").$type<{
      overallScore: number;
      impactLevel: string;
      automatableTasks: { task: string; tool: string }[];
      resistantTasks: { task: string; reason: string }[];
      futureSkills: { skill: string; importance: string }[];
      opportunitiesFr: string;
      opportunitiesTr: string;
      threatsFr: string;
      threatsTr: string;
    }>(),
    // pgvector for semantic career matching
    // embedding: vector("embedding", { dimensions: 1536 }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("careers_category_idx").on(table.categoryId),
    index("careers_education_idx").on(table.educationLevel),
  ],
);

// ─── Career Favorites ────────────────────────────────────
export const careerFavorites = pgTable(
  "career_favorites",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    careerId: uuid("career_id")
      .notNull()
      .references(() => careers.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex("favorites_user_career_idx").on(table.userId, table.careerId),
  ],
);

// ─── Career Priorities ───────────────────────────────────
export const careerPriorities = pgTable(
  "career_priorities",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    careerId: uuid("career_id")
      .notNull()
      .references(() => careers.id, { onDelete: "cascade" }),
    rank: integer("rank").notNull(),
    status: varchar("status", { length: 20 }).notNull().default("exploring"),
    notes: text("notes"),
    matchScore: real("match_score"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("priorities_user_rank_idx").on(table.userId, table.rank),
    uniqueIndex("priorities_user_career_idx").on(table.userId, table.careerId),
  ],
);

// ─── Career Match Cache ──────────────────────────────────
export const careerMatchCache = pgTable(
  "career_match_cache",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    cacheKey: varchar("cache_key", { length: 64 }).notNull(),
    results: jsonb("results").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    expiresAt: timestamp("expires_at").notNull(),
  },
  (table) => [
    uniqueIndex("match_cache_user_key_idx").on(table.userId, table.cacheKey),
  ],
);

// ─── Relations ───────────────────────────────────────────
export const careersRelations = relations(careers, ({ one, many }) => ({
  category: one(careerCategories, {
    fields: [careers.categoryId],
    references: [careerCategories.id],
  }),
  favorites: many(careerFavorites),
  priorities: many(careerPriorities),
}));

export const careerFavoritesRelations = relations(careerFavorites, ({ one }) => ({
  user: one(users, { fields: [careerFavorites.userId], references: [users.id] }),
  career: one(careers, { fields: [careerFavorites.careerId], references: [careers.id] }),
}));

export const careerPrioritiesRelations = relations(careerPriorities, ({ one }) => ({
  user: one(users, { fields: [careerPriorities.userId], references: [users.id] }),
  career: one(careers, { fields: [careerPriorities.careerId], references: [careers.id] }),
}));
