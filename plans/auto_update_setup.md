# Automatic weeks.json Update Setup Guide

This guide provides multiple options for automatically updating the `weeks.json` file when new weekly data CSV files are uploaded to your server via FTP.

## Prerequisites

- A web server with Node.js installed (version 14 or higher)
- FTP server access for file uploads
- Administrator privileges to set up services or scheduled tasks

## Option 1: Express Server with File Watcher (Recommended)

This option provides a complete solution that both serves your web application and automatically updates the `weeks.json` file when new CSV files are detected.

### Setup Instructions

1. **Install required dependencies**:
   ```bash
   cd scripts
   npm install
   ```

2. **Start the server**:
   ```bash
   node server.js
   ```

3. **Run as a service** (for permanent operation):
   
   Using PM2 (recommended):
   ```bash
   npm install -g pm2
   pm2 start scripts/server.js --name "chefscore-server"
   pm2 save
   pm2 startup
   ```

   The Express server:
   - Serves your web application on port 3000 (configurable via PORT environment variable)
   - Watches the `data` directory for new CSV files
   - Automatically runs the update script when new files are detected
   - Provides an API endpoint (`/api/update-weeks`) for manual updates

## Option 2: Standalone File Watcher

If you already have a separate web server (like Apache or Nginx) serving your application, you can use just the file watching component.

### Setup Instructions

1. **Install required dependencies**:
   ```bash
   cd scripts
   npm install chokidar
   ```

2. **Start the file watcher**:
   ```bash
   node watch_data_directory.js
   ```

3. **Run as a service** (for permanent operation):
   
   Using PM2:
   ```bash
   npm install -g pm2
   pm2 start scripts/watch_data_directory.js --name "chefscore-watcher"
   pm2 save
   pm2 startup
   ```

## Option 3: Scheduled Task (Cron Job)

The simplest option is to set up a scheduled task that runs the update script at regular intervals.

### Linux/Unix Setup

1. Edit your crontab:
   ```bash
   crontab -e
   ```

2. Add a line to run the script every 5 minutes:
   ```
   */5 * * * * cd /path/to/your/app && node scripts/update_weeks_json.js >> /path/to/logs/update-log.txt 2>&1
   ```

### Windows Setup

1. Open Task Scheduler
2. Create a new Basic Task
3. Set the trigger to run every 5 minutes
4. Set the action to start a program:
   - Program/script: `node`
   - Arguments: `scripts/update_weeks_json.js`
   - Start in: `C:\path\to\your\app`

## Option 4: FTP Upload Hook

If your FTP server supports post-upload scripts or hooks, you can configure it to run a script after each file upload.

### Setup Instructions

1. Configure your FTP server to execute `scripts/ftp_upload_hook.js` with the uploaded file path as an argument when files are uploaded to the `data` directory.

   Example configuration for vsftpd (in `/etc/vsftpd.conf`):
   ```
   upload_script=/usr/bin/node /path/to/your/app/scripts/ftp_upload_hook.js
   ```

   Note: Configuration varies significantly between different FTP servers. Consult your FTP server's documentation for specific instructions.

## Testing Your Setup

To test that your automatic update is working:

1. Upload a test file named `data_week_99.csv` to your data directory via FTP
2. Check the logs of your chosen solution for confirmation messages
3. Verify that `weeks.json` has been updated to include the new file

## Troubleshooting

### Common Issues

1. **File permissions**: Ensure the Node.js process has permission to read files in the data directory and write to weeks.json.

2. **Path issues**: Make sure all paths in the scripts are correct for your server environment.

3. **File completion**: If the watcher is triggering before the file upload is complete, adjust the `stabilityThreshold` in the watcher configuration.

### Checking Logs

- For Options 1 and 2 using PM2:
  ```bash
  pm2 logs chefscore-server
  # or
  pm2 logs chefscore-watcher
  ```

- For Option 3 (Cron), check your specified log file.

## Security Considerations

- The API endpoint in the Express server (`/api/update-weeks`) is not authenticated. In a production environment, consider adding authentication.
- Ensure your server's file permissions are properly configured to prevent unauthorized access.
- If exposing the server to the internet, consider adding HTTPS and proper security headers.

## Maintenance

- It's a good practice to monitor the logs periodically to ensure the automatic update process is working correctly.
- If you update the update script logic, remember to restart the file watcher or server service.
- Consider setting up log rotation to prevent log files from growing too large. 