<?php

/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * This file is licensed under the terms of the MIT License (see LICENSE.md).
 */

namespace Example;

/**
 * Class UserRepository
 */
class UserRepository
{
    /**
     * @var \PDO
     */
    protected $db;

    /**
     * UserRepository constructor.
     *
     * @param \PDO $db
     */
    public function __construct(\PDO $db)
    {
        $this->db = $db;
    }

    /**
     * Returns an array of all user records.
     *
     * @return array
     */
    public function listUsers(): array
    {
        $stmt = $this->db->query("SELECT * FROM users");

        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    /**
     * Returns an associative array with the data of the currently logged user
     * or null if the user is anonymous.
     *
     * @return array|null
     */
    public function getCurrentUser(): ?array
    {
        $currentUserId = $this->getCurrentUserId();

        if (!$currentUserId) {
            return null;
        }

        return $this->getUserById((int)$currentUserId);
    }

    /**
     * Returns the ID of the currently logged user or null if the user is anonymous.
     *
     * @return int|null
     */
    public function getCurrentUserId(): ?int
    {
        return $_SESSION['current_user_id'] ?? null; // If not set, use John Doe.
    }

    /**
     * Returns an associative array with the data of the user with a given ID.
     *
     * @param int $id User ID.
     *
     * @return array|null
     */
    public function getUserById(int $id): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE id=:id");
        $stmt->bindParam(':id', $id, \PDO::PARAM_INT);
        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);

        return is_array($result) ? $result : null;
    }

    /**
     * Returns an associative array with the data of the user with a given login.
     *
     * @param string $login User login.
     *
     * @return array|null
     */
    public function getUserByLogin(string $login): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE login=:login");
        $stmt->bindParam(':login', $login, \PDO::PARAM_STR);
        $stmt->execute();

        $result = $stmt->fetch(\PDO::FETCH_ASSOC);

        return is_array($result) ? $result : null;
    }
}
