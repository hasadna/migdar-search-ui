#!/usr/bin/env bash

DOCKER_IMAGE=uumpa/hasadna-migdar-internal-search-ui
REACT_APP_API_URL=https://migdar-internal-search-backend.odata.org.il/


if [ "${1}" == "script" ]; then
    docker build -t ${DOCKER_IMAGE}:latest . && exit 0
elif [ "${1}" == "deploy" ]; then
    docker push ${DOCKER_IMAGE}:latest &&\
    docker build --build-arg REACT_APP_API_URL=${REACT_APP_API_URL} \
           -t ${DOCKER_IMAGE}:latest-prod -t ${DOCKER_IMAGE}:${TRAVIS_COMMIT} . &&\
    docker push ${DOCKER_IMAGE}:latest-prod && docker push ${DOCKER_IMAGE}:${TRAVIS_COMMIT} &&\
    exit 0
fi; exit 1