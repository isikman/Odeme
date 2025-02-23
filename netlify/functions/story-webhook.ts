import { Handler } from '@netlify/functions';
import { initializeApp, cert } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';

// Firebase Admin yapılandırması
const app = initializeApp({
  credential: cert({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  }),
  databaseURL: process.env.VITE_FIREBASE_DATABASE_URL
});

const database = getDatabase(app);

interface StoryWebhookPayload {
  type: 'creation';
  data: {
    storyId: string;
    userId: string;
    userEmail: string;
    templateId: string;
    childName: string;
    childAge: string;
    childGender: 'male' | 'female';
    transformedPhotoUrl: string;
    bookDetails: {
      title: string;
      description: string;
      thumbnailUrl: string;
      imageUrls: string[];
      storyTexts: string[];
      narrationUrls: string[];
    };
  };
}

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method not allowed' })
    };
  }

  // API Key kontrolü
  const apiKey = event.headers['x-api-key'];
  if (!apiKey || apiKey !== process.env.VITE_MAKE_WEBHOOK_API_KEY) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Unauthorized - Invalid API Key' })
    };
  }

  try {
    const payload = JSON.parse(event.body || '{}') as StoryWebhookPayload;
    console.log('Received payload:', payload);

    // Hikaye kaydını güncelle
    const storyRef = database.ref(`userStories/${payload.data.userId}/${payload.data.storyId}`);
    await storyRef.update({
      status: 'completed',
      ...payload.data.bookDetails,
      updatedAt: new Date().toISOString()
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Story creation completed successfully'
      })
    };
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      })
    };
  }
};