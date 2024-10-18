console.log("Processo Principal");
console.log(`Electron: ${process.versions.electron}`);

const {
  app,
  BrowserWindow,
  screen,
  nativeTheme,
  Menu,
  shell,
  ipcMain,
  dialog,
} = require("electron");
const path = require("node:path");

//janela principal
const createWindow = () => {
  nativeTheme.themeSource = "dark";

  //Pega a resolução da tela primária
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow({
    width: Math.floor(width * 0.6),
    height: Math.floor(height * 0.6),
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

  //IPC >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
  ipcMain.on("open-child", () => {
    childWindow();
  });

  ipcMain.on("renderer-message", (event, message) => {
    console.log(`Processo principal recebeu uma mensagem: ${message}`);
    event.reply("main-message", "Olá! Renderizador");
  });

  ipcMain.on("dialog-info", () => {
    dialog.showMessageBox({
      type: "info",
      title: "Informação",
      message: "Mensagem",
      buttons: ["OK"],
    });
  });

  ipcMain.on("dialog-warning", () => {
    dialog
      .showMessageBox({
        type: "warning",
        title: "Aviso",
        message: "Confirma esta ação!",
        buttons: ["Sim", "Não"],
        defaultId: 0,
      })
      .then((result) => {
        console.log(result);
        if (result.response === 0) {
          console.log("confirmado");
        }
      });
  });

  ipcMain.on("dialog-select", () => {
    dialog
      .showOpenDialog({
        properties: ["openDirectory"],
      })
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        console.log(error);
      });
  });

  //<<<<<<<<<<<<<<<<<<<<<<<<<<<<<

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
