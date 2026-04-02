#!/bin/bash
# Database backup script

BACKUP_DIR="./database/backup"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="trivaro_backup_$TIMESTAMP.gz"

echo "Creating backup: $BACKUP_FILE"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Backup MongoDB
mongodump --uri="$MONGODB_URI" --gzip --archive="$BACKUP_DIR/$BACKUP_FILE"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "trivaro_backup_*.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/$BACKUP_FILE"

# Upload to S3 (optional)
if [ ! -z "$AWS_S3_BUCKET" ]; then
    aws s3 cp "$BACKUP_DIR/$BACKUP_FILE" "s3://$AWS_S3_BUCKET/backups/"
    echo "Backup uploaded to S3"
fi
