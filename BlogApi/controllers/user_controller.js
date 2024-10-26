import { Role, User, UserRole } from "../models/index.js";

export const getUsersInfo = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'email', 'firstName', 'lastName'], // İstediğiniz alanları dahil et
        });

        // Her kullanıcı için rollerini al
        const usersWithRoles = await Promise.all(users.map(async (user) => {
            const userRoles = await UserRole.findAll({ where: { userId: user.id } });
            const roleIds = userRoles.map(userRole => userRole.roleId);
            const roles = await Role.findAll({ where: { id: roleIds } });
            
            return {
                ...user.get(), // Kullanıcı bilgilerini al
                roles: roles // Rollerini ekle
            };
        }));

        // Kullanıcı bilgilerini ve rollerini döndür
        res.status(200).json(usersWithRoles);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const getUserInfo = async (req, res) => {
    try {
        const { userId } = req.params;

        // Kullanıcıyı bul
        const user = await User.findByPk(userId, {
            attributes: ['id', 'email', 'firstName', 'lastName'], // İstediğiniz alanları dahil et
        });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Kullanıcının rollerini al
        const userRoles = await UserRole.findAll({ where: { userId } });
        const roleIds = userRoles.map(userRole => userRole.roleId);
        const roles = await Role.findAll({ where: { id: roleIds } });

        // Kullanıcı bilgilerini ve rollerini döndür
        res.status(200).json({ ...user.get(), roles });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}



export const postUserInfo = async (req, res) => {
    try {
        const { userId } = req.params;
        const { email, firstName, lastName, roleIds } = req.body; // Rol ID'lerini de alın

        // Kullanıcıyı bul
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Kullanıcı bilgilerini güncelle
        user.email = email;
        user.firstName = firstName;
        user.lastName = lastName;
        await user.save();

        // Kullanıcının rollerini güncelle
        // Öncelikle mevcut rolleri sil
        await UserRole.destroy({ where: { userId } });

        // Yeni roller ekle
        if (roleIds && roleIds.length > 0) {
            const userRoles = roleIds.map(roleId => ({ userId, roleId }));
            await UserRole.bulkCreate(userRoles);
        }

        // Güncellenmiş kullanıcı bilgilerini ve rollerini döndür
        const updatedRoles = await Role.findAll({ where: { id: roleIds } });
        res.status(200).json({ user, roles: updatedRoles });
    } catch (error) {
        console.error("Error updating user info:", error); // Hata ayıklama için
        res.status(500).json({ error: error.message });
    }
};