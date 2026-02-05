import { app } from './app.js';
import { logger } from './utils/logger.js';
import { env } from './config/index.js';

const PORT = env.PORT;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${env.NODE_ENV}`);
});
