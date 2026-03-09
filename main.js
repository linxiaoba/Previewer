const { app, BrowserWindow, Menu, shell, dialog } = require('electron');
const path = require('path');

// 保持窗口引用，防止被垃圾回收
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    title: 'Omni Previewer',
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      // 允许加载本地文件（HTML里的拖入文件功能需要）
      webSecurity: false,
    },
    backgroundColor: '#0f1117',
    show: false, // 等加载完再显示，避免白屏闪烁
  });

  mainWindow.loadFile('index.html');

  // 加载完成后显示窗口
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // 拦截新窗口，在默认浏览器打开外部链接
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// 自定义菜单（去掉默认菜单栏，保留必要功能）
function buildMenu() {
  const isMac = process.platform === 'darwin';
  const template = [
    // macOS 需要第一项是 App 名称菜单
    ...(isMac ? [{ label: app.name, submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideOthers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]}] : []),
    {
      label: '文件',
      submenu: [
        {
          label: '打开文件...',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
              title: '打开前端文件',
              filters: [
                { name: '前端文件', extensions: ['html','htm','vue','jsx','tsx','js','ts','css','less','scss','sass','md','json','svg','xml','csv','yaml','yml'] },
                { name: '所有文件', extensions: ['*'] }
              ],
              properties: ['openFile']
            });
            if (!canceled && filePaths.length > 0) {
              // 把文件路径发给渲染进程处理
              mainWindow.webContents.send('open-file-path', filePaths[0]);
            }
          }
        },
        { type: 'separator' },
        isMac ? { role: 'close' } : { role: 'quit', label: '退出' }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { role: 'undo', label: '撤销' },
        { role: 'redo', label: '重做' },
        { type: 'separator' },
        { role: 'cut', label: '剪切' },
        { role: 'copy', label: '复制' },
        { role: 'paste', label: '粘贴' },
        { role: 'selectAll', label: '全选' }
      ]
    },
    {
      label: '视图',
      submenu: [
        { role: 'reload', label: '刷新' },
        { role: 'forceReload', label: '强制刷新' },
        { type: 'separator' },
        { role: 'resetZoom', label: '重置缩放' },
        { role: 'zoomIn', label: '放大' },
        { role: 'zoomOut', label: '缩小' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: '全屏' },
        // 开发时用，打包发布时可以去掉
        { role: 'toggleDevTools', label: '开发者工具', accelerator: 'F12' }
      ]
    },
    {
      label: '窗口',
      submenu: [
        { role: 'minimize', label: '最小化' },
        { role: 'zoom', label: '最大化' },
        ...(isMac ? [
          { type: 'separator' },
          { role: 'front' }
        ] : [])
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

app.whenReady().then(() => {
  buildMenu();
  createWindow();

  // macOS：点击 Dock 图标时重新打开窗口
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 所有窗口关闭时退出（macOS 除外）
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
