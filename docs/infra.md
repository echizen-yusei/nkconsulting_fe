## Deploy frontend Production

### Environment variables

```sh
cd ~/nkconsulting_fe
sudo vi .env.production
```

### Deploy new version

```sh
cd ~/nkconsulting_fe
git fetch origin
./deploy.sh production deploy
```

### Revert to previous version

```sh
cd ~/nkconsulting_fe
./deploy.sh production rollback
```

### Next.js server management commands

```sh
pm2 status
pm2 info nkconsulting_fe-production
pm2 start /var/www/production/nkconsulting_fe/current/ecosystem.production.config.js
pm2 reload nkconsulting_fe-production
```

## Deploy frontend Bunbu

### Environment variables

```sh
cd ~/Projects/nkconsulting_fe
sudo vi .env.production
```

### Deploy new version

```sh
cd ~/Projects/nkconsulting_fe
git checkout main
git branch -D bunbu-deploy
git fetch origin
git checkout bunbu-deploy
git merge *deploy-branch*
./deploy.sh production deploy
```
