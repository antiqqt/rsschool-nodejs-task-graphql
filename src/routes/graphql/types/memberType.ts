import {
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType
} from 'graphql';
import { memberTypeSchema } from '../../member-types/schemas.js';
import { GQLContext, extractType } from '../gqlSchema.js';
import { ProfileType } from './profile.js';

type Source = extractType<typeof memberTypeSchema>;

export const MemberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: {
      value: 'basic',
    },
    business: {
      value: 'business',
    },
  },
});

export const MemberType = new GraphQLObjectType<Source, GQLContext>({
  name: 'MemberType',
  fields: () => ({
    id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
    discount: { type: new GraphQLNonNull(GraphQLFloat) },
    postsLimitPerMonth: { type: new GraphQLNonNull(GraphQLInt) },

    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (memberType, _args, context) => {
        return context.db.profile.findMany({ where: { memberTypeId: memberType.id } });
      },
    },
  }),
});
