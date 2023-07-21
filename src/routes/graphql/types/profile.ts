import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';

import { profileSchema } from '../../profiles/schemas.js';
import { GQLContext, extractType } from './gqlSchema.js';
import { UUIDType } from './uuid.js';
import { UserType } from './user.js';
import { MemberType } from './memberType.js';

type Source = extractType<typeof profileSchema>;

export const ProfileType: GraphQLObjectType<Source, GQLContext> = new GraphQLObjectType({
  name: 'Profile',
  fields: () => ({
    id: { type: UUIDType },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
    userId: { type: UUIDType },
    memberTypeId: { type: UUIDType },

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
