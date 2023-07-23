import {
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';

import { Static } from '@sinclair/typebox';
import { changePostByIdSchema, createPostSchema, postSchema } from '../../posts/schemas.js';
import { GQLContext, extractType } from '../gqlSchema.js';
import { UserType } from './user.js';
import { UUIDType } from './uuid.js';


type Source = extractType<typeof postSchema>;

export const PostType = new GraphQLObjectType<Source, GQLContext>({
  name: 'Post',
  fields: () => ({
    id: { type: UUIDType },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },

    author: {
      type: new GraphQLNonNull(UserType),
      resolve: async (post, _args, context) => {
        return context.db.user.findUnique({ where: { id: post.authorId } });
      },
    },
  }),
});

export type CreatePostInput = Static<(typeof createPostSchema)['body']>;
export type ChangePostInput = Static<(typeof changePostByIdSchema)['body']>;

export const CreatePostInputType = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
  }),
});

export const ChangePostInputType = new GraphQLInputObjectType({
  name: 'ChangePostInput',
  fields: () => ({
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});
