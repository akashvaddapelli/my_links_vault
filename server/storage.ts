import { links, type Link, type InsertLink } from "@shared/schema";
import { db } from "./db";
import { desc, eq } from "drizzle-orm";

export interface IStorage {
  getLinks(): Promise<Link[]>;
  createLink(link: InsertLink, userEmail: string): Promise<Link>;
  updateLink(id: number, link: Partial<InsertLink>): Promise<Link>;
}

export class DatabaseStorage implements IStorage {
  async getLinks(): Promise<Link[]> {
    return await db.select().from(links).orderBy(desc(links.created_at));
  }

  async createLink(link: InsertLink, userEmail: string): Promise<Link> {
    const [newLink] = await db
      .insert(links)
      .values({ ...link, user_email: userEmail })
      .returning();
    return newLink;
  }

  async updateLink(id: number, link: Partial<InsertLink>): Promise<Link> {
    const [updatedLink] = await db
      .update(links)
      .set(link)
      .where(eq(links.id, id))
      .returning();
    if (!updatedLink) throw new Error("Link not found");
    return updatedLink;
  }
}

export const storage = new DatabaseStorage();