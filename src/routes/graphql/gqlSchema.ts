import { PrismaClient } from '@prisma/client';
import { GraphQLSchema } from 'graphql';
import { GQLQueryType } from './query.js';

import { HttpErrors } from '@fastify/sensible/lib/httpError.js';
import { MemberType } from './types/memberType.js';
import { Static, TSchema } from '@sinclair/typebox';
import { Mutations } from './mutations.js';

export type GQLContext = {
  db: PrismaClient;
  httpErrors: HttpErrors;
};

export type extractType<S extends TSchema> = Static<S>;

export const GQLSchema = new GraphQLSchema({
  query: GQLQueryType,
  types: [MemberType],
  mutation: Mutations,
});
