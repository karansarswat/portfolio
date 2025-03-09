<?php
session_start();
require_once('../config/db.php');

// Check if user is logged in
if (!isset($_SESSION['admin_logged_in'])) {
    header('Location: login.php');
    exit();
}

// Fetch messages from database
try {
    $stmt = $conn->query("SELECT * FROM contact_messages ORDER BY submission_date DESC");
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch(PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>

<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="../style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <style>
        .dashboard-container {
            padding: 40px 20px;
            max-width: 1200px;
            margin: 0 auto;
        }
        .messages-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background-color: var(--section-bg);
            border-radius: 8px;
            overflow: hidden;
        }
        .messages-table th,
        .messages-table td {
            padding: 15px;
            text-align: left;
            border-bottom: 1px solid rgba(241, 182, 0, 0.1);
        }
        .messages-table th {
            background-color: #f1b600;
            color: white;
        }
        .message-status {
            padding: 5px 10px;
            border-radius: 15px;
            font-size: 0.9em;
        }
        .status-new { background-color: #4bb543; color: white; }
        .status-read { background-color: #f1b600; color: white; }
        .status-replied { background-color: #45bbc9; color: white; }
        .action-btn {
            padding: 5px 10px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            margin-right: 5px;
            color: white;
        }
        .btn-read { background-color: #f1b600; }
        .btn-reply { background-color: #45bbc9; }
        .btn-delete { background-color: #f44336; }
    </style>
</head>
<body>
    <nav class="navbar">
        <ul>
            <li><a href="../index.html">View Site</a></li>
            <li><a href="logout.php">Logout</a></li>
        </ul>
    </nav>

    <div class="dashboard-container">
        <h2>Messages Dashboard</h2>
        <table class="messages-table">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($messages as $message): ?>
                <tr>
                    <td><?= htmlspecialchars(date('Y-m-d H:i', strtotime($message['submission_date']))) ?></td>
                    <td><?= htmlspecialchars($message['name']) ?></td>
                    <td><?= htmlspecialchars($message['email']) ?></td>
                    <td><?= htmlspecialchars($message['subject']) ?></td>
                    <td><span class="message-status status-<?= $message['status'] ?>"><?= ucfirst($message['status']) ?></span></td>
                    <td>
                        <button class="action-btn btn-read" onclick="markAsRead(<?= $message['id'] ?>)">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="action-btn btn-reply" onclick="replyToMessage(<?= $message['id'] ?>)">
                            <i class="fas fa-reply"></i>
                        </button>
                        <button class="action-btn btn-delete" onclick="deleteMessage(<?= $message['id'] ?>)">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>

    <script>
        function markAsRead(id) {
            updateMessageStatus(id, 'read');
        }

        function replyToMessage(id) {
            // Open reply modal or redirect to reply page
            window.location.href = `reply.php?id=${id}`;
        }

        function deleteMessage(id) {
            if (confirm('Are you sure you want to delete this message?')) {
                fetch('actions/delete_message.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: id })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        location.reload();
                    }
                });
            }
        }

        function updateMessageStatus(id, status) {
            fetch('actions/update_status.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id, status: status })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    location.reload();
                }
            });
        }
    </script>
</body>
</html> 