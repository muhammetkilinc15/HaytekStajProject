// Purpose: Synchronize the models with the database., Synchronize the models with the database.
import { sequelize } from './connectdb.js   ';

import { dummy_data } from '../seeds/dummy_data.js';  // Synchronize the models with the database.

// Synchronize the models with the database.
import { Blog, User, Category,BlogCategory,Role,UserRole } from '../models/index.js';



export const dbAsync = async () => {

   // First, synchronize the models with the database
   await sequelize.sync({ force: true }) // force: true will drop and recreate the tables
   .then(() => console.log('All models were synchronized successfully.'))
   .catch(error => {
       console.error('Error synchronizing models:', error);
       throw error; // Ensure it stops further execution on error
   });

// After successful sync, populate dummy data
await dummy_data()
   .then(() => console.log('Dummy data added successfully.'))
   .catch(error => console.error('Error adding dummy data:', error));
};
