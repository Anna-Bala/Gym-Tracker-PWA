import app from "./app";
import { redisClient } from "./clients";
import { PORT } from "./secrets";

redisClient.connect().catch(console.error);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
