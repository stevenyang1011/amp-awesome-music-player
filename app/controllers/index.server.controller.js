exports.render = function (req, res) {
    res.render('pages/index', {
        title: 'Hello World',
        user: JSON.stringify(req.user),
        messages: req.flash('error') || req.flash('info')
    });
};