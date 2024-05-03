import mongoose from 'mongoose';

// Function to clean the database
export const cleanDB = async (dbInstance) => {
  try {
    // Get list of all collections
    const collections = await dbInstance.db.listCollections().toArray();

    // Iterate over collections and drop each one
    collections.forEach(async (collectionInfo) => {
        try {
          await dbInstance.db.dropCollection(collectionInfo.name);
          console.log(`Collection ${collectionInfo.name} dropped successfully`);
        } catch (err) {
          console.error(`Error dropping collection ${collectionInfo.name}:`, err);
        }
    });
  } catch (err) {
    console.error('Error dropping collections:', err);
  }
};
