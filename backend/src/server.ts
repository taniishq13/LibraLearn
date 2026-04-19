import "dotenv/config";
import createApp from "./app";
import { config } from "./config";

const app = createApp();

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`LibraLearn backend running on port ${PORT}`);
});
