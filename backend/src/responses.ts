// https://swagger.io/docs/specification/v3_0/data-models/data-types/
export enum OpenApiType {
    STRING = 'string',
    NUMBER = 'number',
    INTEGER = 'integer',
    BOOLEAN = 'boolean',
    ARRAY = 'array',
    OBJECT = 'object',
}

// Simplified schema type for OpenAPI responses
export type OpenApiResponseSchema = Record<string, OpenApiType>

// OpenAPI response schema union type, which is either an object with properties or a simple type
export type ResponseSchema =
    | {
          description: string
          type: OpenApiType.OBJECT
          // Include `properties` only when `type` is `ResponseType.OBJECT`
          properties: Record<string, { type: OpenApiType }>
      }
    | {
          description: string
          // Otherwise, exclude it
          type: Exclude<OpenApiType, OpenApiType.OBJECT>
      }
