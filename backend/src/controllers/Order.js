import db from '../db';

const Order = {
    async create(req, res) {
        const text = `INSERT INTO
            orders(expectedBy, status, productId, productName, rate, quantity, totalAmount, user_id, name, email, contactNumber, deliveryAddress)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
            returning *`;
        const values = [
            req.body.expectedBy,
            req.body.status,
            req.body.productId,
            req.body.productName,
            req.body.rate,
            req.body.quantity,
            req.body.totalAmount,
            req.body.user_id,
            req.body.name,
            req.body.email,
            req.body.contactNumber,
            req.body.deliveryAddress,
        ];

        try {
            const { rows } = await db.query(text, values);
            return res.status(201).send(rows[0]);
        } catch(error) {
            return res.status(400).send(error);
        }
    },

    async getAll(req, res) {
        const findAllQuery = 'SELECT * FROM orders ORDER BY orderNumber DESC';
        try {
            const { rows, rowCount } = await db.query(findAllQuery);
            return res.status(200).send({ rows, rowCount });
        } catch(error) {
            return res.status(400).send(error);
        }
    },
    
    async getOne(req, res) {
        const text = 'SELECT * FROM orders WHERE orderNumber = $1';
        try {
            const { rows } = await db.query(text, [req.params.orderNumber]);
            if (!rows[0]) {
                return res.status(404).send({'message': 'order not found'});
            }
            return res.status(200).send(rows[0]);
        } catch(error) {
            return res.status(400).send(error)
        }
    },
    
    async update(req, res) {
        const findOneQuery = 'SELECT * FROM orders WHERE orderNumber = $1';
        const updateOneQuery =`UPDATE orders
            SET status=$1
            WHERE orderNumber=$2 returning *`;
        try {
            const { rows } = await db.query(findOneQuery, [req.params.orderNumber]);
            if(!rows[0]) {
                return res.status(404).send({'message': 'order not found'});
            }
            const values = [
                req.body.status || rows[0].status,
                req.params.orderNumber
            ];
            const response = await db.query(updateOneQuery, values);
            return res.status(200).send(response.rows[0]);
        } catch(err) {
            return res.status(400).send(err);
        }
    },
}

export default Order;
