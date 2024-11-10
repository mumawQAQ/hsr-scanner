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
  title: RelicTitle | null;
  main_stats: RelicMainStats | null;
  sub_stats: RelicSubStats[] | null;
};

export type RelicImage = {
  title_img: string;
  main_stat_img: string;
  sub_stat_img: string;
};

export type RelicScore = {
  score: number;
  characters: string[];
  type: string;
}
