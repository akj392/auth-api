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

        stage('Restart pm2') {
            steps {
                sh '''
                export NODE_ENV=production
                pm2 restart auth-api --update-env || pm2 start server.js --name auth-api
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
