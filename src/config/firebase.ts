import admin from 'firebase-admin';
import logger from '../utils/logger';

/**
 * Initialize Firebase Admin SDK
 */
function initializeFirebase(): void {
  try {
    // Check if already initialized
    if (admin.apps.length > 0) {
      logger.info('Firebase Admin SDK already initialized');
      return;
    }

    // Get credentials from environment
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    if (!projectId || !privateKey || !clientEmail) {
      throw new Error('Missing Firebase configuration. Check FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL');
    }

    // Initialize Firebase Admin
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        privateKey,
        clientEmail,
      }),
    });

    logger.info('Firebase Admin SDK initialized successfully', {
      projectId,
      clientEmail,
    });
  } catch (error) {
    logger.error('Failed to initialize Firebase Admin SDK', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
}

/**
 * Get Firebase Auth instance
 */
function getAuth(): admin.auth.Auth {
  if (admin.apps.length === 0) {
    throw new Error('Firebase Admin SDK not initialized. Call initializeFirebase() first.');
  }
  return admin.auth();
}

/**
 * Verify Firebase ID token
 */
async function verifyIdToken(idToken: string): Promise<admin.auth.DecodedIdToken> {
  try {
    const auth = getAuth();
    const decodedToken = await auth.verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    logger.error('Firebase ID token verification failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}

// Initialize on module load
initializeFirebase();

export { getAuth, verifyIdToken, initializeFirebase };
export default admin;
