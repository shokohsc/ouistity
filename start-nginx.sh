#!/usr/bin/env bash

export EXISTING_VARS=$(printenv | awk -F= '{print $1}' | sed 's/^/\$/g' | paste -sd,);
for file in $JSFOLDER;
do
  cat $file | envsubst $EXISTING_VARS | tee $file
done

if [[ $ENV == 'production' ]]; then
  nginx -g 'daemon off;'
else
  npm run $@
fi
