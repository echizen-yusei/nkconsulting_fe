#!/bin/bash

# Deploy script for NK Consulting
# Usage: ./deploy.sh <environment> <command>
# Example: ./deploy.sh staging deploy
# Example: ./deploy.sh production rollback

# ========== Config ==========
SRC_DIR="$HOME/nkconsulting_fe"                          # Source code location

main(){
  parse_env "$1" "$2"
  set_env_config

  if [[ "$COMMAND" == "deploy" ]]; then
    deploy
  elif [[ "$COMMAND" == "rollback" ]]; then
    rollback
  else
    echo "❌ Invalid command. Use 'deploy' or 'rollback'."
    exit 1
  fi
}

# ========== Deploy ==========
deploy(){
  echo "🚀 Deploying to $ENV..."
  pull_source_code
  install_and_build
  switch_symlink
  reload
  cleanup
}

# ========== Rollback ==========
rollback(){
  echo "🔄 Rolling back to previous release..."
  if [ -L "$CURRENT_SYMLINK" ]; then
    get_previous_release
    if [ -d "$PREVIOUS_RELEASE" ]; then
      echo "🔗 Pointing symlink back to previous release: $PREVIOUS_RELEASE"
      ln -sfn "$PREVIOUS_RELEASE" "$CURRENT_SYMLINK"
      RELEASE_DIR="$PREVIOUS_RELEASE"
      reload
      echo "✅ Rollback complete for [$ENV]! App running from: $PREVIOUS_RELEASE"
    else
      echo "❌ Previous release not found!"
      exit 1
    fi
  else
    echo "❌ No previous release found!"
    exit 1
  fi
}
# ========== Read ENV argument ==========
parse_env(){
  ENV=$1
  COMMAND=$2

  if [ "$ENV" != "staging" ] && [ "$ENV" != "production" ]; then
    echo "❌ Please specify environment: staging or production"
    exit 1
  fi
  
  echo "🚀 Starting $COMMAND for environment: $ENV"
}

# ========== Get previous release ==========
get_previous_release() {
  RELEASES=($(ls -dt "$BASE_DIR/releases/"*/))
  CURRENT_RELEASE=$(readlink -f "$CURRENT_SYMLINK")

  PREVIOUS_RELEASE=""
  for release in "${RELEASES[@]}"; do
    if [[ "$release" == "$CURRENT_RELEASE" ]]; then
      break
    fi
    PREVIOUS_RELEASE="$release"
  done

  if [[ -n "$PREVIOUS_RELEASE" ]]; then
    echo "📦 Previous release: $PREVIOUS_RELEASE"
  else
    echo "⚠️ No previous release found."
  fi
}
# ========== Set env-specific config ==========
set_env_config() {
  BASE_DIR="/var/www/$ENV/nkconsulting_fe"
  APP_NAME="nkconsulting_fe-$ENV"
  ENV_FILE=".env.$ENV"
  DEPLOY_TIMESTAMP=$(date +%Y%m%d%H%M%S)
  RELEASE_DIR="$BASE_DIR/releases/$DEPLOY_TIMESTAMP"
  CURRENT_SYMLINK="$BASE_DIR/current"

  if [ "$ENV" == "staging" ]; then
    ECOSYSTEM_CONFIG="$CURRENT_SYMLINK/ecosystem.staging.config.js"
  else
    ECOSYSTEM_CONFIG="$CURRENT_SYMLINK/ecosystem.production.config.js"
  fi
}

# ========== Step 1: Pull latest source and syncing source code to release dir ==========
pull_source_code() {
  cd "$SRC_DIR" || { echo "❌ Cannot find $SRC_DIR"; exit 1; }
  BRANCH=$(git rev-parse --abbrev-ref HEAD)

  echo "🛠 Detected current Git branch: $BRANCH"
  read -p "⚠️  Are you sure you want to deploy branch '$BRANCH' to '$ENV'? (y/N): " CONFIRM
  if [[ "$CONFIRM" != "y" && "$CONFIRM" != "Y" ]]; then
    echo "❌ Deployment cancelled."
    exit 1
  fi

  echo "📥 Pulling branch $BRANCH..."
  git fetch origin
  git reset --hard origin/$BRANCH

  echo "📂 Syncing source code"

  rsync -av --exclude='.git' --exclude='.next' --exclude='node_modules' . "$RELEASE_DIR"
}

# ========== Step 2: Install dependencies and build with env file ==========

install_and_build() {
  cd "$RELEASE_DIR" || { echo "❌ Cannot cd into $RELEASE_DIR"; exit 1; }

  echo "📦 Installing dependencies..."
  yarn install --frozen-lockfile

  echo "🔧 Building with $ENV_FILE..."
  cp "$ENV_FILE" .env.local
  rm -rf .next
  yarn build
}

# ========== Step 3: Switch symlink ==========
switch_symlink (){
  echo "🔗 Pointing symlink to new release..."
  ln -sfn "$RELEASE_DIR" "$CURRENT_SYMLINK"
}

# ========== Step 4: Reload app with PM2 (zero-downtime) ==========
reload(){
  cd "$CURRENT_SYMLINK" || { echo "❌ Cannot cd into $RELEASE_DIR"; exit 1; }

  if pm2 list | grep -q "$APP_NAME"; then
    echo "🔄 Reloading PM2 app: $APP_NAME..."
    pm2 reload "$APP_NAME"
  else
    echo "▶️ Starting PM2 app: $APP_NAME on port $PORT"
    pm2 start "$ECOSYSTEM_CONFIG"
  fi

  pm2 save
  echo "✅ Deploy complete for [$ENV]! App running from: $RELEASE_DIR"
}

cleanup() {
  # ========== Step 5: Clean up old releases (keep last 5) ==========
  echo "🧹 Cleaning up old releases, keeping only 5 most recent..."

  cd "$BASE_DIR/releases" || { echo "❌ Cannot access releases folder"; exit 1; }

  # List directories, sort by modification time, and remove all but the 5 most recent
  ls -1dt */ | tail -n +6 | xargs -I {} rm -rf "{}"
}
# ========== Run script ==========
main "$@"
