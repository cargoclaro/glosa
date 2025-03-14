"use server";

import prisma from "@/app/shared/services/prisma";
import { Prisma } from "@prisma/client";

export async function create({
  data,
}: {
  data: Prisma.CustomGlossCreateInput;
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
    tabs: {
      include: {
        context: {
          include: {
            data: true,
          },
        },
        validations: {
          include: {
            resources: true,
            actionsToTake: true,
          },
        },
      },
    },
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

  throw new Error("Should never happen");
}

export async function update({
  id,
  data,
}: {
  id: string;
  data: (typeof prisma.customGloss.update)["arguments"]["data"];
}) {
  return await prisma.customGloss.update({
    where: { id },
    data,
  });
}

export async function updateTabWithCustomGlossId({
  id,
  data,
  customGlossId,
}: {
  id: string;
  customGlossId: string;
  data: (typeof prisma.customGlossTab.update)["arguments"]["data"];
}) {
  return await prisma.customGlossTab.update({
    where: { id, customGlossId },
    data,
  });
}
