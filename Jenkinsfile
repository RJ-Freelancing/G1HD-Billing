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
  return currentBranch==env.DEVELOPMENT_BRANCH ? ':development' : ':production';
}

pipeline {
  // construct global env variables
  environment {
    SITE_NAME = 'g1hd' // Name will be used for tagging along with getBuildTag/suffix/prefix
    PRODUCTION_BRANCH = 'master' // Source branch used for production
    DEVELOPMENT_BRANCH = 'dev' // Source branch used for development
    SLACK_CHANNEL = '#builds' // Slack channel to send build notifications
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
            -Dsonar.projectName=${env.SITE_NAME}:${currentBranch} \
            -Dsonar.projectKey=${env.SITE_NAME}:${currentBranch} \
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
        dir('server'){
          script {
            try {
              sh 'yarn test-report 2>commandResult'
            } catch (e) {
              if (!errorMessage) {
                errorMessage = "Failed while testing.\n\n${readFile('commandResult').trim()}\n\n${e.message}"
              }
              currentBuild.currentResult = 'UNSTABLE'
            }
          }
        }
      }
      post {
        always {
          // Publish junit test results
          junit testResults: './server/coverage/junit.xml', allowEmptyResults: true
          // Publish clover.xml and html(if generated) test coverge report
          step([
            $class: 'CloverPublisher',
            cloverReportDir: './server/coverage',
            cloverReportFileName: 'clover.xml',
            failingTarget: [methodCoverage: 1, conditionalCoverage: 1, statementCoverage: 1]
          ])
          script {
            if (!errorMessage && currentBuild.resultIsWorseOrEqualTo('UNSTABLE')) {
              errorMessage = "Insufficent Test Coverage."
              currentBuild.currentResult = 'UNSTABLE'
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
            echo "TODO: Need to decide on build step"
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
        echo "TODO: Need to decide on deploy step"
      }
    }
  }
  post {
    always {
      notifySlack message: errorMessage, channel: env.SLACK_CHANNEL
      cleanWs() // Recursively clean workspace
    }
  }
}