import { Injectable } from '@nestjs/common';
import * as Winston from 'winston';
import 'winston-daily-rotate-file';

/**
 * Service responsible for logging messages using Winston.
 */
@Injectable()
export class LoggingService {
   /**
    * The Winston logger instance used for logging messages.
    */
   private logger: Winston.Logger;

   /**
    * Format data for logging.
    */
   data = Winston.format;

   /**
    * Custom log message format.
    */
   private myFormat = Winston.format.printf(({ level, message, label, timestamp }) => {
      return `${timestamp} [${label}] ${level}: ${message}`;
   });

   /**
    * Transport for logging application logs to daily rotated files.
    */
   fileTransport = new Winston.transports.DailyRotateFile({
      filename: 'logs/applications/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '7d'
   });

   /**
    * Transport for logging error logs to daily rotated files.
    */
   errorFileTransport = new Winston.transports.DailyRotateFile({
      filename: 'logs/errors/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '7d',
      level: 'error'
   });

   /**
    * Transport for logging exceptions to daily rotated files.
    */
   expTransport = new Winston.transports.DailyRotateFile({
      filename: 'logs/exceptions/exceptions-%DATE%.log',
      datePattern: 'YYYY-MM-DD-HH',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '7d'
   });

   /**
    * Initializes the logger instance when the module is initialized.
    */
   constructor() {
      this.onModuleInit();
   }

   /**
    * Initializes the Winston logger instance with specified configurations.
    */
   onModuleInit() : void {
      process.setMaxListeners(20);
      this.logger = Winston.createLogger({
         level: 'http',
         format: Winston.format.combine(
            Winston.format.timestamp(),
            this.myFormat
         ),
         transports: [
            new Winston.transports.Console({ handleExceptions: true }),
            this.fileTransport,
            this.errorFileTransport
         ],
         exceptionHandlers: [
            this.expTransport
         ],
         exitOnError: false,
      });
   }

   /**
    * Retrieves the Winston logger instance.
    * @returns The Winston logger instance.
    */
   public getLogger() : Winston.Logger {
      return this.logger;
   }

}
