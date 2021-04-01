#!/bin/bash

. ./packages/api/.env


yes y | aws configure

aws dynamodb create-table --table-name maker-badges \
  --region local \
  --attribute-definitions AttributeName=templateId,AttributeType=N AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=25,WriteCapacityUnits=25 \
  --global-secondary-indexes 'IndexName=templateId-index,KeySchema=[{AttributeName=templateId,KeyType=HASH}],Projection={ProjectionType=ALL},ProvisionedThroughput={ReadCapacityUnits=25,WriteCapacityUnits=25}'


yarn api:start