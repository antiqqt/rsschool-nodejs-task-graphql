import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (request, reply): Promise<ProfileEntity[]> {
    return await this.db.profiles.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { id } = request.params;
      const profile = await this.db.profiles.findOne({ key: 'id', equals: id });
      if (!profile) throw this.httpErrors.notFound();

      return profile;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { userId, memberTypeId } = request.body;

      const [user, memberType, profile] = await Promise.all([
        this.db.users.findOne({ key: 'id', equals: userId }),
        this.db.memberTypes.findOne({ key: 'id', equals: memberTypeId }),
        this.db.profiles.findOne({
          key: 'userId',
          equals: userId,
        }),
      ]);

      if (!user || !memberType || profile) throw this.httpErrors.badRequest();

      return await this.db.profiles.create(request.body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { id } = request.params;
      const profile = await this.db.profiles.findOne({ key: 'id', equals: id });
      if (!profile) throw this.httpErrors.badRequest();

      return await this.db.profiles.delete(id);
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request, reply): Promise<ProfileEntity> {
      const { id } = request.params;
      const profile = await this.db.profiles.findOne({ key:'id', equals: id });
      if (!profile) throw this.httpErrors.badRequest();

      return await this.db.profiles.change(id, request.body);
    }
  );
};

export default plugin;
