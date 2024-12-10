"use server";

import prisma from "@/app/services/prisma";

export async function create({
  data,
}: {
  data: (typeof prisma.customGloss.create)["arguments"]["data"];
}) {
  return await prisma.customGloss.create({
    data,
  });
}

interface IRead {
  id?: string;
  userId?: string;
  recent?: boolean;
}

export async function read({ id, userId, recent }: IRead) {
  const globalInclude = {
    files: true,
    alerts: true,
    customGlossTaxes: true,
    customGlossNonTariffRestrictionNRegulations: true,
  };

  if (id && userId) {
    return await prisma.customGloss.findUnique({
      where: { id, userId },
      include: globalInclude,
    });
  }

  if (userId && recent) {
    return await prisma.customGloss.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
  }

  if (userId) {
    return await prisma.customGloss.findMany({
      where: { userId },
    });
  }
}
