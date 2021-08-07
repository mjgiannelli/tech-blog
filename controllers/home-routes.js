const router = require('express').Router();
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
    Post.findAll({
        attributes: [
            'id',
            'post_content',
            'title',
            'created_at'
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
            const posts = dbPostData.map(post => post.get({ plain: true }))
            res.render('homepage', { posts })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// create route for the login page
router.get('/login', (req, res) => {
    res.render('login');
});

// create route for the sign up page
router.get('/signup', (req, res) => {
    res.render('signup');
});

module.exports = router;