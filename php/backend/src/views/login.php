<form class="col-sm-4 offset-sm-4 clearfix" style="margin-top: 60px" method="post">
    <?php if ($loginError): ?>
        <div class="alert alert-danger" role="alert">
            Invalid credentials.
        </div>
    <?php endif; ?>
    <div class="form-group">
        <label for="login">Login</label>
        <input type="text" class="form-control" id="login" name="login" placeholder="Login">
    </div>
    <div class="form-group">
        <label for="password">Password</label>
        <input type="password" class="form-control" id="password" name="password" placeholder="Password">
    </div>
    <button type="submit" class="btn btn-primary float-right">Log In</button>
</form>

<div class="col-sm-4 offset-sm-4" style="margin-top: 50px">
    <p>Please use one of predefined accounts to log in:</p>
    <table class="table">
        <thead>
        <tr>
            <th>Login</th>
            <th>Password</th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td><code>john</code></td>
            <td><code>123</code></td>
        </tr>
        <tr>
            <td><code>ella</code></td>
            <td><code>123</code></td>
        </tr>
        <tr>
            <td><code>matthew</code></td>
            <td><code>123</code></td>
        </tr>
        </tbody>
    </table>
</div>