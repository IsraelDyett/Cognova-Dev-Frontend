docker-compose up
docker-compose stop
curl -sL https://appwrite.io/cli/install.sh | bash
docker exec appwrite doctor
sudo ln -s /etc/nginx/sites-available/appwrite /etc/nginx/sites-enabled/
