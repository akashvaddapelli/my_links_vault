import type { Express } from "express";
import { type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import session from "express-session";

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.use(session({
    secret: process.env.SESSION_SECRET || "super-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }));

  app.post(api.auth.login.path, async (req, res) => {
    try {
      // Automatic login for any request
      const email = "munna.chillas@gmail.com";
      req.session.userId = email;
      res.status(200).json({ success: true, email });
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post(api.auth.logout.path, (req, res) => {
    req.session.destroy(() => {
      res.status(200).json({ success: true });
    });
  });

  app.get(api.auth.me.path, (req, res) => {
    if (req.session.userId) {
      res.status(200).json({ email: req.session.userId });
    } else {
      res.status(401).json({ message: "Not logged in" });
    }
  });

  app.get(api.links.list.path, async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const allLinks = await storage.getLinks();
      const userLinks = allLinks.filter(l => l.user_email === req.session.userId);
      res.status(200).json(userLinks);
    } catch (error) {
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.post(api.links.create.path, async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const input = api.links.create.input.parse(req.body);
      const newLink = await storage.createLink(input, req.session.userId);
      res.status(201).json(newLink);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.patch(api.links.update.path, async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    try {
      const id = parseInt(req.params.id);
      const input = api.links.update.input.parse(req.body);
      const updatedLink = await storage.updateLink(id, input);
      res.status(200).json(updatedLink);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  return httpServer;
}