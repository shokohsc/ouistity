#!/usr/bin/env bash
set -e

JSON_STRING='window.configs = { \
  "ENV":"'"${ENV}"'", \
  "API_GATEWAY_HOST":"'"${API_GATEWAY_HOST}"'", \
  "API_GATEWAY_PORT":"'"${API_GATEWAY_PORT}"'", \
  "GRAPHQL_GATEWAY_HOST":"'"${GRAPHQL_GATEWAY_HOST}"'", \
  "GRAPHQL_GATEWAY_PORT":"'"${GRAPHQL_GATEWAY_PORT}"'", \
  "USE_SENTRY":"'"${USE_SENTRY}"'", \
  "SENTRY_DSN":"'"${SENTRY_DSN}"'", \
  "USE_THUMBOR":"'"${USE_THUMBOR}"'", \
  "THUMBOR_HOST":"'"${THUMBOR_HOST}"'", \
  "THUMBOR_PORT":"'"${THUMBOR_PORT}"'", \
  "INTERNAL_API_GATEWAY_URL":"'"${INTERNAL_API_GATEWAY_URL}"'" \
}'

if [[ $ENV == 'production' ]]; then
  sed -i "s@// CONFIGURATIONS_PLACEHOLDER@${JSON_STRING}@" /usr/share/nginx/html/index.html
  nginx -g 'daemon off;'
else
  echo "${JSON_STRING}"
  sed -i "s@// CONFIGURATIONS_PLACEHOLDER@${JSON_STRING}@" /app/index.html
  npm run $@
fi
