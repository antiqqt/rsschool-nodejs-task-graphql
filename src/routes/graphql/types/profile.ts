import {
  GraphQLBoolean,
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql';

import {
  changeProfileByIdSchema,
  createProfileSchema,
  profileSchema,
} from '../../profiles/schemas.js';
import { GQLContext, extractType } from '../gqlSchema.js';
import { MemberType, MemberTypeIdEnum } from './memberType.js';
import { UserType } from './user.js';
import { UUIDType } from './uuid.js';
import { Static } from '@sinclair/typebox';

type Source = extractType<typeof profileSchema>;

export const ProfileType: GraphQLObjectType<Source, GQLContext> = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeIdEnum) },

    user: {
      type: UserType,
      resolve: async (profile, _args, context) => {
        return context.db.user.findUnique({ where: { id: profile.userId } });
      },
    },

    memberType: {
      type: MemberType,
      resolve: async (profile, _args, context) => {
        return context.db.memberType.findUnique({
          where: { id: profile.memberTypeId },
        });
      },
    },
  }),
});

export type CreateProfileInput = Static<(typeof createProfileSchema)['body']>;
export type ChangeProfileInput = Static<(typeof changeProfileByIdSchema)['body']>;

export const CreateProfileInputType = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(MemberTypeIdEnum) },
  }),
});

export const ChangeProfileInputType = new GraphQLInputObjectType({
  name: 'ChangeProfileInput',
  fields: () => ({
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberTypeId: { type: MemberTypeIdEnum },
  }),
});
