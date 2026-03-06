import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const links = pgTable("links", {
  id: serial("id").primaryKey(),
  user_email: text("user_email").notNull(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertLinkSchema = createInsertSchema(links).pick({
  title: true,
  url: true,
  description: true,
});

export const updateLinkSchema = insertLinkSchema.partial();

export type InsertLink = z.infer<typeof insertLinkSchema>;
export type UpdateLink = z.infer<typeof updateLinkSchema>;
export type Link = typeof links.$inferSelect;

export type CreateLinkRequest = InsertLink;
export type UpdateLinkRequest = UpdateLink;
export type LinkResponse = Link;