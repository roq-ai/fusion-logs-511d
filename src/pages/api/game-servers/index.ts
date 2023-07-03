import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { gameServerValidationSchema } from 'validationSchema/game-servers';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getGameServers();
    case 'POST':
      return createGameServer();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getGameServers() {
    const data = await prisma.game_server
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'game_server'));
    return res.status(200).json(data);
  }

  async function createGameServer() {
    await gameServerValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.log?.length > 0) {
      const create_log = body.log;
      body.log = {
        create: create_log,
      };
    } else {
      delete body.log;
    }
    const data = await prisma.game_server.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
