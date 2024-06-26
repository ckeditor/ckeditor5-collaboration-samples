<?php

/**
 * @license Copyright (c) 2003-2024, CKSource Holding sp. z o.o. All rights reserved.
 * This file is licensed under the terms of the MIT License (see LICENSE.md).
 */

define('LICENSE_KEY', 'license-key');

require_once __DIR__ . '/backend/vendor/autoload.php';

$app = new \Example\App();
$app->run();
