import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { postSchema } from '../../posts/schemas.js';
import { GQLContext, extractType } from './gqlSchema.js';
import { UUIDType } from './uuid.js';
import { UserType } from './user.js';

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
