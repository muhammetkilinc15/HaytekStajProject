import { Role } from "../models/index.js";


export const getAllRoleWithCount = async (req, res) => {
    try {
        const roles = await Role.findAll();
        const rolesWithCount = await Promise.all(roles.map(async role => {
            const user_count = await role.countUsers();
            return { ...role.dataValues, user_count };
        }));
        return res.json(rolesWithCount);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}