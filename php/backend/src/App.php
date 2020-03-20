<?php

/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * This file is licensed under the terms of the MIT License (see LICENSE.md).
 */

namespace Example;

use Example\Controllers\ArticleController;
use Example\Controllers\CommentController;
use Example\Controllers\HomeController;
use Example\Controllers\SuggestionController;
use Slim\Http\Request;
use Slim\Http\Response;
use Slim\Route;

/**
 * Class App
 *
 * Main application class.
 */
class App extends \Slim\App
{
    /**
     * Application constructor.
     */
    public function __construct()
    {
        parent::__construct(
            [
                'settings' => [
                    'determineRouteBeforeAppMiddleware' => true,
                    'debug' => true,
                ],
            ]
        );
    }

    /**
     * @param bool $silent
     *
     * @return \Psr\Http\Message\ResponseInterface
     */
    public function run($silent = false)
    {
        session_start();

        $container = $this->getContainer();

        $container['db'] = function () {
            return new \PDO(sprintf('sqlite:%s', __DIR__.'/../database.sqlite'));
        };

        $container['userRepository'] = function ($c) {
            return new UserRepository($c['db']);
        };

        $this->add([$this, 'authMiddleware']);
        $csrfMiddleware = [$this, 'csrfMiddleware'];

        $this->get('/', HomeController::class.':index')->setName('home');
        $this->map(['GET', 'POST'], '/login', HomeController::class.':login')->setName('login');
        $this->get('/logout', HomeController::class.':logout')->setName('logout');
        $this->get('/article/edit/{article_id}', ArticleController::class.':edit')->setName('edit-article');
        $this->post('/article/save/{article_id}', ArticleController::class.':save')->setName('save-article')->add(
            $csrfMiddleware
        );

        // Comments API routes
        $this->get('/comments/thread/{thread_id}', CommentController::class.':getThread');
        $this->post('/comments', CommentController::class.':add')->add($csrfMiddleware);
        $this->post('/comments/update/{comment_id}/{thread_id}', CommentController::class.':update')->add(
            $csrfMiddleware
        );
        $this->post('/comments/delete/{comment_id}/{thread_id}', CommentController::class.':remove')->add(
            $csrfMiddleware
        );
        $this->post('/suggestions', SuggestionController::class.':add')->add(
            $csrfMiddleware
        );
        $this->post('/suggestions/update/{suggestion_id}', SuggestionController::class.':update')->add(
            $csrfMiddleware
        );
        $this->get('/suggestions/{suggestion_id}', SuggestionController::class.':get');

        return parent::run($silent);
    }

    /**
     * Authentication middleware.
     *
     * @param Request $req
     * @param Response $res
     * @param $next
     *
     * @return Response
     */
    public function authMiddleware(Request $req, Response $res, $next)
    {
        /** @var Route $currentRoute */
        $currentRoute = $req->getAttribute('route');

        if ($currentRoute && $currentRoute->getName() === 'login') {
            return $next($req, $res);
        }

        $container = $this->getContainer();

        /** @var UserRepository $userRepository */
        $userRepository = $container['userRepository'];
        $currentUser = $userRepository->getCurrentUser();

        if ($currentUser) {
            $container['currentUser'] = $currentUser;

            return $next($req, $res);
        }

        $loginPath = $container->get('router')->pathFor('login');

        return $res->withRedirect($loginPath);
    }

    /**
     * CSRF protection middleware.
     *
     * @param Request $req
     * @param Response $res
     *
     * @param $next
     * @return Response
     */
    public function csrfMiddleware(Request $req, Response $res, $next)
    {
        $post = $req->getParsedBody();

        if (empty($post['csrf_token']) || $post['csrf_token'] !== $_SESSION['csrf_token']) {
            return $res->withJson(['ok' => false, 'error' => 'Invalid CSRF token'])->withStatus(400);
        }

        return $next($req, $res);
    }
}
