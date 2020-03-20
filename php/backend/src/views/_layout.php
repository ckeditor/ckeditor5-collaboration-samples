<!DOCTYPE html>
<!--
Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
This file is licensed under the terms of the MIT License (see LICENSE.md).
-->
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>CKEditor 5 – comments and track changes integration example</title>
    <link rel="icon" type="image/png" href="https://c.cksource.com/a/1/logos/ckeditor5.png">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css"
          integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS"
          crossorigin="anonymous">
    <style type="text/css">
        .table td, .table th {
            vertical-align: middle;
        }

        /* Not necessary if released: https://github.com/ckeditor/ckeditor5/issues/1373. */
        .media {
            display: block;
        }

        /* https://github.com/ckeditor/ckeditor5-table/issues/154. */
        .ck-content .table {
            width: auto;
        }

        .wrapper {
            overflow: hidden;
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 2em;
        }

        #editor-container {
            /* To create the column layout. */
            display: flex;
            max-width: 1250px;

            /* To make the container relative to its children. */
            position: relative;
        }

        #sidebar {
            min-width: 300px;
            font-size: 20px;
            padding: 0 10px;
            background: var(--ck-color-toolbar-background);
            border: 1px solid var(--ck-color-toolbar-border);
            border-left: 0;
		}

		#sidebar.narrow {
			min-width: 60px;
		}

		#sidebar.hidden {
			display: none;
		}

        /* Let's make the content beautiful. */
        .ck-editor[role='application'] .ck.ck-content {
            font-size: 1em;
            line-height: 1.6em;
            min-height: 200px;
            padding: 0 1.5em 2em;
        }
    </style>
</head>
<body>
<nav class="navbar navbar-expand-lg navbar-light bg-light mb-3">
    <a class="navbar-brand" href="/">
        <svg xmlns="http://www.w3.org/2000/svg" width="44" height="40" viewBox="0 0 68 64">
            <path fill="#1EBC61"
                  d="M45.684 8.79a12.604 12.604 0 0 0-1.329 5.65c0 7.032 5.744 12.733 12.829 12.733.091 0 .183-.001.274-.003v17.834a5.987 5.987 0 0 1-3.019 5.19L31.747 63.196a6.076 6.076 0 0 1-6.037 0L3.02 50.193A5.984 5.984 0 0 1 0 45.003V18.997c0-2.14 1.15-4.119 3.019-5.19L25.71.804a6.076 6.076 0 0 1 6.037 0L45.684 8.79zm11.751 15.885c-5.835 0-10.565-4.695-10.565-10.486 0-5.792 4.73-10.487 10.565-10.487C63.27 3.703 68 8.398 68 14.19c0 5.791-4.73 10.486-10.565 10.486v-.001z"/>
            <path fill="#FFF"
                  d="M60.606 14.77a2.547 2.547 0 0 0-.686-.88 2.888 2.888 0 0 0-1.026-.531 4.418 4.418 0 0 0-1.259-.175c-.134 0-.283.006-.447.018-.15.01-.3.034-.446.07l.075-1.4h3.587v-1.8h-5.462l-.214 5.06c.319-.116.682-.21 1.089-.28.406-.071.77-.107 1.088-.107.218 0 .437.021.655.063.218.041.413.114.585.218s.313.244.422.419c.109.175.163.391.163.65 0 .424-.132.745-.396.961a1.434 1.434 0 0 1-.938.325c-.352 0-.656-.1-.912-.3-.256-.2-.43-.453-.523-.762l-1.925.588c.1.35.258.664.472.943.214.279.47.514.767.706.298.191.63.339.995.443.365.104.749.156 1.151.156.437 0 .86-.064 1.272-.193.41-.13.778-.323 1.1-.581a2.8 2.8 0 0 0 .775-.981c.193-.396.29-.864.29-1.405-.001-.467-.085-.875-.252-1.225zM16.244 39.134c-.834 0-1.51.671-1.51 1.498v.715c0 .828.676 1.498 1.51 1.498h25.489c.833 0 1.51-.67 1.51-1.498v-.715c0-.827-.677-1.498-1.51-1.498h-25.49.001zM16.244 20.68c-.834 0-1.51.671-1.51 1.498v.715c0 .828.676 1.498 1.51 1.498h25.489c.833 0 1.51-.67 1.51-1.498v-.715c0-.827-.677-1.498-1.51-1.498h-25.49.001zM14.734 31.405v.715c0 .828.676 1.498 1.51 1.498h18.479c.833 0 1.509-.67 1.509-1.498v-.715c0-.827-.676-1.498-1.51-1.498H16.244c-.834 0-1.51.671-1.51 1.498z"/>
        </svg>
        <span class="align-middle ml-1">CKEditor 5 comments and track changes integration example</span>
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav mr-auto"></ul>

        <?php $currentUser = $userRepository->getCurrentUser(); ?>
        <?php if ($currentUser) : ?>
            <span class="navbar-text">
                    <img alt="User avatar" src="<?= htmlspecialchars($currentUser['avatar_url']) ?>" width="26px"
                         style="margin-right: 5px"/>
                    <strong><?= htmlspecialchars($currentUser['display_name']) ?></strong>
                </span>

            <ul class="navbar-nav ml-3 mr-3">
                <li class="nav-item">
                    <a class="nav-link" href="<?= $router->pathFor('logout') ?>">Logout</a>
                </li>
            </ul>
        <?php endif; ?>
    </div>
</nav>

<?= $content ?>

<footer class="bg-light">
    <div class="container text-center text-muted mt-5 pt-4 pb-4" style="font-size: .75em">
        <div class="col">
            <p class="mb-2"><a href="https://ckeditor.com/ckeditor-5"
                               target="_blank"
                               rel="noopener noreferrer">CKEditor 5</a> – Rich text editor of tomorrow, available today
            </p>
            <p class="mb-0">Copyright © 2003-<?php echo date("Y") ?>, <a href="https://cksource.com/" target="_blank"
                                                                         rel="noopener noreferrer">CKSource</a> – Frederico
                Knabben. All rights reserved.</p>
        </div>
    </div>
</footer>

</body>
</html>
