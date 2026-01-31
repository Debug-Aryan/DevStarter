exports.getSample = (req, res, next) => {
    try {
        res.json({ message: 'Hello from Node.js + Express!' });
    } catch (error) {
        next(error);
    }
};
