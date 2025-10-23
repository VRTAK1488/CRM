function initStorage() {
  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify([{ username: 'admin', role: 'admin' }]));
  }
  if (!localStorage.getItem('clients')) {
    localStorage.setItem('clients', JSON.stringify([]));
  }
  if (!localStorage.getItem('comments')) {
    localStorage.setItem('comments', JSON.stringify({}));
  }
  if (!localStorage.getItem('logs')) {
    localStorage.setItem('logs', JSON.stringify([]));
  }
}

function logAction(action, details = '') {
  const logs = JSON.parse(localStorage.getItem('logs') || '[]');
  logs.push({
    id: Date.now(),
    user: localStorage.getItem('user') || 'system',
    action,
    details,
    timestamp: new Date().toISOString()
  });
  localStorage.setItem('logs', JSON.stringify(logs.slice(-100)));
}

function getUsers() { return JSON.parse(localStorage.getItem('users') || '[]'); }
function addUser(username, role) {
  const users = getUsers();
  if (users.some(u => u.username === username)) return false;
  users.push({ username, role });
  localStorage.setItem('users', JSON.stringify(users));
  logAction('User created', `${username} (${role})`);
  return true;
}

function getClients() { return JSON.parse(localStorage.getItem('clients') || '[]'); }
function addClient(client) {
  const clients = getClients();
  client.id = Date.now().toString();
  client.createdAt = new Date().toISOString();
  clients.push(client);
  localStorage.setItem('clients', JSON.stringify(clients));
  logAction('Client added', client.name);
  return client.id;
}
function updateClient(id, data) {
  const clients = getClients();
  const index = clients.findIndex(c => c.id === id);
  if (index !== -1) {
    clients[index] = { ...clients[index], ...data };
    localStorage.setItem('clients', JSON.stringify(clients));
  }
}
function getClientById(id) {
  return getClients().find(c => c.id === id);
}

function getComments(clientId) {
  const all = JSON.parse(localStorage.getItem('comments') || '{}');
  return all[clientId] || [];
}
function addComment(clientId, text, author) {
  const all = JSON.parse(localStorage.getItem('comments') || '{}');
  if (!all[clientId]) all[clientId] = [];
  all[clientId].push({ id: Date.now(), text, author, date: new Date().toLocaleString() });
  localStorage.setItem('comments', JSON.stringify(all));
}

function getRemindersForUser(user, role) {
  const clients = getClients();
  if (role === 'admin') {
    return clients.filter(c => c.reminder && new Date(c.reminder) >= new Date());
  }
  return clients.filter(c => c.manager === user && c.reminder && new Date(c.reminder) >= new Date());
}

function getTodaysReminders(user, role) {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return getRemindersForUser(user, role).filter(c => {
    const r = new Date(c.reminder);
    return r >= start && r < end;
  });
}

function sortClients(clients, sortBy) {
  return [...clients].sort((a, b) => {
    if (sortBy === 'status') return (a.status || '').localeCompare(b.status || '');
    if (sortBy === 'source') return (a.source || '').localeCompare(b.source || '');
    if (sortBy === 'date') return new Date(b.createdAt) - new Date(a.createdAt);
    return 0;
  });
}