console.log("Processo Principal");
console.log(`Electron: ${process.versions.electron}`);

const {
  app,
  BrowserWindow,
  screen,
  nativeTheme,
  Menu,
  shell,
} = require("electron");
const path = require("node:path");

//janela principal
const createWindow = () => {
  nativeTheme.themeSource = "dark";

  //Pega a resolução da tela primária
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow({
    width: Math.floor(width),
    height: Math.floor(height),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
    icon: "./src/public/img/pc.png",
    //autoHideMenuBar: true,
    //resizable: false,
    //titleBarStyle: "hidden",
  });

  //Menu personalizado
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  win.loadFile("./src/views/index.html");
};

//Janela sobre
const aboutWindow = () => {
  const about = new BrowserWindow({
    width: 300,
    height: 500,
    icon: "./src/public/img/pc.png",
    autoHideMenuBar: true,
  });

  about.loadFile("./src/views/sobre.html");
};

//Janela secundária
const childWindow = () => {
  const father = BrowserWindow.getFocusedWindow();
  if (father) {
    const child = new BrowserWindow({
      width: 640,
      height: 480,
      icon: "./src/public/img/pc.png",
      autoHideMenuBar: true,
      resizable: false,
      parent: father,
      modal: true,
    });

    child.loadFile("./src/views/child.html");
  }
};

app.whenReady().then(() => {
  createWindow();
  //aboutWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

//template do menu
const template = [
  {
    label: "Aquivo",
    submenu: [
      {
        label: "Janela Secundária",
        click: () => childWindow(),
      },
      {
        label: "Sair",
        click: () => app.quit(),
        accelerator: "alt+F4",
      },
    ],
  },
  {
    label: "Exibir",
    submenu: [
      {
        label: "Recarregar",
        role: "reload",
      },
      {
        label: "Ferramentas do Desenvolvedor",
        role: "toggleDevTools",
      },
      {
        type: "separator",
      },
      {
        label: "Aplicar zoom",
        role: "zoomIn",
      },
      {
        label: "Reduzir",
        role: "zoomOut",
      },
      {
        label: "Restaurar o zoom padrão",
        role: "resetZoom",
      },
    ],
  },
  {
    label: "Ajuda",
    submenu: [
      {
        label: "docs",
        click: () =>
          shell.openExternal("https://www.electronjs.org/pt/docs/latest/"),
      },
      {
        type: "separator",
      },
      {
        label: "Sobre",
        click: () => aboutWindow(),
      },
    ],
  },
];
