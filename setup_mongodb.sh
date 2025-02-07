#!/bin/bash

# Exit on error
set -e

echo "🗄️ Setting up MongoDB..."

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "Please run with sudo"
    exit 1
fi

# Install dependencies
apt-get install -y gnupg curl

# Import MongoDB public GPG key
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | \
    gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
    --dearmor

# Add MongoDB repository for Ubuntu
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
    tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install libssl1.1 from Ubuntu 22.04 (jammy)
curl -fsSL http://archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2_amd64.deb -o /tmp/libssl1.1.deb
dpkg -i /tmp/libssl1.1.deb || true
rm /tmp/libssl1.1.deb

# Update package list and install MongoDB
apt-get update
apt-get install -y mongodb-org

# Start MongoDB and enable it on boot
systemctl start mongod
systemctl enable mongod

# Wait for MongoDB to start
sleep 5

# Create the database and user (only if not already exists)
mongosh admin --eval '
    if (!db.getUser("admin")) {
        db.createUser({
            user: "admin",
            pwd: "password",  // You should change this to a secure password
            roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
        });
    }
    db = db.getSiblingDB("lnboard");
    if (!db.getCollectionNames().includes("canvases")) {
        db.createCollection("canvases");
    }
'

# Secure MongoDB - only allow local connections
if ! grep -q "security:" /etc/mongod.conf; then
    echo "security:
  authorization: enabled" | tee -a /etc/mongod.conf
fi

# Restart MongoDB to apply changes
systemctl restart mongod

echo "✅ MongoDB setup complete!" 