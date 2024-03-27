const { Op } = require('sequelize');
const Group = require('../model/group')
const User = require('../model/user');
const Member = require('../model/member');

exports.createNewGroup = async (req, res) => {
    try {
        const name = req.body.name;
        // console.log(req.user.name)
        const group = await Group.create({ name: name })
        const member = await req.user.addGroup(group, { through: { admin: true, creator: true } })
        const selectedUsers = req.body.selectedUsers
        const users = await User.findAll({
            where: {
                id: selectedUsers
            }
        })
        const addedUsers = await group.addUsers(users)

        const result = group.toJSON()
        result.member = member[0]
        return res.json({ group: result, member, addedUsers })
    } catch (e) {
        console.log(e)
        return res.status(500).json({ success: false, msg: "Internal server error" })
    }
}

exports.getGroups = async (req, res) => {
    try {
        const groups = await req.user.getGroups()
        return res.json(groups)
    } catch (e) {
        console.log(e)
        return res.status(500).json({ success: false, msg: "Internal server error" })
    }
}

exports.joinGroup = async (req, res) => {
    try {
        const groupId = req.params.groupId;
        const group = await Group.findByPk(groupId)
        if (group) {
            const member = await group.addUser(req.user)
            return res.json({ member, group })
        } else {
            return res.status(404).json({ msg: "Group does not exist" })
        }

    } catch (e) {
        console.log(e)
        return res.status(500).json({ success: false, msg: "Internal server error" })
    }
}

exports.getUsers = async (req, res) => {
    try {
        const groupId = req.params.groupId
        const id = req.query.id || 0
        // console.log(id,groupId,'>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> from get users')
        const groups = await req.user.getGroups({
            where: { id: groupId }
        })
        console.log(groups, '>>>>>>>>>>>>>>>>>>>>>>>')
        if (groups.length == 1) {
            const group = groups[0]
            const users = await group.getUsers({
                where: {
                    id: {
                        [Op.gt]: id
                    }
                },
                attributes: {
                    exclude: ['password']
                }
            }
            )
            console.log(users, '>>>>>>')
            return res.json(users)
        } else {
            return res.status(403).json({ msg: "You are not part of the group" })

        }
    } catch (e) {
        console.log(e)
        return res.status(500).json({ success: false, msg: "Internal server error" })

    }
}


exports.getOtherUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            where: {
                id: {
                    [Op.ne]: req.user.id
                }

            },
            attributes: {
                exclude: ['password']
            }
        })
        return res.json(users)
    } catch (e) {
        console.log(e)
        return res.status(500).json({ msg: "Internal server error" })
    }
}

exports.deleteGroups = async (req, res) => {

    const groupId = req.params.groupId;
    const userId = req.user.id;


    try {
        const user = await User.findOne({ where: { id: userId } });
        const groups = await Group.findOne({ where: { id: groupId } });

        const group = await Member.findOne({ where: { groupId: groupId, userId: userId } });
        console.log(group, 'group>>>>>>>>>>>>>>>>>>>>>>>')

        if (!group) {
            return res.status(404).json({ error: 'Group not found or does not belong to the current user' });
        }



        await group.update({ groupId: null });

        const namee = user.name;
        return res.status(200).json({ namee, groups, group, message: 'Group deleted successfully' });
    } catch (error) {
        console.error('Error deleting group:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }

}