#!/usr/bin/env bash
if [ "${1}" == "script" ]; then
    docker build -t uumpa/migdar-internal-search-ui:latest && exit 0
elif [ "${1}" == "deploy" ]; then
    docker push uumpa/migdar-internal-search-ui:latest &&\
    docker build --build-arg REACT_APP_API_URL=https://migdar-internal-search-backend.odata.org.il/ \
           -t uumpa/migdar-internal-search-ui:latest-prod -t uumpa/migdar-internal-search-ui:${TRAVIS_COMMIT} &&\
    docker push uumpa/migdar-internal-search-ui:latest-prod && docker push uumpa/migdar-internal-search-ui:${TRAVIS_COMMIT} &&\
    exit 0
fi; exit 1