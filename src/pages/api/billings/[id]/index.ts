import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { billingValidationSchema } from 'validationSchema/billings';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.billing
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getBillingById();
    case 'PUT':
      return updateBillingById();
    case 'DELETE':
      return deleteBillingById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getBillingById() {
    const data = await prisma.billing.findFirst(convertQueryToPrismaUtil(req.query, 'billing'));
    return res.status(200).json(data);
  }

  async function updateBillingById() {
    await billingValidationSchema.validate(req.body);
    const data = await prisma.billing.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteBillingById() {
    const data = await prisma.billing.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
