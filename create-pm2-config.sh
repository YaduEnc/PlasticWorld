#!/bin/bash

# Simple script to create PM2 ecosystem.config.js and start the backend

echo "Creating PM2 ecosystem.config.js..."

# Start the config file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'plasticworld-backend',
    script: 'dist/server.js',
    env_production: {
EOF

# Load .env.production and add each variable
while IFS='=' read -r key value || [ -n "$key" ]; do
  # Skip comments and empty lines
  [[ "$key" =~ ^[[:space:]]*#.*$ ]] && continue
  [[ -z "$key" ]] && continue
  
  # Remove ALL leading/trailing whitespace from key and value (more robust)
  key=$(echo -n "$key" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | tr -d '\r\n')
  value=$(echo -n "$value" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//' | tr -d '\r\n')
  
  # Skip if key is empty after trimming
  [[ -z "$key" ]] && continue
  
  # Remove quotes if present but preserve the actual value (don't trim trailing = or other chars)
  # Only trim whitespace, not the actual value content
  value=$(echo -n "$value" | sed 's/^"\(.*\)"$/\1/' | sed "s/^'\(.*\)'$/\1/")
  # Trim only leading/trailing whitespace, not the value itself
  value=$(echo -n "$value" | sed 's/^[[:space:]]*//' | sed 's/[[:space:]]*$//' | tr -d '\r\n')
  
  # Special handling for DB_HOST and REDIS_HOST
  if [ "$key" = "DB_HOST" ]; then
    echo "      DB_HOST: 'localhost'," >> ecosystem.config.js
  elif [ "$key" = "REDIS_HOST" ]; then
    echo "      REDIS_HOST: 'localhost'," >> ecosystem.config.js
  else
    # Escape single quotes and newlines in value, ensure no trailing spaces
    value=$(echo -n "$value" | sed "s/'/\\\'/g" | tr '\n' ' ' | sed 's/[[:space:]]*$//')
    echo "      $key: '$value'," >> ecosystem.config.js
  fi
done < .env.production

# Close the config
cat >> ecosystem.config.js << 'EOF'
      NODE_ENV: 'production',
    }
  }]
};
EOF

echo "✅ ecosystem.config.js created!"
echo "Starting PM2..."

pm2 delete plasticworld-backend 2>/dev/null || true
pm2 start ecosystem.config.js --env production --update-env

echo "✅ PM2 started!"
pm2 status
