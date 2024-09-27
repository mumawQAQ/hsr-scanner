import { RelicRuleMainStats, RelicRuleSubStats } from '@/app/types/relic-rule-type';

export type ApiResponse<T> = {
  status: 'success' | 'failed';
  message: string; // this only exists when status is 'error'
  data?: T; // this only exists when status is 'success'
};

export type CreateRelicTemplateRequest = {
  id: string;
  name: string;
  description: string;
  author: string;
};

export type CreateRelicRuleRequest = {
  template_id: string;
  rule_id: string;
};

export type DeleteRelicRuleRequest = {
  template_id: string;
  rule_id: string;
};

export type UpdateRelicRuleRequest = {
  id: string;
  template_id: string;
  set_names: string[];
  valuable_mains: RelicRuleMainStats;
  valuable_subs: RelicRuleSubStats[];
  fit_characters: string[];
};
