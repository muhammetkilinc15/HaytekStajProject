import { Blog } from "../models/index.js";

export const verifyRole = (roles, ownResource = false) => {
    return async (req, res, next) => {
        try {
            const userRoleNames = req.user.roles; // User roles
            const hasRole = roles.some(role => userRoleNames.includes(role)); // Check for required roles

            // If checking for own resource and the role is valid, continue to check ownership
            if (ownResource && hasRole) {
                const blogId = req.params.id; // Get the blog ID from request parameters
                const blog = await Blog.findOne({ where: { id: blogId } }); // Find the blog

                // Check if the blog exists and if the userId matches the blog's userId
                if (!blog || blog.userId !== req.user.id) {
                    return res.status(403).json({ error: "Access denied. You do not have permission to modify this blog." });
                }
            }

            if (!hasRole) {
                return res.status(403).json({ error: "Access denied. You do not have the required permissions." });
            }

            next(); // Proceed to the next middleware if the checks pass
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    };
};
