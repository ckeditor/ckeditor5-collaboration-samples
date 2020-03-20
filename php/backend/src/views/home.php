<div class="container">
    <h1 style="margin: 2rem 0">Articles</h1>
    <table class="table">
        <thead>
        <tr>
            <th scope="col">#</th>
            <th scope="col">Title</th>
            <th scope="col">Author</th>
            <th scope="col">&nbsp;</th>
        </tr>
        </thead>
        <tbody>
        <?php $i = 1;
        foreach ($articles as $a): ?>
            <tr>
                <th><?= $i++ ?></th>
                <td>
                    <a href="<?= $router->pathFor('edit-article', ['article_id' => $a['art_id']]) ?>">
                        <?= htmlspecialchars($a['title']) ?>
                    </a>
                </td>
                <td>
                    <img alt="User avatar" src="<?= htmlspecialchars($a['avatar_url']) ?>" width="26px"
                         style="margin-right: 5px"/>
                    <?= htmlspecialchars($a['display_name']) ?>
                </td>
                <td><a href="<?= $router->pathFor('edit-article', ['article_id' => $a['art_id']]) ?>"
                       class="btn btn-sm btn-primary">Edit article</a>
                </td>
            </tr>
        <?php endforeach; ?>
        </tbody>
    </table>
</div>

