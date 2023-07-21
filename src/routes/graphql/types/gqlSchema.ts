import { PrismaClient } from '@prisma/client';
import { GraphQLSchema } from 'graphql';
import { GQLQueryType } from '../query.js';

import { HttpErrors } from '@fastify/sensible/lib/httpError.js';
import { MemberType } from './memberType.js';
import { Static, TSchema } from '@sinclair/typebox';

export type GQLContext = {
  db: PrismaClient;
  httpErrors: HttpErrors;
};

export type extractType<S extends TSchema> = Static<S>;

export const GQLSchema = new GraphQLSchema({
  query: GQLQueryType,
  types: [MemberType],
});
