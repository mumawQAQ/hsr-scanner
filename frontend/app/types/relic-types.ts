export type RelicTitle = {
  title: string;
  set_name: string;
};

export type RelicSubStats = {
  name: string;
  number: string;
  score: [number];
};

export type RelicMainStats = {
  name: string;
  number: string;
  level: number;
  enhance_level: number;
};

export type RelicInfo = {
  title: RelicTitle;
  main_stats: RelicMainStats;
  sub_stats: RelicSubStats[];
};

export type RelicImage = {
  title_img: string;
  main_stat_img: string;
  sub_stat_img: string;
};
