import db from '../config/db';

const Statistics = {
  async findSalesByMonthYear(userId: any, month: any, year: any) {
    const [rows] = await db.query(
      'SELECT * FROM orders WHERE userId = ? AND MONTH(createdAt) = ? AND YEAR(createdAt) = ?',
      [userId, month || 1, year || 2024]
    );
    return rows;
  },

  async findPendingPayments(userId: any) {
    const [rows] = await db.query(
      'SELECT * FROM orders WHERE userId = ? AND orderStatus = ?',
      [userId, 'Pending']
    );
    return rows;
  },

  async findCompletedPayments(userId: any) {
    const [rows] = await db.query(
      'SELECT * FROM orders WHERE userId = ? AND orderStatus = ?',
      [userId, 'Completed']
    );
    return rows;
  },

  async findCancelledPayments(userId: any) {
    const [rows] = await db.query(
      'SELECT * FROM orders WHERE userId = ? AND orderStatus = ?',
      [userId, 'Cancelled']
    );
    return rows;
  },

  async findRefundedPayments(userId: any) {
    const [rows] = await db.query(
      'SELECT * FROM orders WHERE userId = ? AND orderStatus = ?',
      [userId, 'refunded']
    );
    return rows;
  },

  async calculateCancellationRate(userId: any) {
    const [totalOrders] = await db.query(
      'SELECT COUNT(*) AS total FROM orders WHERE userId = ?',
      [userId]
    );
    const [cancelledOrders] = await db.query(
      'SELECT COUNT(*) AS total FROM orders WHERE userId = ? AND orderStatus = ?',
      [userId, 'Cancelled']
    );

    // Ensure totalOrders and cancelledOrders are arrays and have the expected structure
    const total =
      Array.isArray(totalOrders) &&
      totalOrders.length > 0 &&
      typeof (totalOrders[0] as any).total === 'number'
        ? (totalOrders[0] as any).total
        : 0;

    const cancelled =
      Array.isArray(cancelledOrders) &&
      cancelledOrders.length > 0 &&
      typeof (cancelledOrders[0] as any).total === 'number'
        ? (cancelledOrders[0] as any).total
        : 0;

    return total > 0 ? (cancelled / total) * 100 : 0;
  },

  async calculateRefundRate(userId: any) {
    const [totalOrders] = await db.query(
      'SELECT COUNT(*) AS total FROM orders WHERE userId = ?',
      [userId]
    );
    const [refundedOrders] = await db.query(
      'SELECT COUNT(*) AS total FROM orders WHERE userId = ? AND orderStatus = ?',
      [userId, 'refunded']
    );

    // Ensure totalOrders and refundedOrders are arrays and have the expected structure
    const total =
      Array.isArray(totalOrders) &&
      totalOrders.length > 0 &&
      typeof (totalOrders[0] as any).total === 'number'
        ? (totalOrders[0] as any).total
        : 0;

    const refunded =
      Array.isArray(refundedOrders) &&
      refundedOrders.length > 0 &&
      typeof (refundedOrders[0] as any).total === 'number'
        ? (refundedOrders[0] as any).total
        : 0;

    return total > 0 ? (refunded / total) * 100 : 0;
  },
  async calculateCheckoutRate(userId: any) {
    const [totalOrders] = await db.query(
      'SELECT COUNT(*) AS total FROM orders WHERE userId = ?',
      [userId]
    );
    const [checkoutedOrders] = await db.query(
      'SELECT COUNT(*) AS total FROM orders WHERE userId = ? AND orderStatus = ?',
      [userId, 'completed']
    );

    // Ensure totalOrders and checkoutedOrders are arrays and have the expected structure
    const total =
      Array.isArray(totalOrders) &&
      totalOrders.length > 0 &&
      typeof (totalOrders[0] as any).total === 'number'
        ? (totalOrders[0] as any).total
        : 0;

    const checkouted =
      Array.isArray(checkoutedOrders) &&
      checkoutedOrders.length > 0 &&
      typeof (checkoutedOrders[0] as any).total === 'number'
        ? (checkoutedOrders[0] as any).total
        : 0;

    return total > 0 ? (checkouted / total) * 100 : 0;
  },
  async calculatePendingRate(userId: any) {
    const [totalOrders] = await db.query(
      'SELECT COUNT(*) AS total FROM orders WHERE userId = ?',
      [userId]
    );
    const [pendingOrders] = await db.query(
      'SELECT COUNT(*) AS total FROM orders WHERE userId = ? AND orderStatus = ?',
      [userId, 'pending']
    );

    // Ensure totalOrders and pendingOrders are arrays and have the expected structure
    const total =
      Array.isArray(totalOrders) &&
      totalOrders.length > 0 &&
      typeof (totalOrders[0] as any).total === 'number'
        ? (totalOrders[0] as any).total
        : 0;

    const pending =
      Array.isArray(pendingOrders) &&
      pendingOrders.length > 0 &&
      typeof (pendingOrders[0] as any).total === 'number'
        ? (pendingOrders[0] as any).total
        : 0;

    return total > 0 ? (pending / total) * 100 : 0;
  },
  async calculateTicketM(userId: any) {
    const [totalOrders] = await db.query(
      'SELECT SUM(totalAmount) AS total FROM orders WHERE userId = ?',
      [userId]
    );
    const [pendingOrders] = await db.query(
      'SELECT COUNT(*) AS total FROM orders WHERE userId = ?',
      [userId]
    );

    // Ensure totalOrders and pendingOrders are arrays and have the expected structure
    const totalam =
      Array.isArray(totalOrders) &&
      totalOrders.length > 0 &&
      typeof (totalOrders[0] as any).total === 'number'
        ? (totalOrders[0] as any).total
        : 0;

    const total =
      Array.isArray(pendingOrders) &&
      pendingOrders.length > 0 &&
      typeof (pendingOrders[0] as any).total === 'number'
        ? (pendingOrders[0] as any).total
        : 0;

    return total > 0 ? totalam / total : 0;
  },
  async salesRevenue(userId: any) {
    const result = await db.query(
      'SELECT SUM(totalAmount) AS totalSales FROM orders WHERE userId = ? AND orderStatus=?',
      [userId, 'completed']
    );
    // Fix: Ensure result is an array and safely access totalSales
    let totalSales = 0;
    if (
      Array.isArray(result) &&
      Array.isArray(result[0]) &&
      result[0].length > 0
    ) {
      const row = result[0][0] as { totalSales?: number };
      totalSales = typeof row.totalSales === 'number' ? row.totalSales : 0;
    }
    return totalSales;
  },

  async findSalesLast30Days(userId: any) {
    const result = await db.query(
      'SELECT SUM(totalAmount) AS totalSales FROM orders WHERE userId = ? AND createdAt >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)',
      [userId]
    );
    // Fix: Ensure result is an array and safely access totalSales
    let totalSales = 0;
    if (
      Array.isArray(result) &&
      Array.isArray(result[0]) &&
      result[0].length > 0
    ) {
      const row = result[0][0] as { totalSales?: number };
      totalSales = typeof row.totalSales === 'number' ? row.totalSales : 0;
    }
    return totalSales;
  },

  async findSalesLastYear(userId: any) {
    const result = await db.query(
      'SELECT SUM(totalAmount) AS totalSales FROM orders WHERE userId = ? AND createdAt >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)',
      [userId]
    );
    // Fix: Ensure result is an array and safely access totalSales
    let totalSales = 0;
    if (
      Array.isArray(result) &&
      Array.isArray(result[0]) &&
      result[0].length > 0
    ) {
      const row = result[0][0] as { totalSales?: number };
      totalSales = typeof row.totalSales === 'number' ? row.totalSales : 0;
    }
    return totalSales;
  },
  async findMonthlySales(userId: any) {
    const result = await db.query(
      `SELECT 
                YEAR(createdAt) AS year,
                MONTH(createdAt) AS month,
                COALESCE(SUM(totalAmount), 0) AS totalSales
            FROM 
                orders
            WHERE 
                userId = ?
                AND createdAt >= DATE_SUB(CURDATE(), INTERVAL 1 YEAR)
            GROUP BY 
                YEAR(createdAt), MONTH(createdAt)
            ORDER BY 
                YEAR(createdAt) DESC, MONTH(createdAt) DESC`,
      [userId]
    );

    const monthlySales = Array(12).fill(0);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;

    if (Array.isArray(result[0])) {
      (
        result[0] as Array<{ year: number; month: number; totalSales: number }>
      ).forEach((row) => {
        const { year, month, totalSales } = row;
        if (year === currentYear) {
          monthlySales[currentMonth - month] = totalSales;
        } else if (year === currentYear - 1) {
          monthlySales[12 - (currentMonth - month)] = totalSales;
        }
      });

      return monthlySales;
    }
  },
  async getStatistics(userId: any, month: undefined, year: undefined) {
    try {
      const sales = await this.findSalesByMonthYear(userId, month, year);
      const pendingPayments = await this.findPendingPayments(userId);
      const completedPayments = await this.findCompletedPayments(userId);
      const cancelledPayments = await this.findCancelledPayments(userId);
      const refundedPayments = await this.findRefundedPayments(userId);
      const cancellationRate = await this.calculateCancellationRate(userId);
      const refundRate = await this.calculateRefundRate(userId);
      const checkoutRate = await this.calculateCheckoutRate(userId);
      const pendingRate = await this.calculatePendingRate(userId);
      const salesLast30Days = await this.findSalesLast30Days(userId);
      const salesLastYear = await this.findSalesLastYear(userId);
      const monthlySales = await this.findMonthlySales(userId);
      const revenue = await this.salesRevenue(userId);
      const ticketM = await this.calculateTicketM(userId);
      return {
        sales,
        pendingPayments,
        completedPayments,
        cancelledPayments,
        refundedPayments,
        cancellationRate,
        refundRate,
        checkoutRate,
        pendingRate,
        salesLast30Days,
        salesLastYear,
        monthlySales,
        revenue,
        ticketM
      };
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  }
};

export default Statistics;
