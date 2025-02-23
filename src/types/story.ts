export interface StoryBasicInfo {
  id: string;
  title: string;
  description: string;
  bookNumber: number;
  thumbnailURL: string;
  originalPhotoURL: string;
  numberOfPages: 12 | 24;
  tags: string[];
  isWeeklyFavorite?: boolean;
}

export interface StoryDetails {
  imageURLs: string[];
  storyTexts: string[];
  narrationURLs: string[];
}

export interface Story extends StoryBasicInfo, StoryDetails {
  createdAt: string;
  updatedAt: string;
  userId?: string;
}

export interface UserStory {
  id: string;
  userId: string;
  userEmail: string;
  templateId: string;
  childName: string;
  childAge: string;
  childGender: 'male' | 'female';
  transformedPhotoUrl: string;
  status: 'creating' | 'completed';
  createdAt: string;
  updatedAt: string;
  // Tamamlanmış hikayeler için ek alanlar
  title?: string;
  description?: string;
  thumbnailUrl?: string;
  imageUrls?: string[];
  storyTexts?: string[];
  narrationUrls?: string[];
}