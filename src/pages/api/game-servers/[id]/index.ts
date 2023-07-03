import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { gameServerValidationSchema } from 'validationSchema/game-servers';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.game_server
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getGameServerById();
    case 'PUT':
      return updateGameServerById();
    case 'DELETE':
      return deleteGameServerById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getGameServerById() {
    const data = await prisma.game_server.findFirst(convertQueryToPrismaUtil(req.query, 'game_server'));
    return res.status(200).json(data);
  }

  async function updateGameServerById() {
    await gameServerValidationSchema.validate(req.body);
    const data = await prisma.game_server.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteGameServerById() {
    const data = await prisma.game_server.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
