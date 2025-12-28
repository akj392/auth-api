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
            echo '✅ Auth api deployed successfully.'
        }
        failure {
            echo '❌ Build failed'
        }
    }
}
