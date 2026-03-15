import { pgTable, uuid, text, varchar, timestamp, integer, jsonb, pgEnum, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { users } from "./users";

// ─── Enums ───────────────────────────────────────────────
export const reportStatusEnum = pgEnum("report_status", ["draft", "validated", "published"]);
export const dossierStatusEnum = pgEnum("dossier_status", [
  "draft",
  "generating",
  "generated",
  "validated",
  "published",
]);
export const docTypeEnum = pgEnum("doc_type", ["bulletin", "cv", "diploma", "portfolio", "other"]);
export const docStatusEnum = pgEnum("doc_status", ["uploading", "processing", "processed", "error"]);

// ─── Diagnostic Reports ──────────────────────────────────
export const diagnosticReports = pgTable(
  "diagnostic_reports",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    content: text("content").notNull(),
    contextSnapshot: jsonb("context_snapshot").$type<Record<string, unknown>>(),
    status: reportStatusEnum("status").notNull().default("draft"),
    version: integer("version").notNull().default(1),
    validatedBy: uuid("validated_by").references(() => users.id),
    validatedAt: timestamp("validated_at"),
    publishedAt: timestamp("published_at"),
    advisorNotes: text("advisor_notes"),
    generatedAt: timestamp("generated_at").notNull().defaultNow(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("diagnostic_user_idx").on(table.userId),
    index("diagnostic_status_idx").on(table.userId, table.status),
  ],
);

// ─── Admission Dossiers ──────────────────────────────────
export const admissionDossiers = pgTable(
  "admission_dossiers",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    formationName: text("formation_name").notNull(),
    establishmentName: text("establishment_name"),
    establishmentCity: text("establishment_city"),
    formationUrl: text("formation_url"),
    status: dossierStatusEnum("status").notNull().default("draft"),
    aiDraft: jsonb("ai_draft").$type<{
      overview: string;
      strengths: string[];
      motivationLetter: string;
      cvTips: string[];
      timeline: { month: string; action: string }[];
      schoolSuggestions: string[];
      interviewTips: string[];
    }>(),
    documentUrls: jsonb("document_urls").$type<string[]>().default([]),
    notes: text("notes"),
    counselorNotes: text("counselor_notes"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("dossier_user_idx").on(table.userId)],
);

// ─── Student Documents ───────────────────────────────────
export const documents = pgTable(
  "documents",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    docType: docTypeEnum("doc_type").notNull(),
    filename: text("filename").notNull(),
    url: text("url").notNull(),
    fileKey: varchar("file_key", { length: 512 }),
    mimeType: varchar("mime_type", { length: 100 }),
    fileSize: integer("file_size"),
    extractedText: text("extracted_text"),
    status: docStatusEnum("status").notNull().default("uploading"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("documents_user_idx").on(table.userId),
    index("documents_user_type_idx").on(table.userId, table.docType),
  ],
);

// ─── Relations ───────────────────────────────────────────
export const diagnosticReportsRelations = relations(diagnosticReports, ({ one }) => ({
  user: one(users, { fields: [diagnosticReports.userId], references: [users.id] }),
  validator: one(users, { fields: [diagnosticReports.validatedBy], references: [users.id] }),
}));

export const admissionDossiersRelations = relations(admissionDossiers, ({ one }) => ({
  user: one(users, { fields: [admissionDossiers.userId], references: [users.id] }),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  user: one(users, { fields: [documents.userId], references: [users.id] }),
}));
