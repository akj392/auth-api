pipeline {
    agent any

    tools {
        nodejs 'node'
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'master',
                    url: 'https://github.com/akj392/auth-api.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Copy Files') {
            steps {
                sh '''
                rm -rf /var/www/auth-api/*
                cp -r * /var/www/auth-api/
                '''
            }
        }

        stage('Restart API') {
            steps {
                sh '''
                cd /var/www/auth-api

                sudo -u deploy pm2 restart auth-api --update-env || \
                sudo -u deploy pm2 start server.js --name auth-api --env production

                sudo -u deploy pm2 save
                '''
            }
        }

        stage('Deploy Nginx Config') {
            steps {
                sh '''
                sudo cp nginx.conf /etc/nginx/sites-available/auth-api
                sudo ln -sf /etc/nginx/sites-available/auth-api /etc/nginx/sites-enabled/auth-api

                sudo rm -f /etc/nginx/sites-enabled/default

                sudo nginx -t
                sudo systemctl reload nginx
                '''
            }
        }

        stage('Reload Nginx') {
            steps {
                sh '''
                sudo systemctl reload nginx
                '''
            }
        }

    }

    post {
        success {
            cleanWs()
            echo '✅ Auth api deployed successfully.'
        }
        failure {
            echo '❌ Build failed'
        }
    }
}
