<?php

/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * This file is licensed under the terms of the MIT License (see LICENSE.md).
 */

namespace Example;

use Psr\Container\ContainerInterface;
use Psr\Http\Message\ResponseInterface;
use Slim\Http\Response;

/**
 * Class Controller
 *
 * Base class for controllers.
 */
abstract class Controller
{
    /**
     * @var ContainerInterface
     */
    protected $container;

    /**
     * @var \PDO
     */
    protected $db;

    /**
     * Controller constructor.
     *
     * @param ContainerInterface $container
     */
    public function __construct(ContainerInterface $container)
    {
        $this->container = $container;
        $this->db = $container['db'];
    }

    /**
     * A shorthand method to access UserRepository.
     *
     * @return UserRepository
     */
    protected function getUserRepository(): UserRepository
    {
        return $this->container->get('userRepository');
    }

    /**
     * A shorthand method to access the current Response object.
     *
     * @return Response
     */
    protected function getResponse(): Response
    {
        return $this->container->get('response');
    }

    /**
     * Helper method that renders the template with a given name and writes
     * the rendered content to the response.
     *
     * @param string $name View template name
     * @param array $data Data for view template.
     *
     * @return Response
     */
    protected function view(string $name, array $data = []): ResponseInterface
    {
        $router = $this->container->get('router');

        $childView = View::create($name, $data)->set('router', $router);

        $layoutView = View::create(
            '_layout',
            [
                'userRepository' => $this->container['userRepository'],
                'content' => $childView->render(),
            ]
        );
        $layoutView->set('router', $router);

        $response = $this->getResponse();

        $response->getBody()->write($layoutView->render());

        return $response;
    }

    /**
     * Shorthand method used to return a response with JSON data.
     *
     * @param array $data
     * @return ResponseInterface
     */
    protected function json(array $data): ResponseInterface
    {
        return $this->getResponse()->withJson($data);
    }

    /**
     * Shorthand method used to return a JSON response that contains an error message.
     *
     * @param string $message
     * @return ResponseInterface
     */
    protected function error(string $message): ResponseInterface
    {
        return $this->json(['ok' => false, 'error' => $message])->withStatus(400);
    }
}
