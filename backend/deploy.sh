#!/bin/bash

# Load environment variables from .env file
ENV_FILE='../.env'
export $(grep -v '^#' $ENV_FILE | xargs)

# Variables
PROJECT_DIR=$(pwd)
SERVER_IP=$(curl -s http://checkip.amazonaws.com)  # Automatically fetch the server's public IPDOMAIN_NAME="${1:-}"  # Optional domain name passed as an argument
VENV_DIR="$PROJECT_DIR/../env"
GUNICORN_SERVICE="/etc/systemd/system/$PROJECT_NAME.service"
NGINX_CONFIG="/etc/nginx/sites-available/$PROJECT_NAME"
NGINX_ENABLED="/etc/nginx/sites-enabled/$PROJECT_NAME"

echo $SERVER_IP 
echo $VENV_DIR 
echo $NGINX_CONFIG 
echo $NGINX_ENABLED 
echo $PROJECT_NAME 
echo $DOMAIN_NAME =
echo $PROJECT_DIR 


# Update the package list and upgrade all packages
echo "Updating the package list and upgrading all packages..."
sudo apt update && sudo apt upgrade -y
sudo apt-get install build-essential -y

# Install necessary dependencies for adding new repositories
echo "Installing necessary dependencies..."
sudo apt install software-properties-common -y
sudo apt-get install gcc -y

# Add the deadsnakes PPA for newer Python versions
echo "Adding the deadsnakes PPA for newer Python versions..."
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt update

# Install necessary packages (I am specifically using python3.12 here but you can change this to any version you want)
sudo apt install -y python3.12 python3.12-venv python3.12-dev libpq-dev nginx curl

# Set up virtual environment
python3.12 -m venv $VENV_DIR
source $VENV_DIR/bin/activate

# install all requirements. 
pip install -r ../requirements.txt

# Install deployment requirements and any extra project requirements
pip install psycopg2 django gunicorn python-dotenv django-cors-headers djangorestframework

# # Update requirements.txt file
# pip freeze > ../requirements.txt

# Configure Django for production
# if [ -n "$DOMAIN_NAME" ]; then
#     sed -i "s/ALLOWED_HOSTS = \[\]/ALLOWED_HOSTS = ['$DOMAIN_NAME', '$SERVER_IP']/" $PROJECT_DIR/$PROJECT_NAME/settings.py
# else
#     sed -i "s/ALLOWED_HOSTS = \[\]/ALLOWED_HOSTS = ['$SERVER_IP']/" $PROJECT_DIR/$PROJECT_NAME/settings.py
# fi

# Set URL parameter in .env file
echo "Setting URL parameter in .env file..."
if [ -z "$DOMAIN_NAME" ]; then
    echo "URL=http://$SERVER_IP" >> $ENV_FILE
else
    echo "URL=https://$DOMAIN_NAME" >> $ENV_FILE
fi


# Apply Django migrations
echo "Applying Django migrations..."
python $PROJECT_DIR/manage.py makemigrations
python $PROJECT_DIR/manage.py migrate
python $PROJECT_DIR/manage.py createsuperuser

# Configure Gunicorn
cat <<EOF | sudo tee $GUNICORN_SERVICE
[Unit]
Description=gunicorn daemon
After=network.target

[Service]
User=ubuntu
Group=ubuntu
WorkingDirectory=$PROJECT_DIR
ExecStart=$VENV_DIR/bin/gunicorn --workers 3 --bind unix:$PROJECT_DIR/$PROJECT_NAME.sock $PROJECT_NAME.wsgi:application

[Install]
WantedBy=multi-user.target
EOF

# Give ubuntu all the same access rights as ubuntu
# sudo usermod -aG ubuntu ubuntu

# give ubuntu permissions and ownership of the project directory
# sudo chown -R ubuntu:ubuntu $PROJECT_DIR/../
# sudo chmod -R 755 $PROJECT_DIR/../../
# sudo chmod 400 $ENV_FILE


# Start and enable Gunicorn
sudo systemctl daemon-reload
sudo systemctl start gunicorn
sudo systemctl enable gunicorn

# Configure Nginx
sudo rm /etc/nginx/sites-enabled/default

cat <<EOF | sudo tee $NGINX_CONFIG
server {
    listen 80;
    server_name ${DOMAIN_NAME:-$SERVER_IP};

    location / {
        proxy_pass http://unix:$PROJECT_DIR/$PROJECT_NAME.sock;
        # proxy_set_header Host \$host;
        # proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /static/ {
        alias $PROJECT_DIR/frontend/build/static/;
    }

    location /media/ {
        alias $PROJECT_DIR/frontend/build/media/;
    }
}
EOF

# Enable the Nginx configuration and test it
sudo ln -s $NGINX_CONFIG $NGINX_ENABLED
sudo nginx -t

# Test the Nginx configuration
if sudo nginx -t; then
    echo "Nginx configuration test passed"
    # Reload Nginx to apply changes
    sudo systemctl reload nginx
    echo "Nginx reloaded successfully"
else
    echo "Nginx configuration test failed."
    exit 1
fi

# Adjust firewall settings
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw allow OpenSSH
sudo systemctl restart ssh

# Restart Nginx
sudo systemctl daemon-reload
sudo systemctl start barnsteensieraden
sudo systemctl enable barnsteensieraden
sudo systemctl start gunicorn
sudo systemctl enable gunicorn
sudo systemctl restart nginx

# Secure the application with SSL using Let's Encrypt (optional)
if [ -n "$DOMAIN_NAME" ]; then
    sudo apt install -y certbot python3-certbot-nginx
    sudo certbot --nginx -d $DOMAIN_NAME
fi

sudo systemctl daemon-reload

sudo  git config --global --add safe.directory $PROJECT_DIR/../

echo "Deployment completed successfully!"
# Configure Django for production
if [ -n "$DOMAIN_NAME" ]; then
    echo "https://$DOMAIN_NAME"
else
    echo "http://$SERVER_IP"
fi
