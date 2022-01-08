pipeline{
    agent any
    stages{
        stage("clean-up"){
            steps{
                echo "========executing clean-up========"
                  script {
                      try {
                          sh "docker-compose -f docker-compose.dev.yml down"
                          sh "docker-compose  down"
                      }
                      catch (exception) {
                          echo "containers are not running or configuration has changed"
                      }
                  }


                script {
                    try {
                        sh "docker image rmi docker.kozae.de/kalila-frontend:dev -f"
                    }
                    catch (exception) {
                        echo "docker.kozae.de/kalila-frontend:dev image was not present"
                    }
                }
            }
        }

        stage("build image, create and run container"){
            steps{
                echo "====++++executing build image, create and run container++++===="
                sh "docker build -t docker.kozae.de/kalila-frontend:dev -f dev.Dockerfile ."
                sh "docker-compose -f docker-compose.dev.yml up --detach"
            }
        }
    }

}
