import { sql } from "drizzle-orm";
import { pgTable, text, varchar, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const gaugeCalculations = pgTable("gauge_calculations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  units: text("units").notNull(), // 'inches' or 'centimeters'
  stitchGauge: real("stitch_gauge").notNull(),
  rowGauge: real("row_gauge").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertGaugeCalculationSchema = createInsertSchema(gaugeCalculations).pick({
  units: true,
  stitchGauge: true,
  rowGauge: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertGaugeCalculation = z.infer<typeof insertGaugeCalculationSchema>;
export type GaugeCalculation = typeof gaugeCalculations.$inferSelect;
