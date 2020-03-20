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

class CommentController extends Controller
{
    /**
     * Action that adds a new comment to the database.
     *
     * @param ServerRequestInterface $req
     *
     * @return ResponseInterface
     */
    public function add(ServerRequestInterface $req): ResponseInterface
    {
        $post = $req->getParsedBody();

        $requiredFields = ['article_id', 'thread_id', 'comment_id', 'content'];

        foreach ($requiredFields as $field) {
            if (empty($post[$field])) {
                return $this->error('Invalid request. Missing POST field: '.$field);
            }
        }

        $stmt = $this->db->prepare(
            'INSERT INTO comments (id, thread_id, content, article_id, user_id, created_at)
                        VALUES (:id, :thread_id, :content, :article_id, :user_id, :created_at)'
        );

        $currentUser = $this->getUserRepository()->getCurrentUser();
        $currentUserId = $currentUser['id'];

        $commentId = $post['comment_id'];
        $threadId = $post['thread_id'];
        $articleId = $post['article_id'];
        $content = $post['content'];
        $createdAt = time();

        $stmt->bindParam(':id', $commentId, \PDO::PARAM_STR);
        $stmt->bindParam(':thread_id', $threadId, \PDO::PARAM_STR);
        $stmt->bindParam(':content', $content, \PDO::PARAM_STR);
        $stmt->bindParam(':article_id', $articleId, \PDO::PARAM_INT);
        $stmt->bindParam(':user_id', $currentUserId, \PDO::PARAM_INT);
        $stmt->bindParam(':created_at', $createdAt, \PDO::PARAM_INT);

        if (!$stmt->execute()) {
            return $this->error("Could not save comment");
        }

        return $this->json([
            'id' => $commentId,
            'created_at' => $createdAt
        ]);
    }

    /**
     * Action that removes a comment from the database.
     *
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     *
     * @return ResponseInterface
     */
    public function remove(ServerRequestInterface $req, ResponseInterface $res, array $args): ResponseInterface
    {
        $commentId = $args['comment_id'] ?? null;
        $threadId = $args['thread_id'] ?? null;

        if (!$commentId || !$threadId) {
            return $this->error('Could not remove comment - invalid request.');
        }

        $comment = $this->getComment($commentId, $threadId);

        if (empty($comment)) {
            return $this->error('Could not remove comment - comment not found');
        }

        if ($comment['user_id'] != $this->getUserRepository()->getCurrentUserId()) {
            return $this->error('Could not remove comment - comment can be deleted only by its author');
        }

        $stmt = $this->db->prepare('DELETE FROM comments WHERE id=:id AND thread_id=:thread_id');
        $stmt->bindParam(':id', $commentId, \PDO::PARAM_STR);
        $stmt->bindParam(':thread_id', $threadId, \PDO::PARAM_STR);

        return $this->json(['ok' => $stmt->execute()]);
    }

    /**
     * Action that updates a comment in the database.
     *
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     * @return ResponseInterface
     */
    public function update(ServerRequestInterface $req, ResponseInterface $res, array $args): ResponseInterface
    {
        $commentId = $args['comment_id'] ?? null;
        $threadId = $args['thread_id'] ?? null;
        $post = $req->getParsedBody();

        if (!$commentId || !$threadId || empty($post['content'])) {
            return $this->error('Could not update comment - invalid request.');
        }

        $comment = $this->getComment($commentId, $threadId);

        if (empty($comment)) {
            return $this->error('Could not update comment - comment not found');
        }

        if ($comment['user_id'] != $this->getUserRepository()->getCurrentUserId()) {
            return $this->error('Could not update comment - comment can be updated only by its author');
        }

        $stmt = $this->db->prepare('UPDATE comments SET content=:content WHERE id=:id AND thread_id=:thread_id');
        $stmt->bindParam(':id', $commentId, \PDO::PARAM_STR);
        $stmt->bindParam(':thread_id', $threadId, \PDO::PARAM_STR);
        $stmt->bindParam(':content', $post['content'], \PDO::PARAM_STR);

        return $this->json(['ok' => $stmt->execute()]);
    }

    /**
     * Acton that returns all the comments in a thread with the given comment thread ID.
     *
     * @param RequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     *
     * @return ResponseInterface
     */
    public function getThread(RequestInterface $req, ResponseInterface $res, array $args): ResponseInterface
    {
        $stmt = $this->db->prepare("SELECT * FROM comments WHERE thread_id=:thread_id");
        $stmt->bindParam(':thread_id', $args['thread_id'], \PDO::PARAM_STR);
        $stmt->execute();

        return $this->json($stmt->fetchAll(\PDO::FETCH_ASSOC));
    }

    /**
     * Helper method that returns a comment with a given ID from the database.
     *
     * @param string $commentId
     * @param string $threadId
     * @return array|null
     */
    private function getComment(string $commentId, string $threadId): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM comments WHERE id=:id AND thread_id=:thread_id");
        $stmt->bindParam(':id', $commentId, \PDO::PARAM_STR);
        $stmt->bindParam(':thread_id', $threadId, \PDO::PARAM_STR);
        $stmt->execute();

        return $stmt->fetch(\PDO::FETCH_ASSOC);
    }
}
