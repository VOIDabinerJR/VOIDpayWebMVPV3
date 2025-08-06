import db from '../config/db';
const BusinessDetails = {
  async findByDocumentId(documentId: any) {
    const result = await db.query('SELECT * FROM app WHERE legaldocument = ?', [
      documentId
    ]);
    return result;
  },
  async findById(id: any) {
    const result = await db.query('SELECT * FROM app WHERE id = ?', [id]);
    return result;
  },
  async findByClientId(id: string) {
    const result = await db.query('SELECT * FROM app WHERE clientid = ?', [id]);

    return result;
  },
  async create(app: any) {
    const result = await db.query('INSERT INTO app SET ?', app);
    return result;
  },
  async update(app: any, id: any) {
    const result = await db.query('UPDATE app SET ? WHERE id = ?', [app, id]);
    return result;
  }
};

export default BusinessDetails;
