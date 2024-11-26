import { applyDecorators, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

export function CustomApiResponse(summary: string, description: string, statusCode: number) {
  return applyDecorators(
    ApiOperation({ summary, description }),
    ApiResponse({ status: statusCode, description: 'Successful.' }),
    ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request with error message.' }),
    ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized request.' }),
    ApiResponse({ status: HttpStatus.INTERNAL_SERVER_ERROR, description: 'Internal Server Error.' }),
  );
}