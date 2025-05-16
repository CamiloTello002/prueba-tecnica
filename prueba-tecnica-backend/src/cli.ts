import { CommandFactory } from 'nest-commander';
import { CLIModule } from './cli.module';

// the entry point for running CLI commands
async function bootstrap() {
  try {
    await CommandFactory.run(CLIModule, {
      logger: ['error', 'warn', 'log', 'debug', 'verbose']
    });
  } catch (error) {
    console.error('CLI Command Error:', error);
    process.exit(1);
  }
}

bootstrap();
