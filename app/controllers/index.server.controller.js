exports.render = function (req, res) {
    res.render('pages/index', {
        user: JSON.stringify(req.user),
        messages: req.flash('error') || req.flash('info')
    });
};