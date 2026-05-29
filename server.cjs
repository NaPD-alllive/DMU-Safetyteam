const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

const app = express();
const port = Number(process.env.PORT || 4173);
const rootDir = __dirname;
const distDir = path.join(rootDir, 'dist');
const dataDir = process.env.FACILITY_DATA_DIR
  ? path.resolve(process.env.FACILITY_DATA_DIR)
  : path.join(rootDir, 'data');
const stateFile = path.join(dataDir, 'facility-state.json');

app.use(express.json({ limit: '25mb' }));
app.use((_req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

const normalizePathForCompare = (value) => path.resolve(value).replace(/[\\/]$/, '').toLowerCase();

const isRootDataDir = () => {
  const resolvedDataDir = path.resolve(dataDir);
  return normalizePathForCompare(resolvedDataDir) === normalizePathForCompare(path.parse(resolvedDataDir).root);
};

const isValidState = (value) => {
  return Boolean(
    value &&
      value.app === 'DMU_FACILITY_MANAGEMENT' &&
      value.version === 1 &&
      Array.isArray(value.tasks) &&
      Array.isArray(value.notifications) &&
      Array.isArray(value.dailyLogs)
  );
};

const getFacilityModuleCounts = (state) => {
  const module = state?.facilityModule;
  return {
    facilityCount: Array.isArray(module?.facilities) ? module.facilities.length : 0,
    reservationCount: Array.isArray(module?.reservations) ? module.reservations.length : 0,
    maintenanceCount: Array.isArray(module?.maintenanceRequests) ? module.maintenanceRequests.length : 0,
  };
};

const readStateFile = async () => {
  try {
    const raw = await fs.readFile(stateFile, 'utf8');
    return JSON.parse(raw);
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
};

const ensureDataDir = async () => {
  if (isRootDataDir()) {
    try {
      await fs.access(dataDir);
      return;
    } catch {
      throw new Error(`${dataDir} 저장 위치를 찾을 수 없습니다. I드라이브 연결 상태를 확인해 주세요.`);
    }
  }

  await fs.mkdir(dataDir, { recursive: true });
};

const writeStateFile = async (state) => {
  await ensureDataDir();
  const savedState = {
    ...state,
    serverSavedAt: new Date().toISOString(),
  };
  const tempFile = `${stateFile}.tmp`;
  await fs.writeFile(tempFile, JSON.stringify(savedState, null, 2), 'utf8');
  await fs.rename(tempFile, stateFile);
  return savedState;
};

app.get('/api/health', async (_req, res) => {
  try {
    const state = await readStateFile();
    res.json({
      ok: true,
      mode: 'shared-server',
      savedAt: state?.serverSavedAt || state?.exportedAt || null,
      taskCount: Array.isArray(state?.tasks) ? state.tasks.length : 0,
      storagePath: stateFile,
      ...getFacilityModuleCounts(state),
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.get('/api/access-info', (_req, res) => {
  const addresses = getLocalAddresses();
  const recommendedUrls = addresses
    .filter(isPrivateIPv4)
    .map((address) => `http://${address}:${port}/`);
  const otherUrls = addresses
    .filter((address) => !isPrivateIPv4(address))
    .map((address) => `http://${address}:${port}/`);
  res.json({
    ok: true,
    port,
    localUrl: `http://localhost:${port}/`,
    urls: [...recommendedUrls, ...otherUrls],
    recommendedUrls,
    otherUrls,
    hasRecommendedUrl: recommendedUrls.length > 0,
  });
});

app.get('/api/state', async (_req, res) => {
  try {
    const state = await readStateFile();
    if (!state) {
      res.json({ ok: true, hasState: false });
      return;
    }
    res.json({
      ok: true,
      hasState: true,
      savedAt: state.serverSavedAt || state.exportedAt,
      storagePath: stateFile,
      state,
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.put('/api/state', async (req, res) => {
  try {
    if (!isValidState(req.body)) {
      res.status(400).json({ ok: false, error: 'Invalid facility state payload.' });
      return;
    }
    const savedState = await writeStateFile(req.body);
    res.json({
      ok: true,
      savedAt: savedState.serverSavedAt,
      taskCount: savedState.tasks.length,
      storagePath: stateFile,
      ...getFacilityModuleCounts(savedState),
    });
  } catch (error) {
    res.status(500).json({ ok: false, error: error.message });
  }
});

app.use(express.static(distDir, {
  etag: false,
  lastModified: false,
}));

app.get('*', (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

const getLocalAddresses = () => {
  const interfaces = os.networkInterfaces();
  return Object.values(interfaces)
    .flat()
    .filter((item) => item && item.family === 'IPv4' && !item.internal)
    .map((item) => item.address);
};

const isPrivateIPv4 = (address) => {
  const parts = address.split('.').map((part) => Number(part));
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) return false;

  const [first, second] = parts;
  return (
    first === 10 ||
    (first === 172 && second >= 16 && second <= 31) ||
    (first === 192 && second === 168)
  );
};

const openBrowserAfterReady = (url) => {
  if (process.env.FACILITY_OPEN_BROWSER !== '1') return;

  const command =
    process.platform === 'win32'
      ? `start "" "${url}"`
      : process.platform === 'darwin'
        ? `open "${url}"`
        : `xdg-open "${url}"`;

  exec(command, (error) => {
    if (error) {
      console.log(`Open the app manually: ${url}`);
    }
  });
};

app.listen(port, '0.0.0.0', () => {
  const localUrl = `http://localhost:${port}/`;
  console.log(`Facility shared server is running.`);
  console.log(`Open on this computer: ${localUrl}`);
  console.log(`Shared data file: ${stateFile}`);
  console.log(`Candidate team share URLs:`);
  getLocalAddresses().forEach((address) => {
    console.log(`  http://${address}:${port}/`);
  });
  console.log(`Keep this window open while teammates use the app.`);
  openBrowserAfterReady(localUrl);
});
