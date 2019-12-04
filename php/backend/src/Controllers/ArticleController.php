<?php

/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * This file is licensed under the terms of the MIT License (see LICENSE.md).
 */

namespace Example\Controllers;

use Example\Controller;
use Psr\Http\Message\RequestInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class ArticleController extends Controller
{
    /**
     * Action that displays the article editing page.
     *
     * @param RequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     *
     * @return ResponseInterface
     */
    public function edit(RequestInterface $req, ResponseInterface $res, array $args): ResponseInterface
    {
        if (empty($args['article_id'])) {
            return $this->error("Invalid article id");
        }

        $stmt = $this->db->prepare("SELECT * FROM articles WHERE id=:id");
        $stmt->bindParam(':id', $args['article_id'], \PDO::PARAM_INT);
        $stmt->execute();

        $article = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (!$article) {
            return $this->error("Article not found");
        }

        $userRepository = $this->getUserRepository();

        $currentUser = $userRepository->getCurrentUser();

        $users = array_map(
            function ($u) {
                return [
                    'id' => (string)$u['id'],
                    'name' => $u['display_name'],
                    'avatar' => $u['avatar_url'],
                ];
            },
            $userRepository->listUsers()
        );

        return $this->view(
            'edit',
            [
                'article' => $article,
                'author' => $userRepository->getUserById($article['user_id']),
                'currentUserId' => $currentUser['id'],
                'users' => $users,
            ]
        );
    }

    /**
     * Action responsible for saving article contents in the database.
     *
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     *
     * @return ResponseInterface
     */
    public function save(ServerRequestInterface $req, ResponseInterface $res, array $args): ResponseInterface
    {
        if (!$args['article_id']) {
            return $this->error("Invalid article id");
        }

        $post = $req->getParsedBody();

        $articleBody = $post['body'] ?? null;

        if (!is_string($articleBody)) {
            return $this->error('Invalid article body');
        }

        $stmt = $this->db->prepare("UPDATE articles SET body=:body WHERE id=:id");
        $stmt->bindParam(':id', $args['article_id'], \PDO::PARAM_INT);
        $stmt->bindParam(':body', $articleBody, \PDO::PARAM_STR);

        return $this->json(['ok' => $stmt->execute()]);
    }
}
