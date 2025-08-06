import db from '../config/db';

const BusinessDetails = {
  async findByDocumentId(documentId: any) {
    const result = await db.query(
      'SELECT * FROM businessdetails WHERE legaldocument = ?',
      [documentId]
    );
    return result;
  },
  async findById(id: any) {
    const result = await db.query(
      'SELECT * FROM businessdetails WHERE id = ?',
      [id]
    );
    return result;
  },
  async findByUserId(id: any) {
    const result = await db.query(
      'SELECT * FROM businessdetails WHERE userid = ?',
      [id]
    );
    return result;
  },
  async create(businessDetails: Record<string, any>) {
    const result = await db.query(
      'INSERT INTO businessdetails SET ?',
      businessDetails
    );
    return result;
  },
  async update(businessDetails: Record<string, any>, id: any) {
    const result = await db.query('UPDATE businessdetails SET ? WHERE id = ?', [
      businessDetails,
      id
    ]);
    return result;
  }
};

export default BusinessDetails;
