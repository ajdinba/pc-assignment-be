import { FastifySchema } from 'fastify'
import {
    OpenApiResponseSchema,
    OpenApiType,
    ResponseSchema,
} from '../responses.js'

type requestDataSchema = Record<string, string>

// Class with utility methods to construct a `FastifySchema` object, reducing the need to write repetitive schema definitions
// For this app, this functionality isn't really necessary since it's quite simple, but it would certainly be useful for more complex use cases, so this is mostly for demonstrative purposes
export class FastifySchemaBuilder {
    // Initialize with an empty `response` object so that it can be modified later with `addResponse`
    private schema: FastifySchema = {
        response: {},
    }

    // Adds a specified response to the object
    // It's available through two overloads:
    // - One for when the response is an object (and so, has properties)
    // - One for when it's not (and so, it's just a type)
    addResponse(
        statusCode: number,
        description: string,
        type: Exclude<OpenApiType, OpenApiType.OBJECT>
    ): this
    addResponse(
        statusCode: number,
        description: string,
        type: OpenApiType.OBJECT,
        properties: OpenApiResponseSchema
    ): this

    addResponse(
        statusCode: number,
        description: string,
        type: OpenApiType,
        properties?: OpenApiResponseSchema
    ): this {
        // It's of `unknown` type when it's first initialized, so a cast is necessary since we want to always treat it as `Record<number, ResponseSchema>` when using it
        let response = this.schema.response as Record<number, ResponseSchema>

        if (type === OpenApiType.OBJECT) {
            let s: ResponseSchema = {
                description: description,
                type: type,
            } as any as Extract<ResponseSchema, { type: OpenApiType.OBJECT }> // Temporarily recast to `any` and back to allow for the assignment of `properties`

            // This will always be passed due to the overload signature, so we can safely cast it so it's not treated as nullable anymore
            properties = properties as OpenApiResponseSchema

            // Perform the transform, e.g.
            // { id: 'number' } into { id: { type: 'number' } }
            const p: Record<string, { type: OpenApiType }> = {}
            for (const [key, value] of Object.entries(properties)) {
                p[key] = { type: value }
            }

            s.properties = p
            response[statusCode] = s
        } else {
            // `else` is necessary for automatic type inference
            let s: ResponseSchema = {
                description: description,
                type: type,
            }
            response[statusCode] = s
        }

        return this
    }

    // Transforms a simple `requestDataSchema` object into the expected "mold" for the `FastifySchema` object
    private transformRequestSchema(schema: requestDataSchema) {
        const p: Record<string, { type: string }> = {}
        for (const [key, value] of Object.entries(schema)) {
            p[key] = { type: value }
        }

        return {
            type: 'object',
            properties: p,
        }
    }

    setBody(schema: requestDataSchema) {
        this.schema.body = this.transformRequestSchema(schema)
        return this
    }

    setQuerystring(schema: requestDataSchema) {
        this.schema.querystring = this.transformRequestSchema(schema)
        return this
    }

    setParams(schema: requestDataSchema) {
        this.schema.body = this.transformRequestSchema(schema)
        return this
    }

    setHeaders(schema: requestDataSchema) {
        this.schema.body = this.transformRequestSchema(schema)
        return this
    }

    build() {
        return this.schema
    }
}
