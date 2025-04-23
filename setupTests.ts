import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { LangfuseExporter } from 'langfuse-vercel';

// Initialize OpenTelemetry Node SDK with LangfuseExporter and auto-instrumentations
const sdk = new NodeSDK({
  traceExporter: new LangfuseExporter(),
  instrumentations: [getNodeAutoInstrumentations()],
});

// Start SDK before tests
sdk.start()

// Gracefully shutdown SDK after tests complete or on process exit
async function shutdown() {
  await sdk.shutdown();
}

process.once('beforeExit', shutdown);
process.once('SIGINT', shutdown);
process.once('SIGTERM', shutdown); 