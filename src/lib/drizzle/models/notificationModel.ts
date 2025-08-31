import { eq } from 'drizzle-orm';
import { db } from '../db';
import { notifications } from '../schema';

export const Notification = {
  // Cria uma nova notificação
  async create(data: typeof notifications.$inferInsert) {
    const result = await db.insert(notifications).values(data).returning();
    return result;
  },

  // Deleta uma notificação pelo ID
  async delete(id: number) {
    const result = await db
      .delete(notifications)
      .where(eq(notifications.id, id))
      .returning();
    return result;
  },

  // Atualiza o status de uma notificação
  async updateStatus(id: number, status: boolean) {
    const result = await db
      .update(notifications)
      .set({ isRead: status })
      .where(eq(notifications.id, id))
      .returning();
    return result;
  },

  // Lê uma notificação pelo ID
  async read(id: number) {
    const result = await db
      .select()
      .from(notifications)
      .where(eq(notifications.id, id));
    return result.length > 0 ? result[0] : null;
  },

  // async findByTitle(title: string) {
  //   const result = await db
  //     .select()
  //     .from(notifications)
  //     .where(eq(notifications.title, title));
  //   return result.length > 0 ? result[0] : null;
  // },

  // Lê todas as notificações de um usuário
  async readAll(userId: string) {
    const result = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId));
    return result;
  },

  notifications(i: string | number) {
    const notificationsList = [
      { sender: 'system', message: 'Novo pedido criado.' },
      { sender: 'system', message: 'Pedido pago com sucesso.' },
      { sender: 'system', message: 'Pedido cancelado.' },
      { sender: 'system', message: 'Novo login detectado.' },
      { sender: 'system', message: 'Atualização de perfil concluída.' },
      { sender: 'system', message: 'Novo comentário recebido.' },
      { sender: 'system', message: 'Seu pagamento foi processado.' },
      { sender: 'system', message: 'Novo item adicionado ao carrinho.' }
    ];

    return notificationsList[Number(i)];
  }
};

export default Notification;
