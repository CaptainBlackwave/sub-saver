import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull(),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
  plaidAccessTokenEncrypted: text("plaid_access_token_encrypted"),
  plaidItemId: text("plaid_item_id"),
});

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  sessionToken: text("session_token").notNull(),
  userId: text("user_id").notNull(),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
});

export const verificationTokens = sqliteTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
});

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "timestamp" }),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey().$defaultFn(() => generateId()),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  merchantVariants: text("merchant_variants"),
  monthlyCost: real("monthly_cost").notNull(),
  category: text("category"),
  logo: text("logo"),
  cancelUrl: text("cancel_url"),
  websiteUrl: text("website_url"),
  status: text("status").notNull().default("active"),
  lastUsedDate: integer("last_used_date", { mode: "timestamp" }),
  cancelDate: integer("cancel_date", { mode: "timestamp" }),
  nextBillingDate: integer("next_billing_date", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const events = sqliteTable("events", {
  id: text("id").primaryKey().$defaultFn(() => generateId()),
  userId: text("user_id").notNull(),
  subscriptionId: text("subscription_id"),
  eventType: text("event_type").notNull(),
  amount: real("amount"),
  description: text("description"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const goals = sqliteTable("goals", {
  id: text("id").primaryKey().$defaultFn(() => generateId()),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  targetAmount: real("target_amount").notNull(),
  currentAmount: real("current_amount").notNull().default(0),
  isCompleted: integer("is_completed", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const trials = sqliteTable("trials", {
  id: text("id").primaryKey().$defaultFn(() => generateId()),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  merchantName: text("merchant_name"),
  monthlyCostAfterTrial: real("monthly_cost_after_trial"),
  trialEndDate: integer("trial_end_date", { mode: "timestamp" }).notNull(),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
