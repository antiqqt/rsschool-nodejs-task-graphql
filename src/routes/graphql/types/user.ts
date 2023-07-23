import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import {
  changeUserByIdSchema,
  createUserSchema,
  userSchema,
} from '../../users/schemas.js';
import { GQLContext, extractType } from '../gqlSchema.js';
import { PostType } from './post.js';
import { ProfileType } from './profile.js';
import { UUIDType } from './uuid.js';
import { Static } from '@sinclair/typebox';

type Source = extractType<typeof userSchema>;

export const UserType: GraphQLObjectType<Source, GQLContext> = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },

    posts: {
      type: new GraphQLList(PostType),
      resolve: async (user, _args, context) => {
        return context.db.post.findMany({ where: { authorId: user.id } });
      },
    },
    profile: {
      type: ProfileType,
      resolve: async (user, _args, context) => {
        return context.db.profile.findUnique({ where: { userId: user.id } });
      },
    },
    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async (user, _args, context) => {
        return context.db.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: user.id,
              },
            },
          },
        });
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (user, _args, context) => {
        return context.db.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: user.id,
              },
            },
          },
        });
      },
    },
  }),
});

export type CreateUserInput = Static<(typeof createUserSchema)['body']>;
export type ChangeUserInput = Static<(typeof changeUserByIdSchema)['body']>;

export const CreateUserInputType = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

export const ChangeUserInputType = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});
