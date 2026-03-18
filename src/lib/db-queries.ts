import { auth } from "@/auth";
import { db, eq, and } from "@/db";
import { subscriptions, events, goals, trials, users, accounts } from "@/db/schema";
import { redirect } from "next/navigation";

export async function getCurrentUserId(): Promise<string> {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/api/auth/signin");
  }
  
  return session.user.id;
}

export async function getUserSubscriptions(userId: string) {
  return db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, userId));
}

export async function getUserEvents(userId: string) {
  return db
    .select()
    .from(events)
    .where(eq(events.userId, userId));
}

export async function getUserGoals(userId: string) {
  return db
    .select()
    .from(goals)
    .where(eq(goals.userId, userId));
}

export async function getUserTrials(userId: string) {
  return db
    .select()
    .from(trials)
    .where(eq(trials.userId, userId));
}

export async function getUserAccount(userId: string) {
  return db
    .select()
    .from(accounts)
    .where(eq(accounts.userId, userId));
}

export async function createSubscription(data: {
  userId: string;
  name: string;
  merchantVariants?: string;
  monthlyCost: number;
  category?: string;
  logo?: string;
  cancelUrl?: string;
  websiteUrl?: string;
}) {
  return db.insert(subscriptions).values(data);
}

export async function updateSubscription(
  id: string,
  userId: string,
  data: Partial<typeof subscriptions.$inferInsert>
) {
  return db
    .update(subscriptions)
    .set(data)
    .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)));
}

export async function deleteSubscription(id: string, userId: string) {
  return db
    .delete(subscriptions)
    .where(and(eq(subscriptions.id, id), eq(subscriptions.userId, userId)));
}

export async function createEvent(data: {
  userId: string;
  subscriptionId?: string;
  eventType: string;
  amount?: number;
  description?: string;
}) {
  return db.insert(events).values(data);
}

export async function createGoal(data: {
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount?: number;
}) {
  return db.insert(goals).values(data);
}

export async function updateGoal(
  id: string,
  userId: string,
  data: Partial<typeof goals.$inferInsert>
) {
  return db
    .update(goals)
    .set(data)
    .where(and(eq(goals.id, id), eq(goals.userId, userId)));
}

export async function createTrial(data: {
  userId: string;
  name: string;
  merchantName?: string;
  monthlyCostAfterTrial?: number;
  trialEndDate: Date;
}) {
  return db.insert(trials).values(data);
}

export async function getUserByEmail(email: string) {
  return db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
}
