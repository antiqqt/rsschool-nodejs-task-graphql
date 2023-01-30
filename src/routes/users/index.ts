import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<UserEntity[]> {
    return await this.db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params;
      const user = await this.db.users.findOne({ key: 'id', equals: id });
      if (!user) throw this.httpErrors.notFound();

      return user;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      return await this.db.users.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id: userId } = request.params;
      const user = await this.db.users.findOne({ key: 'id', equals: userId });
      if (!user) throw this.httpErrors.badRequest();

      const [posts, subscriptions, profile] = await Promise.all([
        this.db.posts.findMany({ key: 'userId', equals: userId }),
        this.db.users.findMany({
          key: 'subscribedToUserIds',
          inArray: userId,
        }),
        this.db.profiles.findOne({ key: 'userId', equals: userId }),
      ]);

      await Promise.all(
        posts.map(async (post) => this.db.posts.delete(post.id))
      );

      await Promise.all(
        subscriptions.map(async (sub) =>
          this.db.users.change(sub.id, {
            subscribedToUserIds: sub.subscribedToUserIds.filter(
              (id) => id !== userId
            ),
          })
        )
      );

      if (profile) await this.db.profiles.delete(profile.id);

      return await this.db.users.delete(userId);
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id: userId } = request.params;
      const { userId: targetId } = request.body;
      const user = await this.db.users.findOne({ key: 'id', equals: userId });
      if (!user) throw this.httpErrors.notFound();

      const target = await this.db.users.findOne({
        key: 'id',
        equals: targetId,
      });
      if (!target) throw this.httpErrors.badRequest();

      return this.db.users.change(targetId, {
        subscribedToUserIds: [...target.subscribedToUserIds, userId],
      });
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id: userId } = request.params;
      const { userId: targetId } = request.body;
      const user = await this.db.users.findOne({ key: 'id', equals: userId });
      if (!user) throw this.httpErrors.notFound();

      const target = await this.db.users.findOne({
        key: 'id',
        equals: targetId,
      });
      if (!target) throw this.httpErrors.badRequest();
      if (!target.subscribedToUserIds.includes(userId))
        throw this.httpErrors.badRequest();

      return this.db.users.change(targetId, {
        subscribedToUserIds: target.subscribedToUserIds.filter(
          (id) => id !== userId
        ),
      });
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<UserEntity> {
      const { id } = request.params;
      const user = await this.db.users.findOne({ key: 'id', equals: id });
      if (!user) throw this.httpErrors.badRequest();

      return this.db.users.change(id, {
        ...request.body,
      });
    }
  );
};

export default plugin;
