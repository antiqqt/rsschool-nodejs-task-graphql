import { GraphQLList, GraphQLObjectType } from 'graphql';
import { GQLContext } from './gqlSchema.js';
import { MemberType, MemberTypeIdEnum } from './types/memberType.js';
import { PostType } from './types/post.js';
import { ProfileType } from './types/profile.js';
import { UserType } from './types/user.js';
import { UUIDType } from './types/uuid.js';

export const GQLQueryType = new GraphQLObjectType<unknown, GQLContext>({
  name: 'QueryType',
  fields: {
    memberTypes: {
      type: new GraphQLList(MemberType),
      resolve: async (_source, _args, context) => {
        return context.db.memberType.findMany();
      },
    },
    memberType: {
      type: MemberType,
      args: {
        id: { type: MemberTypeIdEnum },
      },
      resolve: async (_source, args: { id: string }, context) => {
        return context.db.memberType.findUnique({
          where: {
            id: args.id,
          },
        });
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async (_source, _args, context) => {
        return context.db.user.findMany();
      },
    },
    user: {
      type: UserType,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (_source, args: { id: string }, context) => {
        return context.db.user.findUnique({ where: { id: args.id } });
      },
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async (_source, _args, context) => {
        return context.db.post.findMany();
      },
    },
    post: {
      type: PostType,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (_source, args: { id: string }, context) => {
        return context.db.post.findUnique({ where: { id: args.id } });
      },
    },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (_source, _args, context) => {
        return context.db.profile.findMany();
      },
    },
    profile: {
      type: ProfileType,
      args: {
        id: { type: UUIDType },
      },
      resolve: async (_source, args: { id: string }, context) => {
        return context.db.profile.findUnique({ where: { id: args.id } });
      },
    },
  },
});
