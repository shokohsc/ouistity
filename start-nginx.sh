#!/usr/bin/env bash

JSON_STRING='window.configs = { \
  "ENV":"'"${ENV}"'", \
  "API_GATEWAY_HOST":"'"${API_GATEWAY_HOST}"'", \
  "API_GATEWAY_PORT":"'"${API_GATEWAY_PORT}"'", \
  "GRAPHQL_GATEWAY_HOST":"'"${GRAPHQL_GATEWAY_HOST}"'", \
  "GRAPHQL_GATEWAY_PORT":"'"${GRAPHQL_GATEWAY_PORT}"'", \
  "USE_THUMBOR":"'"${USE_THUMBOR}"'", \
  "THUMBOR_HOST":"'"${THUMBOR_HOST}"'", \
  "THUMBOR_PORT":"'"${THUMBOR_PORT}"'", \
  "THUMBOR_API_GATEWAY_URL":"'"${THUMBOR_API_GATEWAY_URL}"'" \
}'
sed -i "s@// CONFIGURATIONS_PLACEHOLDER@${JSON_STRING}@" /usr/share/nginx/html/index.html

if [[ $ENV == 'production' ]]; then
  nginx -g 'daemon off;'
else
  npm run $@
fi
