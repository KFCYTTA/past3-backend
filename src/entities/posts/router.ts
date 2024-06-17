import express, { Request, Response, Router } from 'express';
import { v4 } from 'uuid';

import { createUser } from '../users/db';
import {
    countPosts,
    createPost,
    deletePost,
    getPost,
    getPosts,
    updatePost,
    getPostsByUserId
} from './db';

export function getRouter(): Router {
    const router = express.Router();

    router.get(
        '/',
        async (
            req: Request<any, any, any, { limit?: string; offset?: string }>,
            res
        ) => {
            const limit = Number(req.query.limit ?? -1);
            const offset = Number(req.query.offset ?? 0);

            const posts = await getPosts(limit, offset);

            res.json(posts);
        }
    );
    router.get(
        '/users/:id',
        async (
            req: Request<any, any, any, { id: string; limit?: string; offset?: string }>,
            res
        ) => {
            const { limit, offset, id} = req.query
            const limits = Number(limit ?? -1);
            const offsets = Number(offset ?? 0);
            
            const posts = await getPostsByUserId(id,limits, offsets);

            res.json(posts);
        }
    );

    router.get('/count', async (_req, res) => {
        res.json(await countPosts());
    });

    router.get('/:id', async (req, res) => {
        const { id } = req.params;

        const post = await getPost(id);

        console.log('post', post);

        res.json(post);
    });

    router.post(
        '/',
        async (
            req: Request<any, any, { title: string; content: string; user_id: string; isPublic: boolean }>,
            res
        ) => {
            try {
                const { title, content, user_id, isPublic } = req.body;

                const post = await createPost({
                    user_id,
                    title,
                    content,
                    isPublic
                });

                res.json(post);
            }catch (e) {
                res.json(e);
            }
           
        }
    );

    // router.post('/batch/:num', async (req, res) => {
    //     const num = Number(req.params.num);

    //     for (let i = 0; i < Number(req.params.num); i++) {
    //         const user = await createUser({
    //             username: `lastmjs${v4()}`,
    //             age: i
    //         });

    //         await createPost({
    //             user_id: user.id,
    //             title: `Post ${v4()}`,
    //             body: `${v4()}${v4()}${v4()}${v4()}`
    //         });
    //     }

    //     res.send({
    //         Success: `${num} posts created`
    //     });
    // });

    router.put('/', updateHandler);

    router.patch('/', updateHandler);

    router.delete('/', async (req: Request<any, any, { id: number }>, res) => {
        const { id } = req.body;

        const deletedId = await deletePost(id);

        res.json(deletedId);
    });

    return router;
}

async function updateHandler(
    req: Request<
        any,
        any,
        { id: string; user_id?: string; title?: string; content?: string; isPublic?: boolean }
    >,
    res: Response
) {
    const { id, user_id, title, content, isPublic } = req.body;

    const post = await updatePost({
        id,
        user_id,
        title,
        content,
        isPublic
    });

    res.json(post);
}
