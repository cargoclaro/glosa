import { reset } from 'drizzle-seed';
import { db } from './';
import * as schema from './schema';

await reset(db, schema);

// Since the connection doesn't close automatically, (for good reason)
// we log a message to know when the reset is done, since the terminal will hang
// due to the connection not closing.
// biome-ignore lint/suspicious/noConsoleLog: <explanation>
// biome-ignore lint/suspicious/noConsole: <explanation>
console.log('Database reset');
