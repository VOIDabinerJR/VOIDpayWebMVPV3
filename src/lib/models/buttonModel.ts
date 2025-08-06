import db from '../config/db';
const Button = {
  async findByToken(token: string) {
    const result = await db.query(
      'SELECT * FROM button WHERE buttonToken = ?',
      token
    );
    return result;
  },
  async create(button: any) {
    const result = await db.query('INSERT INTO button SET ?', button);
    return result;
  }
};

export default Button;
