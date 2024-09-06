export type RelicTitle = {
  title: string;
  setName: string;
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
  enhanceLevel: number;
};

export type RelicInfo = {
  title: RelicTitle;
  mainStats: RelicMainStats;
  subStats: RelicSubStats[];
};

export type RelicImage = {
  titleImage: string;
  mainStatImage: string;
  subStatImages: string;
};
