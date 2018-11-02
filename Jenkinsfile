#!groovy

@Library('notifySlack') _

def errorMessage = "" // Used to check buildStatus during any stage
def commandResult = "" // Used to store STDOUT and STDERR

def isDeploymentBranch(){
  def currentBranch = env.GIT_BRANCH.getAt((env.GIT_BRANCH.indexOf('/')+1..-1))
  return currentBranch==env.PRODUCTION_BRANCH || currentBranch==env.DEVELOPMENT_BRANCH;
}

def getBuildTag() {
  def currentBranch = env.GIT_BRANCH.getAt((env.GIT_BRANCH.indexOf('/')+1..-1))
  return currentBranch==env.DEVELOPMENT_BRANCH ? ':staging' : ':production';
}

pipeline {
  // construct global env variables
  environment {
    SITE_NAME = 'g1hd' // Name will be used for tagging along with getBuildTag/suffix/prefix
    PRODUCTION_BRANCH = 'master' // Source branch used for production
    DEVELOPMENT_BRANCH = 'dev' // Source branch used for staging
    SLACK_CHANNEL = '#g1hd' // Slack channel to send build notifications
  }
  agent any
  stages {
    stage ('Environment') {
      steps {
        sh 'git --version'
        echo "Branch: ${env.GIT_BRANCH}"
        sh 'docker -v'
        sh 'printenv'
      }
    }

    stage('Sonarqube'){
      steps {
        script {
          scannerHome = tool 'sonarScanner';
          currentBranch = env.GIT_BRANCH.getAt((env.GIT_BRANCH.indexOf('/')+1..-1));
        }
        withSonarQubeEnv('sonarScanner'){
          sh """\
            ${scannerHome}/bin/sonar-scanner -e \
            -Dsonar.projectName=${env.SITE_NAME} \
            -Dsonar.projectKey=${env.SITE_NAME} \
            -Dsonar.branch.name=${currentBranch} \
            -Dsonar.sources=. \
          """
        }
      }
    }

    stage ('Test API') {
      // Skip stage if an error has occured in previous stages
      when { expression { return !errorMessage; } }
      steps {
        // Test
        script {
          try {
            sh 'docker run --name mongo-testing -d mongo'
            sh 'cd server && docker build -t server-test -f Dockerfile.test . 2>commandResult'
            sh 'cd server && docker run --name=server-test-container --link mongo-testing:mongo -e API_PORT=3001 -e JWT_SECRET=testing -e MONGO_URL=mongodb://mongo/g1hd server-test 2>commandResult'
          } catch (e) {
            if (!errorMessage) {
              errorMessage = "Failed while running tests.\n\n${readFile('commandResult').trim()}\n\n${e.message}"
            }
            currentBuild.currentResult = 'UNSTABLE'
          }
        }
      }
      post {
        always {
          // Publish junit test results
          sh 'docker cp server-test-container:/app/coverage ./server/coverage 2>commandResult'
          junit testResults: 'server/coverage/junit.xml', allowEmptyResults: true
          script {
            if (!errorMessage && currentBuild.resultIsWorseOrEqualTo('UNSTABLE')) {
              errorMessage = "Failing Tests."
              // currentBuild.currentResult = 'UNSTABLE'
            }
          }
          // Publish clover.xml and html(if generated) test coverge report
          step([
            $class: 'CloverPublisher',
            cloverReportDir: './server/coverage',
            cloverReportFileName: 'clover.xml',
            failingTarget: [methodCoverage: 0.5, conditionalCoverage: 0.5, statementCoverage: 0.5]
          ])
          script {
            if (!errorMessage && currentBuild.resultIsWorseOrEqualTo('UNSTABLE')) {
              errorMessage = "Insufficent Test Coverage."
              // currentBuild.currentResult = 'UNSTABLE'
            }
          }
        }
      }
    }

    stage ('Build') {
      // Skip stage if an error has occured in previous stages or if not isDeploymentBranch
      when { expression { return !errorMessage && isDeploymentBranch(); } }
      steps {
        script {
          try {
            sh "docker build -t ${env.SITE_NAME}${getBuildTag()} --no-cache ."
          } catch (e) {
            if (!errorMessage) {
              errorMessage = "Failed while building.\n\n${readFile('commandResult').trim()}\n\n${e.message}"
            }
            currentBuild.currentResult = 'FAILURE'
          }
        }
      }
    }

    stage('Deploy') {
      // Skip stage if an error has occured in previous stages or if not isDeploymentBranch
      when { expression { return !errorMessage && isDeploymentBranch(); } }
      steps {
        sh "docker image tag ${env.SITE_NAME}${getBuildTag()} registry.jana19.org/${env.SITE_NAME}${getBuildTag()}"
        sh "docker push registry.jana19.org/${env.SITE_NAME}${getBuildTag()}"
        sh "docker rmi ${env.SITE_NAME}${getBuildTag()}"
        sh "docker rmi registry.jana19.org/${env.SITE_NAME}${getBuildTag()}"
      }
    }
  }
  post {
    always {
      notifySlack message: errorMessage, channel: env.SLACK_CHANNEL
      cleanWs() // Recursively clean workspace
      sh 'docker stop mongo-testing'
      sh 'docker container prune -f'
      sh 'docker image prune -af'
      sh 'docker volume prune -f'
      sh 'docker network prune -f'
      echo "FINAL BUILD MESSAGE: $errorMessage"
    }
  }
}