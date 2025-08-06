import db from '../config/db';

const Notification = {
  // Cria uma nova notificação
  async create(data: any, userId: any) {
    const [result] = await db.query('INSERT INTO notification set ?', [
      data,
      userId
    ]);
    return result;
  },

  // Deleta uma notificação pelo ID
  async delete(id: any) {
    const [result] = await db.query('DELETE FROM notification WHERE id = ?', [
      id
    ]);
    return result;
  },

  // Atualiza o status de uma notificação
  async updateStatus(id: any, status: any) {
    const [result] = await db.query(
      'UPDATE notification SET isRead = ? WHERE id = ?',
      [status, id]
    );
    return result;
  },

  // Lê uma notificação pelo ID
  async read(id: any) {
    const [rows] = await db.query('SELECT * FROM notification WHERE id = ?', [
      id
    ]);
    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0];
    }
    return null;
  },
  async findByName(name: any) {
    const [rows] = await db.query('SELECT * FROM notification WHERE name =?', [
      name
    ]);
    if (Array.isArray(rows) && rows.length > 0) {
      return rows[0];
    }
    return null;
  },

  // Lê todas as notificações de um usuário
  async readAll(userId: any) {
    const [rows] = await db.query(
      'SELECT * FROM notification WHERE userId = ?',
      [userId]
    );
    return rows;
  },
  notifications(i: string | number) {
    const notifications = [
      { sender: 'system', message: 'Novo pedido criado.' },
      { sender: 'system', message: 'Pedido pago com sucesso.' },
      { sender: 'system', message: 'Pedido cancelado.' },
      { sender: 'system', message: 'Novo login detectado.' },
      { sender: 'system', message: 'Atualização de perfil concluída.' },
      { sender: 'system', message: 'Novo comentário recebido.' },
      { sender: 'system', message: 'Seu pagamento foi processado.' },
      { sender: 'system', message: 'Novo item adicionado ao carrinho.' }
    ];

    return notifications[Number(i)];
  }
};

export default Notification;
