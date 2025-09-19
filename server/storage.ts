import { type User, type InsertUser, type GaugeCalculation, type InsertGaugeCalculation } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createGaugeCalculation(calculation: InsertGaugeCalculation): Promise<GaugeCalculation>;
  getGaugeCalculation(id: string): Promise<GaugeCalculation | undefined>;
  getRecentGaugeCalculations(limit?: number): Promise<GaugeCalculation[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private gaugeCalculations: Map<string, GaugeCalculation>;

  constructor() {
    this.users = new Map();
    this.gaugeCalculations = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createGaugeCalculation(insertCalculation: InsertGaugeCalculation): Promise<GaugeCalculation> {
    const id = randomUUID();
    const calculation: GaugeCalculation = { 
      ...insertCalculation, 
      id,
      createdAt: new Date()
    };
    this.gaugeCalculations.set(id, calculation);
    return calculation;
  }

  async getGaugeCalculation(id: string): Promise<GaugeCalculation | undefined> {
    return this.gaugeCalculations.get(id);
  }

  async getRecentGaugeCalculations(limit: number = 10): Promise<GaugeCalculation[]> {
    const calculations = Array.from(this.gaugeCalculations.values());
    return calculations
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
