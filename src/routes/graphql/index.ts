import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql, validate, parse } from 'graphql';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GQLContext, GQLSchema } from './gqlSchema.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma, httpErrors } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(request) {
      const { query, variables } = request.body;

      const validationErrors = validate(GQLSchema, parse(query));
      const hasValidationErrors = validationErrors.length > 0;

      if (hasValidationErrors) {
        return { errors: validationErrors };
      }

      const context: GQLContext = { db: prisma, httpErrors };

      return graphql({
        schema: GQLSchema,
        source: query,
        variableValues: variables,
        contextValue: context,
      });
    },
  });
};

export default plugin;
