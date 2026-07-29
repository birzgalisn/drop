import { Global, Module } from '@nestjs/common';

import { drizzleConfig } from './drizzle.config';
import { DrizzleService } from './services/drizzle.service';

const drizzleEnvFromConfig = drizzleConfig.asProvider();

@Global()
@Module({
  imports: [...drizzleEnvFromConfig.imports],
  providers: [DrizzleService],
  exports: [DrizzleService],
})
export class DrizzleModule {}
