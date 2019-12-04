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

class SuggestionController extends Controller
{
    /**
     * Acton that returns a suggestion with a given ID.
     *
     * @param RequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     *
     * @return ResponseInterface
     */
    public function get(RequestInterface $req, ResponseInterface $res, array $args): ResponseInterface
    {
        return $this->json($this->getSuggestion($args['suggestion_id']));
    }

    /**
     * Action that adds a new suggestion to the database.
     *
     * @param ServerRequestInterface $req
     *
     * @return ResponseInterface
     */
    public function add(ServerRequestInterface $req): ResponseInterface
    {
        $post = $req->getParsedBody();

        $requiredFields = ['id', 'article_id', 'type'];

        foreach ($requiredFields as $field) {
            if (empty($post[$field])) {
                return $this->error('Invalid request. Missing POST field: '.$field);
            }
        }

        $stmt = $this->db->prepare(
            'INSERT INTO suggestions (id, article_id, user_id, type, data, created_at)
                        VALUES (:id, :article_id, :user_id, :type, :data, :created_at)'
        );

        $currentUser = $this->getUserRepository()->getCurrentUser();
        $authorId = $currentUser['id'];
        $createdAt = time();
        $type = $post['type'];
        $data = $post['data'];

        /**
         * If the `original_suggestion_id` field is set, it means that this suggestion has been
         * created as a result of editing other existing suggestion contents (e.g. the existing
         * suggestion could be split to two separate suggestions).
         * In this case, the current application user may be not the original author of this
         * suggestion, so it is required to fetch the original suggestion and assign the
         * id of the original author.
         */
        if (!empty($post['original_suggestion_id'])) {
            $originalSuggestion = $this->getSuggestion($post['original_suggestion_id']);

            if (!empty($originalSuggestion)) {
                $authorId = $originalSuggestion['user_id'];
                $createdAt = $originalSuggestion['created_at'];
                $type = $originalSuggestion['type'];
                $data = $originalSuggestion['data'];
            }
        }

        $stmt->bindParam(':id', $post['id'], \PDO::PARAM_STR);
        $stmt->bindParam(':article_id', $post['article_id'], \PDO::PARAM_INT);
        $stmt->bindParam(':type', $type, \PDO::PARAM_STR);
        $stmt->bindParam(':user_id', $authorId, \PDO::PARAM_INT);
        $stmt->bindParam(':created_at', $createdAt, \PDO::PARAM_INT);
        $stmt->bindParam(':data', $data, \PDO::PARAM_STR);

        $stmt->execute();

        return $this->json(
            [
                'id' => $post['id'],
                'created_at' => $createdAt
            ]
        );
    }

    /**
     * Action that updates a suggestion in the database.
     *
     * @param ServerRequestInterface $req
     * @param ResponseInterface $res
     * @param array $args
     * @return ResponseInterface
     */
    public function update(ServerRequestInterface $req, ResponseInterface $res, array $args): ResponseInterface
    {
        $suggestionId = $args['suggestion_id'] ?? null;
        $post = $req->getParsedBody();

        if (!$suggestionId) {
            return $this->error('Could not update suggestion - invalid request.');
        }

        $suggestion = $this->getSuggestion($suggestionId);

        if (empty($suggestion)) {
            return $this->error('Could not update suggestion - suggestion not found');
        }

        $hasComments = $post['has_comments'] === 'true';

        $stmt = $this->db->prepare('UPDATE suggestions SET has_comments=:has_comments WHERE id=:id');
        $stmt->bindParam(':id', $suggestionId, \PDO::PARAM_STR);
        $stmt->bindParam(':has_comments', $hasComments, \PDO::PARAM_BOOL);

        return $this->json(['ok' => $stmt->execute()]);
    }

    /**
     * Helper method that returns a suggestion with a given ID from the database.
     *
     * @param string $suggestionId
     * @return array|null
     */
    private function getSuggestion(string $suggestionId): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM suggestions WHERE id=:id");
        $stmt->bindParam(':id', $suggestionId, \PDO::PARAM_STR);
        $stmt->execute();

        $suggestion = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (!empty($suggestion['data'])) {
            $suggestion['data'] = \json_decode($suggestion['data']);
        }

        return $suggestion;
    }
}
