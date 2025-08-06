import db from '../config/db';

const UserDetails = {
  async findByDocumentId(documentId: any) {
    const result = await db.query(
      'SELECT * FROM userdetails WHERE documentId = ?',
      [documentId]
    );
    return result;
  },
  async findById(id: any) {
    const result = await db.query('SELECT * FROM userdetails WHERE id = ?', [
      id
    ]);
    return result;
  },
  async findByUserId(id: any) {
    const result = await db.query(
      'SELECT * FROM userdetails WHERE userid = ?',
      [id]
    );
    return result;
  },
  async create(userDetails: any) {
    const result = await db.query('INSERT INTO userdetails SET ?', userDetails);
    return result;
  },
  async update(userDetails: any, id: any) {
    const result = await db.query('UPDATE userdetails SET ? WHERE id = ?', [
      userDetails,
      id
    ]);
    return result;
  }
};

export default UserDetails;
