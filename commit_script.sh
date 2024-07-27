#!/bin/bash

# Ensure you are in the git repository you want to commit to
# cd /path/to/your/repository

# Array of commit messages related to working on a chat app
commit_messages=(
  "Initial commit for chat app"
  "Set up project structure"
  "Add user authentication"
  "Implement chat UI"
  "Add message sending functionality"
  "Set up real-time messaging"
  "Create user profile page"
  "Implement user status updates"
  "Fix message timestamp bug"
  "Add chat room feature"
  "Optimize database queries"
  "Refactor authentication code"
  "Improve UI responsiveness"
  "Implement message read receipts"
  "Add typing indicators"
  "Set up push notifications"
  "Fix chat room creation bug"
  "Improve error handling"
  "Add user search functionality"
  "Optimize real-time messaging performance"
  "Implement message deletion feature"
  "Set up unit tests for message handling"
  "Add support for image messages"
  "Improve user profile page UI"
  "Fix user status update bug"
  "Add user blocking functionality"
  "Implement chat room invitation feature"
  "Improve database indexing"
  "Refactor chat UI components"
  "Add emoji support in messages"
  "Set up integration tests"
  "Improve push notification handling"
  "Fix image upload bug"
  "Optimize app startup time"
  "Implement chat history search"
  "Add message forwarding feature"
  "Improve app security"
  "Fix user blocking bug"
  "Add support for video messages"
  "Improve message encryption"
  "Refactor notification handling"
  "Fix chat history search bug"
)

# Loop through each day from Jan 1, 2021 to Feb 12, 2021
start_date="2021-01-01"
end_date="2021-02-12"

current_date="$start_date"

while [[ "$current_date" < "$end_date" ]] || [[ "$current_date" == "$end_date" ]]; do
  # Format the date for the commit
  formatted_date=$(date -d "$current_date" +"%a %b %d %H:%M:%S %Y %z")

  # Create or update a dummy file
  echo "Update on $current_date" > chatapp.txt

  # Add the file to the staging area
  git add chatapp.txt

  # Get a random commit message
  commit_message=${commit_messages[$RANDOM % ${#commit_messages[@]}]}

  # Commit with the specified date and random message
  GIT_AUTHOR_DATE="$formatted_date" GIT_COMMITTER_DATE="$formatted_date" git commit -m "$commit_message"

  # Move to the next day
  current_date=$(date -I -d "$current_date + 1 day")
done