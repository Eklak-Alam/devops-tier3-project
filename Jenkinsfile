pipeline {
    agent any

    environment {
        DOCKER_USER = 'eklakalam'
        
        // ✅ UPDATED IP ADDRESS
        APP_SERVER_IP = '13.201.73.113'
        
        FRONTEND_IMAGE = "${DOCKER_USER}/devops-tier3-frontend"
        BACKEND_IMAGE = "${DOCKER_USER}/devops-tier3-backend"
    }

    stages {
        // ----------------------------------------------------
        // STAGE 1: GET CODE
        // ----------------------------------------------------
        stage('Checkout Code') {
            steps {
                // Ensure this URL is correct for your repo
                git branch: 'main', url: 'https://github.com/Eklak-Alam/devops-tier3-project.git'
            }
        }

        // ----------------------------------------------------
        // STAGE 2: BUILD & PUSH
        // ----------------------------------------------------
        stage('Build & Push Docker Images') {
            steps {
                script {
                    echo "🐳 Logging into Docker Hub..."
                    // Make sure 'docker-hub-login' exists in Jenkins Credentials
                    withCredentials([usernamePassword(credentialsId: 'docker-hub-login', passwordVariable: 'DOCKER_PASS', usernameVariable: 'DOCKER_USER')]) {
                        sh "echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin"
                        
                        echo "🔨 Building Backend..."
                        sh "docker build -t ${BACKEND_IMAGE}:latest ./devops-tier3-backend"
                        sh "docker push ${BACKEND_IMAGE}:latest"

                        echo "🔨 Building Frontend..."
                        // Passing the new IP to the frontend build args
                        sh "docker build --build-arg NEXT_PUBLIC_API_URL=http://${APP_SERVER_IP}:5000 -t ${FRONTEND_IMAGE}:latest ./devops-tier3-frontend"
                        sh "docker push ${FRONTEND_IMAGE}:latest"
                    }
                }
            }
        }

        // ----------------------------------------------------
        // STAGE 3: DEPLOY (Copy Config + Restart)
        // ----------------------------------------------------
        stage('Deploy to App Server') {
            steps {
                // Make sure 'ec2-ssh-key' matches the key for the NEW IP (13.201.73.113)
                sshagent(['ec2-ssh-key']) {
                    echo "🚀 Connecting to App Server to Deploy..."
                    sh """
                        # 1. Copy the docker-compose.yml file to the server
                        scp -o StrictHostKeyChecking=no docker-compose.yml ubuntu@${APP_SERVER_IP}:/home/ubuntu/
                        
                        # 2. SSH in and Deploy
                        ssh -o StrictHostKeyChecking=no ubuntu@${APP_SERVER_IP} '
                            cd /home/ubuntu/
                            
                            # Standard Deployment Steps
                            sudo docker-compose down
                            sudo docker-compose pull
                            sudo docker-compose up -d
                            sudo docker image prune -f
                        '
                    """
                }
            }
        }
    }
}