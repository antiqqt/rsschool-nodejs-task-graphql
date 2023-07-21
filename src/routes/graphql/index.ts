import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { graphql } from 'graphql';
import { createGqlResponseSchema, gqlResponseSchema } from './schemas.js';
import { GQLContext, GQLSchema } from './types/gqlSchema.js';

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
