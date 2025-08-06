import db from '../config/db';

const User = {
  async findByEmail(email: any) {
    const result = await db.query(
      'SELECT * FROM user WHERE email = ? AND userStatus = true',
      [email]
    );
    return result;
  },
  async retunEmail(id: any) {
    const result = await db.query(
      'SELECT email FROM user WHERE id = ? AND userStatus = true',
      [id]
    );
    return result;
  },
  async findById(id: string) {
    const result = await db.query(
      'SELECT * FROM user WHERE id = ? AND userStatus = true',
      [id]
    );
    return result;
  },
  async create(user: object) {
    const result = await db.query('INSERT INTO user SET ?', user);
    return result;
  },
  async update(id: string) {
    const result = await db.query('UPDATE user SET ? WHERE id = ?', [id]);
    return result;
  },
  async activateUser(id: string) {
    const result = await db.query(
      'UPDATE user SET userStatus = true WHERE id = ?',
      [id]
    );
    return result;
  },
  async deactivateUser(id: string) {
    const result = await db.query(
      'UPDATE user SET userStatus = false WHERE id = ?',
      [id]
    );
    return result;
  }
};

export default User;
