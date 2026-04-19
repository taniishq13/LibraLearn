import mongoose from "mongoose";
import { config } from "./index";

class MongoConnection {
  private static instance: MongoConnection | null = null;
  private isConnected = false;

  private constructor() {}

  static getInstance(): MongoConnection {
    if (!MongoConnection.instance) {
      MongoConnection.instance = new MongoConnection();
    }

    return MongoConnection.instance;
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    await mongoose.connect(config.mongoUri);
    this.isConnected = true;
    console.log("MongoDB connected");
  }
}

export const mongoConnection = MongoConnection.getInstance();
