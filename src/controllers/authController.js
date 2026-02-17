const users = {
    'henriquecapi@gmail.com': 'teste214365'
};

exports.getLogin = (req, res) => {
    res.render('login', { error: null });
};

exports.postLogin = (req, res) => {
    const { email, password } = req.body;

    if (users[email] && users[email] === password) {
        req.session.user = email;
        return res.redirect('/dashboard');
    }

    res.render('login', { error: 'Invalid email or password' });
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};
