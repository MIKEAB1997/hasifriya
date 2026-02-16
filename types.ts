
export interface Presentation {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnailUrl: string;
  driveUrl: string;
  isNew?: boolean;
  addedAt: string;
}

export interface User {
  name: string;
  avatar: string;
}
