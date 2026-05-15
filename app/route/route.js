import { ipcMain, BrowserWindow } from 'electron';
import Template from '../mixin/Template.js';
import Customer from '../controller/Customer.js';
import Product from '../controller/Product.js';
import Supplier from '../controller/Supplier.js';
import Company from '../controller/Company.js';
import User from '../controller/User.js';

function getWin(event) {
    return BrowserWindow.fromWebContents(event.sender);
}

function broadcastReload(channel) {
    for (const win of BrowserWindow.getAllWindows()) {
        win.webContents.send(channel);
    }
}

ipcMain.handle('window:open', (_e, name, opts = {}) => {
    const win = Template.create(name, opts);
    Template.loadView(win, name);
});

ipcMain.handle('window:openModal', (e, name, opts = {}) => {
    const parent = getWin(e);
    if (!parent) return;
    const win = Template.create(name, {
        width: 560,
        height: 420,
        resizable: false,
        minimizable: false,
        maximizable: false,
        parent: parent,
        modal: true,
        ...opts,
    });
    Template.loadView(win, name);
});

ipcMain.handle('window:close', (e) => {
    getWin(e)?.close();
});

let tempData = {};

ipcMain.handle('temp:set', (_e, key, data) => {
    tempData[key] = data;
});

ipcMain.handle('temp:get', (_e, key) => {
    const data = tempData[key] || null;
    delete tempData[key];
    return data;
});

// --- CUSTOMER HANDLERS ---
ipcMain.handle('customer:insert', async (_e, data) => {
    const result = await Customer.insert(data);
    if (result.status) broadcastReload('customer:reload');
    return result;
});

ipcMain.handle('customer:find', async (_e, where = {}) => {
    return await Customer.find(where);
});

ipcMain.handle('customer:findById', async (_e, id) => {
    return await Customer.findById(id);
});

ipcMain.handle('customer:update', async (_e, id, data) => {
    const result = await Customer.update(id, data);
    if (result.status) broadcastReload('customer:reload');
    return result;
});

ipcMain.handle('customer:delete', async (_e, id) => {
    const result = await Customer.delete(id);
    if (result.status) broadcastReload('customer:reload');
    return result;
});

ipcMain.handle('customer:count', async () => {
    return await Customer.count();
});

// --- PRODUCT HANDLERS ---
ipcMain.handle('product:insert', async (_e, data) => {
    const result = await Product.insert(data);
    if (result.status) broadcastReload('product:reload');
    return result;
});

ipcMain.handle('product:find', async (_e, where = {}) => {
    return await Product.find(where);
});

ipcMain.handle('product:findById', async (_e, id) => {
    return await Product.findById(id);
});

ipcMain.handle('product:update', async (_e, id, data) => {
    const result = await Product.update(id, data);
    if (result.status) broadcastReload('product:reload');
    return result;
});

ipcMain.handle('product:delete', async (_e, id) => {
    const result = await Product.delete(id);
    if (result.status) broadcastReload('product:reload');
    return result;
});

ipcMain.handle('product:count', async () => {
    return await Product.count();
});

// --- SUPPLIER HANDLERS (ADICIONADOS) ---
ipcMain.handle('supplier:insert', async (_e, data) => {
    const result = await Supplier.insert(data);
    if (result.status) broadcastReload('supplier:reload');
    return result;
});

ipcMain.handle('supplier:find', async (_e, where = {}) => {
    return await Supplier.find(where);
});

ipcMain.handle('supplier:findById', async (_e, id) => {
    return await Supplier.findById(id);
});

ipcMain.handle('supplier:update', async (_e, id, data) => {
    const result = await Supplier.update(id, data);
    if (result.status) broadcastReload('supplier:reload');
    return result;
});

ipcMain.handle('supplier:delete', async (_e, id) => {
    const result = await Supplier.delete(id);
    if (result.status) broadcastReload('supplier:reload');
    return result;
});

ipcMain.handle('supplier:count', async () => {
    return await Supplier.count();
});
ipcMain.handle('company:insert', async (_e, data) => {
    const result = await Company.insert(data);
    if (result.status) broadcastReload('company:reload');
    return result;
});

ipcMain.handle('company:find', async (_e, where = {}) => {
    return await Company.find(where);
});

ipcMain.handle('company:findById', async (_e, id) => {
    return await Company.findById(id);
});

ipcMain.handle('company:update', async (_e, id, data) => {
    const result = await Company.update(id, data);
    if (result.status) broadcastReload('company:reload');
    return result;
});

ipcMain.handle('company:delete', async (_e, id) => {
    const result = await Company.delete(id);
    if (result.status) broadcastReload('company:reload');
    return result;
});

ipcMain.handle('company:count', async () => {
    return await Company.count();
});
ipcMain.handle('user:insert', async (_e, data) => {
    const result = await User.insert(data);
    if (result.status) broadcastReload('user:reload');
    return result;
});

ipcMain.handle('user:find', async (_e, where = {}) => {
    return await User.find(where);
});

ipcMain.handle('user:findById', async (_e, id) => {
    return await User.findById(id);
});

ipcMain.handle('user:update', async (_e, id, data) => {
    const result = await User.update(id, data);
    if (result.status) broadcastReload('user:reload');
    return result;
});

ipcMain.handle('user:delete', async (_e, id) => {
    const result = await User.delete(id);
    if (result.status) broadcastReload('user:reload');
    return result;
});

ipcMain.handle('user:count', async () => {
    return await User.count();
});