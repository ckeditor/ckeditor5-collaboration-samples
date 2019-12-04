<?php

/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * This file is licensed under the terms of the MIT License (see LICENSE.md).
 */

namespace Example;

/**
 * Class View
 *
 * View rendering logic.
 */
class View
{
    /**
     * Extension used by template files.
     */
    const EXTENSION = '.php';

    /**
     * The name of the view as a lowercase relative path in the Views root directory.
     * @var string
     */
    protected $name;

    /**
     * Data to be passed to the template.
     *
     * @var array
     */
    protected $data = [];

    /**
     * Factory method.
     *
     * @param string $name
     * @param array $data
     * @return View
     */
    public static function create(string $name, array $data = [])
    {
        return new View($name, $data);
    }

    /**
     * View constructor.
     *
     * @param string $name
     * @param array $data
     */
    public function __construct(string $name, array $data = [])
    {
        $this->name = $name;
        $this->data = $data;
    }

    /**
     * Sets the value to be passed to the template.
     *
     * @param $name
     * @param $value
     * @return $this
     */
    public function set(string $name, $value): self
    {
        $this->data[$name] = $value;

        return $this;
    }

    /**
     * Renders this view object.
     *
     * @return string
     */
    public function render(): string
    {
        $viewPath = __DIR__.'/views/'.$this->name.self::EXTENSION;

        if (!is_readable($viewPath)) {
            throw new \RuntimeException(
                sprintf(
                    "Requested view file not found: %s. Path used: %s",
                    htmlspecialchars($this->name),
                    htmlspecialchars($viewPath)
                )
            );
        }

        // Render and grab output.
        ob_start();
        extract($this->data);

        include $viewPath;

        return ob_get_clean();
    }

    public function __toString()
    {
        return $this->render();
    }
}
