import type { InferSelectModel } from 'drizzle-orm';
import type {
  CustomGloss,
  CustomGlossTab,
  CustomGlossTabContext,
  CustomGlossTabContextData,
  CustomGlossTabValidationStep,
  CustomGlossTabValidationStepActionToTake,
  CustomGlossTabValidationStepResources,
} from '~/db/schema';

export type TabValidation = InferSelectModel<
  typeof CustomGlossTabValidationStep
> & {
  resources: InferSelectModel<typeof CustomGlossTabValidationStepResources>[];
  actionsToTake: InferSelectModel<
    typeof CustomGlossTabValidationStepActionToTake
  >[];
  steps: (InferSelectModel<typeof CustomGlossTabValidationStep> & {
    resources: InferSelectModel<typeof CustomGlossTabValidationStepResources>[];
    actionsToTake: InferSelectModel<
      typeof CustomGlossTabValidationStepActionToTake
    >[];
  })[];
};

export type TabContext = InferSelectModel<typeof CustomGlossTabContext> & {
  data: InferSelectModel<typeof CustomGlossTabContextData>[];
};

export type Tabs = InferSelectModel<typeof CustomGlossTab> & {
  context: TabContext[];
  validations: TabValidation[];
  customGloss: InferSelectModel<typeof CustomGloss>;
};

export interface ITabInfoSelected {
  name: string;
  isCorrect: boolean;
  isVerified: boolean;
}
