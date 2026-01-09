#!/bin/bash

# View logs for all services

docker compose -f docker-compose.prod.yml logs -f "$@"
