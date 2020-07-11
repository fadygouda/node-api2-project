const express = require("express");
const Posts = require("../db");

const router = express.Router();

router.get("/", (req, res) => {
    Posts.find(req.query)
        .then(post => {
            res.status(200).json(post);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({errorMessage: "Server error saving to the database"});
        });
});

router.get("/:id", (req, res) => {
    Posts.findById(req.params.id)
        .then(post => {
            if(post) {
                res.status(200).json(post);
            } else {
                res.status(404).json({errorMessage: "ID does not exist/"})
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({errorMessage: "Post could not be retrieved"});
        });
});

router.get("/:id/comments", (req, res) => {
    Posts.findPostComments(req.params.id)
        .then(comment => {
            if (comment) {
                res.status(200).json(comment)
            } else {
                res.status(404).json({errorMessage: "Comments with certain ID does not exist"});
            }
        })
        .catch(err => {
            res.status(500).json({errorMessage: "Comments could not be retrieved"});
        });
});

router.post("/", (req, res) => {
    const post = req.body;

    if(!post.title || !post.contents) {
        res.status(400).json({errorMessage: "Missing title &/or contents for post"})
    } else {
    try {
        Posts.insert(post);
        res.status(200).json(post);
    } catch {
        res.status(500).json({error: "Error saving to database"})
    }
}
});

router.post("/:id/comments", (req, res) => {
    const id = req.params.id
    comment = req.body;
    comment.post_id = Number(id);
    if(!req.body.text) {
        res.status(400).json({ errorMessage: "Missing text"});
    } else {
        Posts.insertComment(comment)
        .then(comment => {
            res.status(20).json(comment);
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({message: "Post does not exist"})
        })
    };
});

router.delete("/:id", (req, res) => {
    Posts.findById(req.params.id)
        .then(post => {
            Posts.remove(req.params.id)
                .then(() => {
                    res.status(200).json(post);
                })
                .catch(err => {
                    console.log(err)
                    res.status(500).json({error: "Could not be deleted"});
                })
        })
        .catch(err => {
            console.log(err);
            res.status(404).json({message: "Post does not exist"})
        });
});

router.put("/:id", (req, res) => {
    const update = req.body;
    const id = req.params.id;

    Posts.findById(id)
    .then(() => {
        if(!update.title || !update.contents) {
            res.status(400).json({errorMessage: "Missing title/contents"})
        } else {
            Posts.update(id, update)
            .then(() => {
                res.status(200).json(update);
            })
            .catch((err) => {
                console.log(err);
                res.status(500).json({err: "Post could not be changed"});
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(404).json({message:"Post does not exist"});
    });
})

module.exports = router;