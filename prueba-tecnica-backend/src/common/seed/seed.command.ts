import { Command, CommandRunner } from 'nest-commander';
import { SeedService } from './seed.service';
import { Logger, Injectable } from '@nestjs/common';

// It's a service that can be 
// injected into other components of the application
@Injectable()
// a command that can be run from the command line
// and its name is 'seed'
@Command({
  name: 'seed',
  description: 'Populate the database with initial data (preserving users)',
})
// I'm inheriting functionality from CommandRunner
// which is a base class for all commands
export class SeedCommand extends CommandRunner {
  // I set up a a logging system
  private readonly logger = new Logger(SeedCommand.name);
  
  // when this command is created, I need a SeedService
  // to do the actual work of populating the database
  constructor(private readonly seedService: SeedService) {
    super();
  }

  // This is the main method that will be executed
  // when the command is run
  async run(): Promise<void> {
    try {
      this.logger.log('Starting database population...');
      await this.seedService.seedDatabase();
      this.logger.log('Database populated successfully!');
    } catch (error) {
      this.logger.error(`Failed to populate database: ${error.message}`);
      if (error.stack) {
        this.logger.error(error.stack);
      }
      process.exit(1);
    }
  }
}
