import "dotenv/config";
import createApp from "./app";
import { config } from "./config";
import { mongoConnection } from "./config/mongoConnection";

const app = createApp();

const startServer = async (): Promise<void> => {
  try {
    await mongoConnection.connect();

    app.listen(config.port, "0.0.0.0", () => {
      console.log(`LibraLearn backend running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
};

void startServer();
