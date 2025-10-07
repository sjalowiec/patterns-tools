import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGaugeCalculationSchema } from "@shared/schema";
import { z } from "zod";
import path from "path";

export async function registerRoutes(app: Express): Promise<Server> {
  // Download route for blanket wizard dist files
  app.get("/download-blanket-wizard", (req, res) => {
    const filePath = path.join(process.cwd(), "blanket-wizard", "blanket-wizard-dist.tar.gz");
    res.download(filePath, "blanket-wizard-dist.tar.gz", (err) => {
      if (err) {
        console.error("Download error:", err);
        res.status(404).send("File not found");
      }
    });
  });
  // Gauge calculations routes
  app.post("/api/calculations", async (req, res) => {
    try {
      const validationResult = insertGaugeCalculationSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          error: "Invalid input", 
          details: validationResult.error.issues 
        });
      }

      const calculation = await storage.createGaugeCalculation(validationResult.data);
      res.json(calculation);
    } catch (error) {
      console.error("Error creating gauge calculation:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/calculations/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const calculation = await storage.getGaugeCalculation(id);
      
      if (!calculation) {
        return res.status(404).json({ error: "Calculation not found" });
      }
      
      res.json(calculation);
    } catch (error) {
      console.error("Error getting gauge calculation:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/calculations", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const calculations = await storage.getRecentGaugeCalculations(limit);
      res.json(calculations);
    } catch (error) {
      console.error("Error getting recent calculations:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
