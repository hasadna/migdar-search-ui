if [ "${1}" == "install" ]; then
    curl -L https://raw.githubusercontent.com/OriHoch/travis-ci-operator/master/travis_ci_operator.sh \
        > $HOME/bin/travis_ci_operator.sh &&\
    bash $HOME/bin/travis_ci_operator.sh init &&\
    travis_ci_operator.sh docker-login

elif [ "${1}" == "script" ]; then
    docker build --build-arg REACT_APP_API_URL=${REACT_APP_API_LOCAL_URL} \
           -t ${DOCKER_IMAGE}:latest .

elif [ "${1}" == "deploy" ]; then
    if [ "${TRAVIS_BRANCH}" == "master" ] &&\
       [ "${TRAVIS_TAG}" == "" ] &&\
       [ "${TRAVIS_PULL_REQUEST}" == "false" ]
    then
        docker push ${DOCKER_IMAGE}:latest &&\
        docker build --build-arg REACT_APP_API_URL=${REACT_APP_API_REMOTE_URL} \
               -t ${DOCKER_IMAGE}:latest-prod -t ${DOCKER_IMAGE}:${TRAVIS_COMMIT} . &&\
        docker push ${DOCKER_IMAGE}:latest-prod && docker push ${DOCKER_IMAGE}:${TRAVIS_COMMIT} &&\
        echo Great Success &&\
        echo &&\
        echo ${DOCKER_IMAGE}:latest &&\
        echo ${DOCKER_IMAGE}:latest-prod &&\
        echo ${DOCKER_IMAGE}:${TRAVIS_COMMIT}
    else
        echo Skipping deployment
    fi

fi
