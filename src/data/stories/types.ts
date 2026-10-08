export type StoryPage = {
  text: string;
  art: string;
};

export type FolkStory = {
  iso: string;
  title: string;
  pages: StoryPage[];
};