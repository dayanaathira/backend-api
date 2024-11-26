import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { LoggingService } from './logging/logging.service';
import * as morgan from 'morgan';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DbMigrationService } from './database/db-migration/db-migration.service';

async function bootstrap() {
  const port = process.env.PORT || 3404;

  const app = await NestFactory.create(AppModule, {
    // enabled log level
    logger: ['error', 'warn', 'log'],
  });

  app.enableCors();

  // Get the db Migration service
  const dbMigrationService = app.get(DbMigrationService);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.getHttpAdapter().getInstance().set('etag', false);

  const loggingService = app.get(LoggingService);

  // Configure Morgan to use our custom logger with the http severity
  app.use(morgan(
    ':method :url :status :res[content-length] - :response-time ms',
    {
      stream: {
        write: (message: string) =>
          loggingService
            .getLogger()
            .child({ label: 'API' })
            .http(message.trim()),
      },
    },
  ));

  // Configure Swagger documentation, Create the Swagger document & Set up Swagger UI if env has swagger set to true
  if (process.env.swagger === 'true') {
    const config = new DocumentBuilder()
      .setTitle('Swagger UI')
      .setVersion(process.env.npm_package_version)
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
  }

  // Checking application
  try {
    // Run migrations before starting the app
    // await dbMigrationService.runMigrations();

    await app.listen(port, () => {
      Logger.log(`Server is listening on port: ${port}`)
    });
  } catch (error) {
    Logger.error(`Error starting application:`, error && error.message);
    process.exit(1);
  }

}
bootstrap();
