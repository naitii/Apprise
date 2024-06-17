import Notification from "../models/notification.model.js";


const getNotifications = async (req, res) => {
    try {
        const id = req.params.id;
        const notifications = await Notification.find({ userId: id }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export { getNotifications };