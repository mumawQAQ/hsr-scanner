export type RelicRuleIds = {
  id: string;
  template_id: string;
};

export type RelicRuleLocal = {
  id: string;
  set_names: string[];
  valuable_mains: RelicRuleMainStats;
  valuable_subs: RelicRuleSubStats[];
  fit_characters: string[];
  is_saved: boolean;
};

export type RelicRule = {
  id: string;
  set_names: string[];
  valuable_mains: RelicRuleMainStats;
  valuable_subs: RelicRuleSubStats[];
  fit_characters: string[];
};

export type RelicRuleMainStats = {
  [key: string]: string[];
};

export type RelicRuleSubStats = {
  name: string;
  rating_scale: number;
};
