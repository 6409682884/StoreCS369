#!/bin/bash

# Update the instance
sudo yum update -y || sudo apt-get update -y

# Install Git
sudo yum install -y git || sudo apt-get install -y git

# Install Node.js and npm for Amazon Linux 2
sudo yum install -y nodejs npm || {
    # For Ubuntu-based instances
    curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
    sudo apt-get install -y nodejs
}

# Install pm2 globally using npm
sudo npm install pm2 -g

# Go to the home directory of the current user
cd /home/ec2-user

# Clone the repository
git clone https://github.com/6409682884/StoreCS369.git

# Navigate to the project directory and install dependencies
#cd StoreCS369/react-app/
#sudo npm install

# Start the application using pm2
sudo pm2 start index.js

# Save the current pm2 processes
sudo pm2 save

# Ensure pm2 starts on boot
sudo pm2 startup


sudo yum install -y nginx

sudo systemctl start nginx
sudo systemctl enable nginx

sudo cp -r /home/ec2-user/StoreCS369/store-node.js/controller /usr/share/nginx/html/
sudo cp -r /home/ec2-user/StoreCS369/store-node.js/route /usr/share/nginx/html/
sudo cp -r /home/ec2-user/StoreCS369/store-node.js/uploads /usr/share/nginx/html/
sudo cp /home/ec2-user/StoreCS369/store-node.js/middleware.js /usr/share/nginx/html/
sudo cp /home/ec2-user/StoreCS369/store-node.js/package-lock.json /usr/share/nginx/html/
sudo cp /home/ec2-user/StoreCS369/store-node.js/package.json /usr/share/nginx/html/
sudo cp /home/ec2-user/StoreCS369/store-node.js/sqlconfig.js /usr/share/nginx/html/

cd /usr/share/nginx/html/
sudo npm install

# Restart Nginx to reflect the changes
sudo systemctl restart nginx