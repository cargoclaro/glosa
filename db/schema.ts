import type { Pedimento } from '@/shared/services/customGloss/data-extraction/schemas';
import type { Cove } from '@/shared/services/customGloss/extract-and-structure/schemas';
import { relations } from 'drizzle-orm';
import {
  boolean,
  doublePrecision,
  foreignKey,
  integer,
  json,
  pgEnum,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';

export const OperationStatus = pgEnum('OperationStatus', [
  'IN_PROGRESS',
  'DONE',
]);

export const CustomGlossType = pgEnum('CustomGlossType', [
  'LOW',
  'HIGH',
  'MEDIUM',
]);

export const customGlossContextTypes = [
  'PROVIDED',
  'INFERRED',
  'EXTERNAL',
] as const;

export type CustomGlossTabContextTypes =
  (typeof customGlossContextTypes)[number];

export const CustomGlossTabContextType = pgEnum(
  'CustomGlossTabContextType',
  customGlossContextTypes
);

export const CustomGloss = pgTable('CustomGloss', {
  id: uuid('id').notNull().primaryKey().defaultRandom(),
  summary: text('summary').notNull(),
  timeSaved: doublePrecision('timeSaved').notNull(),
  moneySaved: doublePrecision('moneySaved').notNull(),
  importerName: text('importerName').notNull(),
  operationStatus: OperationStatus('operationStatus')
    .notNull()
    .default('IN_PROGRESS'),
  userId: text('userId').notNull(),
  cove: json().$type<Cove>(),
  pedimento: json().$type<Pedimento>(),
  createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
});

export type CustomGlossTable = typeof CustomGloss.$inferSelect;

export const CustomGlossAlert = pgTable(
  'CustomGlossAlert',
  {
    id: serial('id').notNull(),
    type: CustomGlossType('type').notNull(),
    description: text('description').notNull(),
    customGlossId: uuid('customGlossId').notNull(),
    createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { precision: 3 }).notNull(),
  },
  (CustomGlossAlert) => ({
    CustomGlossAlert_customGloss_fkey: foreignKey({
      name: 'CustomGlossAlert_customGloss_fkey',
      columns: [CustomGlossAlert.customGlossId],
      foreignColumns: [CustomGloss.id],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
    CustomGlossAlert_cpk: primaryKey({
      name: 'CustomGlossAlert_cpk',
      columns: [CustomGlossAlert.id, CustomGlossAlert.customGlossId],
    }),
  })
);

export type CustomGlossAlertTable = typeof CustomGlossAlert.$inferSelect;

export const CustomGlossFile = pgTable(
  'CustomGlossFile',
  {
    id: serial('id').notNull(),
    name: text('name').notNull(),
    url: text('url').notNull(),
    documentType: text('documentType'),
    customGlossId: uuid('customGlossId').notNull(),
    createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
  },
  (CustomGlossFile) => ({
    CustomGlossFile_customGloss_fkey: foreignKey({
      name: 'CustomGlossFile_customGloss_fkey',
      columns: [CustomGlossFile.customGlossId],
      foreignColumns: [CustomGloss.id],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
    CustomGlossFile_cpk: primaryKey({
      name: 'CustomGlossFile_cpk',
      columns: [CustomGlossFile.id, CustomGlossFile.customGlossId],
    }),
  })
);

export type CustomGlossFileTable = typeof CustomGlossFile.$inferSelect;

export const CustomGlossTab = pgTable(
  'CustomGlossTab',
  {
    id: uuid('id').notNull().primaryKey().defaultRandom(),
    name: text('name').notNull(),
    summary: text('summary'),
    isCorrect: boolean('isCorrect').notNull(),
    fullContext: boolean('fullContext').notNull(),
    isVerified: boolean('isVerified').notNull(),
    customGlossId: uuid('customGlossId').notNull(),
    createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
  },
  (CustomGlossTab) => ({
    CustomGlossTab_customGloss_fkey: foreignKey({
      name: 'CustomGlossTab_customGloss_fkey',
      columns: [CustomGlossTab.customGlossId],
      foreignColumns: [CustomGloss.id],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
    CustomGlossTab_name_customGlossId_unique_idx: uniqueIndex(
      'CustomGlossTab_name_customGlossId_key'
    ).on(CustomGlossTab.name, CustomGlossTab.customGlossId),
  })
);

export type CustomGlossTabTable = typeof CustomGlossTab.$inferSelect;

export const CustomGlossTabContext = pgTable(
  'CustomGlossTabContext',
  {
    id: serial('id').notNull().primaryKey(),
    type: CustomGlossTabContextType('type').notNull(),
    origin: text('origin').notNull(),
    summary: text('summary'),
    url: text('url').notNull(),
    customGlossTabId: uuid('customGlossTabId').notNull(),
    createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
  },
  (CustomGlossTabContext) => ({
    CustomGlossTabContext_customGlossTab_fkey: foreignKey({
      name: 'CustomGlossTabContext_customGlossTab_fkey',
      columns: [CustomGlossTabContext.customGlossTabId],
      foreignColumns: [CustomGlossTab.id],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
  })
);

export type CustomGlossTabContextTable =
  typeof CustomGlossTabContext.$inferSelect;

export const CustomGlossTabContextData = pgTable(
  'CustomGlossTabContextData',
  {
    id: serial('id').notNull().primaryKey(),
    name: text('name').notNull(),
    value: text('value').notNull(),
    customGlossTabContextId: integer('customGlossTabContextId').notNull(),
    createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
  },
  (CustomGlossTabContextData) => ({
    CustomGlossTabContextData_customGlossTabContext_fkey: foreignKey({
      name: 'CustomGlossTabContextData_customGlossTabContext_fkey',
      columns: [CustomGlossTabContextData.customGlossTabContextId],
      foreignColumns: [CustomGlossTabContext.id],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
  })
);

export type CustomGlossTabContextDataTable =
  typeof CustomGlossTabContextData.$inferSelect;

export const CustomGlossTabValidationStep = pgTable(
  'CustomGlossTabValidationStep',
  {
    id: serial('id').notNull().primaryKey(),
    name: text('name'),
    fraccion: text('fraccion'),
    isCorrect: boolean('isCorrect'),
    description: text('description'),
    llmAnalysis: text('llmAnalysis'),
    parentStepId: integer('parentStepId'),
    customGlossTabId: uuid('customGlossTabId'),
    createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
  },
  (CustomGlossTabValidationStep) => ({
    CustomGlossTabValidationStep_parentStep_fkey: foreignKey({
      name: 'CustomGlossTabValidationStep_parentStep_fkey',
      columns: [CustomGlossTabValidationStep.parentStepId],
      foreignColumns: [CustomGlossTabValidationStep.id],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
    CustomGlossTabValidationStep_customGlossTab_fkey: foreignKey({
      name: 'CustomGlossTabValidationStep_customGlossTab_fkey',
      columns: [CustomGlossTabValidationStep.customGlossTabId],
      foreignColumns: [CustomGlossTab.id],
    })
      .onDelete('cascade')
      .onUpdate('cascade'),
  })
);

export type CustomGlossTabValidationStepTable =
  typeof CustomGlossTabValidationStep.$inferSelect;

export const CustomGlossTabValidationStepActionToTake = pgTable(
  'CustomGlossTabValidationStepActionToTake',
  {
    id: serial('id').notNull().primaryKey(),
    description: text('description').notNull(),
    customGlossTabValidationStepId: integer(
      'customGlossTabValidationStepId'
    ).notNull(),
    createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
  },
  (CustomGlossTabValidationStepActionToTake) => ({
    CustomGlossTabValidationStepActionToTake_customGlossTabValidationStep_fkey:
      foreignKey({
        name: 'CustomGlossTabValidationStepActionToTake_customGlossTabValidationStep_fkey',
        columns: [
          CustomGlossTabValidationStepActionToTake.customGlossTabValidationStepId,
        ],
        foreignColumns: [CustomGlossTabValidationStep.id],
      })
        .onDelete('cascade')
        .onUpdate('cascade'),
  })
);

export type CustomGlossTabValidationStepActionToTakeTable =
  typeof CustomGlossTabValidationStepActionToTake.$inferSelect;

export const CustomGlossTabValidationStepResources = pgTable(
  'CustomGlossTabValidationStepResources',
  {
    id: serial('id').notNull().primaryKey(),
    name: text('name'),
    link: text('link'),
    customGlossTabValidationStepId: integer(
      'customGlossTabValidationStepId'
    ).notNull(),
    createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
    updatedAt: timestamp('updatedAt', { precision: 3 }).notNull(),
  },
  (CustomGlossTabValidationStepResources) => ({
    CustomGlossTabValidationStepResources_customGlossTabValidationStep_fkey:
      foreignKey({
        name: 'CustomGlossTabValidationStepResources_customGlossTabValidationStep_fkey',
        columns: [
          CustomGlossTabValidationStepResources.customGlossTabValidationStepId,
        ],
        foreignColumns: [CustomGlossTabValidationStep.id],
      })
        .onDelete('cascade')
        .onUpdate('cascade'),
  })
);

export type CustomGlossTabValidationStepResourcesTable =
  typeof CustomGlossTabValidationStepResources.$inferSelect;

export const CustomGlossRelations = relations(CustomGloss, ({ many }) => ({
  tabs: many(CustomGlossTab, {
    relationName: 'CustomGlossToCustomGlossTab',
  }),
  files: many(CustomGlossFile, {
    relationName: 'CustomGlossToCustomGlossFile',
  }),
  alerts: many(CustomGlossAlert, {
    relationName: 'CustomGlossToCustomGlossAlert',
  }),
}));

export const CustomGlossAlertRelations = relations(
  CustomGlossAlert,
  ({ one }) => ({
    customGloss: one(CustomGloss, {
      relationName: 'CustomGlossToCustomGlossAlert',
      fields: [CustomGlossAlert.customGlossId],
      references: [CustomGloss.id],
    }),
  })
);

export const CustomGlossFileRelations = relations(
  CustomGlossFile,
  ({ one }) => ({
    customGloss: one(CustomGloss, {
      relationName: 'CustomGlossToCustomGlossFile',
      fields: [CustomGlossFile.customGlossId],
      references: [CustomGloss.id],
    }),
  })
);

export const CustomGlossTabRelations = relations(
  CustomGlossTab,
  ({ many, one }) => ({
    context: many(CustomGlossTabContext, {
      relationName: 'CustomGlossTabToCustomGlossTabContext',
    }),
    validations: many(CustomGlossTabValidationStep, {
      relationName: 'CustomGlossTabToCustomGlossTabValidationStep',
    }),
    customGloss: one(CustomGloss, {
      relationName: 'CustomGlossToCustomGlossTab',
      fields: [CustomGlossTab.customGlossId],
      references: [CustomGloss.id],
    }),
  })
);

export const CustomGlossTabContextRelations = relations(
  CustomGlossTabContext,
  ({ many, one }) => ({
    data: many(CustomGlossTabContextData, {
      relationName: 'CustomGlossTabContextToCustomGlossTabContextData',
    }),
    customGlossTab: one(CustomGlossTab, {
      relationName: 'CustomGlossTabToCustomGlossTabContext',
      fields: [CustomGlossTabContext.customGlossTabId],
      references: [CustomGlossTab.id],
    }),
  })
);

export const CustomGlossTabContextDataRelations = relations(
  CustomGlossTabContextData,
  ({ one }) => ({
    customGlossTabContext: one(CustomGlossTabContext, {
      relationName: 'CustomGlossTabContextToCustomGlossTabContextData',
      fields: [CustomGlossTabContextData.customGlossTabContextId],
      references: [CustomGlossTabContext.id],
    }),
  })
);

export const CustomGlossTabValidationStepRelations = relations(
  CustomGlossTabValidationStep,
  ({ many, one }) => ({
    resources: many(CustomGlossTabValidationStepResources, {
      relationName:
        'CustomGlossTabValidationStepToCustomGlossTabValidationStepResources',
    }),
    actionsToTake: many(CustomGlossTabValidationStepActionToTake, {
      relationName:
        'CustomGlossTabValidationStepToCustomGlossTabValidationStepActionToTake',
    }),
    steps: many(CustomGlossTabValidationStep, {
      relationName: 'StepToParent',
    }),
    parentStep: one(CustomGlossTabValidationStep, {
      relationName: 'StepToParent',
      fields: [CustomGlossTabValidationStep.parentStepId],
      references: [CustomGlossTabValidationStep.id],
    }),
    customGlossTab: one(CustomGlossTab, {
      relationName: 'CustomGlossTabToCustomGlossTabValidationStep',
      fields: [CustomGlossTabValidationStep.customGlossTabId],
      references: [CustomGlossTab.id],
    }),
  })
);

export const CustomGlossTabValidationStepActionToTakeRelations = relations(
  CustomGlossTabValidationStepActionToTake,
  ({ one }) => ({
    customGlossTabValidationStep: one(CustomGlossTabValidationStep, {
      relationName:
        'CustomGlossTabValidationStepToCustomGlossTabValidationStepActionToTake',
      fields: [
        CustomGlossTabValidationStepActionToTake.customGlossTabValidationStepId,
      ],
      references: [CustomGlossTabValidationStep.id],
    }),
  })
);

export const CustomGlossTabValidationStepResourcesRelations = relations(
  CustomGlossTabValidationStepResources,
  ({ one }) => ({
    customGlossTabValidationStep: one(CustomGlossTabValidationStep, {
      relationName:
        'CustomGlossTabValidationStepToCustomGlossTabValidationStepResources',
      fields: [
        CustomGlossTabValidationStepResources.customGlossTabValidationStepId,
      ],
      references: [CustomGlossTabValidationStep.id],
    }),
  })
);
