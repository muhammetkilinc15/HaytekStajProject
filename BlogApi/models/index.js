// models/index.js
import User from './user_model.js';
import Role from './role_model.js';
import UserRole from './user_role.js';
import Blog from './blog_model.js';
import Category from './category_model.js';
import BlogCategory from './blog_category.js';


// Relationships between the models

// A user can have many blogs
User.hasMany(Blog, {
    foreignKey: 'userId',
    as: 'blogs',
});

// A blog belongs to a user
Blog.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user',
});


// A blog can have many categories
Blog.belongsToMany(Category, {
    through: BlogCategory,
    foreignKey: 'blogId',
    otherKey: 'categoryId',
    as: 'categories',
});

// A category can have many blogs
Category.belongsToMany(Blog, {
    through: BlogCategory,
    foreignKey: 'categoryId',
    otherKey: 'blogId',
    as: 'blogs',
});

// UserRole model should reference both User and Role
BlogCategory.belongsTo(Blog, { foreignKey: 'blogId' });
BlogCategory.belongsTo(Category, { foreignKey: 'categoryId' });



// User model
User.belongsToMany(Role, {
    through: UserRole,
    foreignKey: 'userId',
    otherKey: 'roleId',
    as: 'roles'
});

// Role model
Role.belongsToMany(User, {
    through: UserRole,
    foreignKey: 'roleId',
    otherKey: 'userId',
    as: 'users'
});

// UserRole model should reference both User and Role
UserRole.belongsTo(User, { foreignKey: 'userId' });
UserRole.belongsTo(Role, { foreignKey: 'roleId' });




// Export the models
export { User, Blog, Category, Role, UserRole, BlogCategory };
