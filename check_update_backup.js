/**
 * Check if Backup or Update is running - if so, it returns systemBusy TRUE with relevant tags, eg. updateRunning TRUE etc.
 * It can be used as triggers, eg. disable Homey monitoring when update started (...and it's expected it will get installed and Homey restarted)
 * Outcome: true if update OR backup is running
 */

const updateState = await Homey.updates.getState();
const backupState = await Homey.backup.getState();

// UPDATE
const updateDownloading = updateState?.downloading === true;
const updateInstalling  = updateState?.installing === true;
const updateProgress =
  (typeof updateState?.downloads_progress === 'number')
    ? updateState.downloads_progress
    : 0;

const updateRunning = updateDownloading || updateInstalling || updateProgress > 0;

// BACKUP
const backupStateValue = backupState?.backupState ?? 'unknown';
const backupRunning = backupStateValue !== 'idle';

// TAGS
await tag('updateRunning', Boolean(updateRunning));
await tag('updateDownloading', Boolean(updateDownloading));
await tag('updateInstalling', Boolean(updateInstalling));
await tag('updateProgress', Number(updateProgress));

await tag('backupRunning', Boolean(backupRunning));
await tag('backupState', String(backupStateValue));
await tag('backupStateString', String(backupState?.backupStateString ?? ''));
await tag('backupError', String(backupState?.backupError ?? ''));

// DEBUG
const systemBusy = (updateRunning || backupRunning);
console.log(JSON.stringify({
  updateRunning,
  updateDownloading,
  updateInstalling,
  updateProgress,
  backupRunning,
  backupState: backupStateValue,
  systemBusy,
}, null, 2));

// ✅ Flow outcome comes from this return:
return systemBusy;
