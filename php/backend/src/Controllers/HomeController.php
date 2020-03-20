<?php

/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * This file is licensed under the terms of the MIT License (see LICENSE.md).
 */

namespace Example\Controllers;

use Example\Controller;
use Psr\Http\Message\ResponseInterface;
use Slim\Http\Request;
use Slim\Http\Response;

class HomeController extends Controller
{
    /**
     * Lists all available articles.
     *
     * @return ResponseInterface
     */
    public function index(): ResponseInterface
    {
        $stmt = $this->db->query(
            "SELECT a.id as art_id, a.title, u.id as author_id, u.*
                        FROM articles a
                        LEFT JOIN users u ON u.id = a.user_id"
        );

        $articles = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        return $this->view('home', ['articles' => $articles]);
    }

    /**
     * Action that handles logging in.
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     *
     * @return ResponseInterface
     */
    public function login(Request $req, Response $res, array $args): ResponseInterface
    {
        $loginError = false;

        if ($req->getMethod() === 'POST') {
            $post = $req->getParsedBody();

            $login = trim((string)$post['login']);
            $password = trim((string)$post['password']);

            $user = $this->getUserRepository()->getUserByLogin($login);

            if (!$user || !password_verify($password, $user['password'])) {
                $loginError = true;
            } else {
                $_SESSION['current_user_id'] = (int)$user['id'];
                $_SESSION['csrf_token'] = base64_encode(random_bytes(15));
                $homePath = $this->container->get('router')->pathFor('home');

                return $res->withRedirect($homePath);
            }
        }

        return $this->view('login', ['loginError' => $loginError]);
    }

    /**
     * Action that handles logging out.
     *
     * @param Request $req
     * @param Response $res
     * @param array $args
     *
     * @return ResponseInterface
     */
    public function logout(Request $req, Response $res, array $args): ResponseInterface
    {
        session_destroy();

        $loginPath = $this->container->get('router')->pathFor('login');

        return $res->withRedirect($loginPath);
    }
}
