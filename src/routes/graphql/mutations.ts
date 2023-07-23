import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { GQLContext } from './gqlSchema.js';
import {
  ChangePostInput,
  ChangePostInputType,
  CreatePostInput,
  CreatePostInputType,
  PostType,
} from './types/post.js';
import {
  ChangeProfileInput,
  ChangeProfileInputType,
  CreateProfileInput,
  CreateProfileInputType,
  ProfileType,
} from './types/profile.js';
import {
  ChangeUserInput,
  ChangeUserInputType,
  CreateUserInput,
  CreateUserInputType,
  UserType,
} from './types/user.js';
import { UUIDType } from './types/uuid.js';

export const Mutations = new GraphQLObjectType<unknown, GQLContext>({
  name: 'Mutations',
  fields: {
    createUser: {
      type: UserType,
      args: {
        dto: { type: new GraphQLNonNull(CreateUserInputType) },
      },
      resolve: async (_, { dto }: { dto: CreateUserInput }, context) => {
        return context.db.user.create({ data: dto });
      },
    },
    changeUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeUserInputType) },
      },
      resolve: async (_, { dto, id }: { dto: ChangeUserInput; id: string }, context) => {
        return context.db.user.update({ where: { id }, data: dto });
      },
    },
    deleteUser: {
      type: new GraphQLNonNull(GraphQLBoolean),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }: { id: string }, context) => {
        try {
          await context.db.user.delete({ where: { id } });
          return true;
        } catch {
          return false;
        }
      },
    },
    createPost: {
      type: PostType,
      args: {
        dto: { type: new GraphQLNonNull(CreatePostInputType) },
      },
      resolve: async (_, { dto }: { dto: CreatePostInput }, context) => {
        return context.db.post.create({ data: dto });
      },
    },
    changePost: {
      type: PostType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangePostInputType) },
      },
      resolve: async (_, { dto, id }: { dto: ChangePostInput; id: string }, context) => {
        return context.db.post.update({ where: { id }, data: dto });
      },
    },
    deletePost: {
      type: new GraphQLNonNull(GraphQLBoolean),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }: { id: string }, context) => {
        try {
          await context.db.post.delete({ where: { id } });
          return true;
        } catch (error) {
          return false;
        }
      },
    },
    createProfile: {
      type: ProfileType,
      args: {
        dto: { type: new GraphQLNonNull(CreateProfileInputType) },
      },
      resolve: async (_, { dto }: { dto: CreateProfileInput }, context) => {
        return context.db.profile.create({ data: dto });
      },
    },
    changeProfile: {
      type: ProfileType,
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
        dto: { type: new GraphQLNonNull(ChangeProfileInputType) },
      },
      resolve: async (
        _,
        { dto, id }: { dto: ChangeProfileInput; id: string },
        context,
      ) => {
        return context.db.profile.update({ where: { id }, data: dto });
      },
    },
    deleteProfile: {
      type: new GraphQLNonNull(GraphQLBoolean),
      args: {
        id: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (_, { id }: { id: string }, context) => {
        try {
          await context.db.profile.delete({ where: { id } });
          return true;
        } catch (error) {
          return false;
        }
      },
    },

    subscribeTo: {
      type: UserType,
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _,
        { userId, authorId }: { userId: string; authorId: string },
        context,
      ) => {
        return context.db.user.update({
          where: {
            id: userId,
          },
          data: {
            userSubscribedTo: {
              create: {
                authorId,
              },
            },
          },
        });
      },
    },
    unsubscribeFrom: {
      type: new GraphQLNonNull(GraphQLBoolean),
      args: {
        userId: { type: new GraphQLNonNull(UUIDType) },
        authorId: { type: new GraphQLNonNull(UUIDType) },
      },
      resolve: async (
        _,
        { userId, authorId }: { userId: string; authorId: string },
        context,
      ) => {
        try {
          await context.db.subscribersOnAuthors.delete({
            where: {
              subscriberId_authorId: {
                subscriberId: userId,
                authorId,
              },
            },
          });
          return true;
        } catch (error) {
          return false;
        }
      },
    },
  },
});
