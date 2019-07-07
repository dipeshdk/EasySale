import db from '../db';
let auth = require('./Authentication');

const Order = {
    async create(req, res) {
        let data = auth.authuser(req);
        if(data !== null)
        {
            const text = `INSERT INTO
            orders(expectedBy, status, id, name, rate, quantity, totalAmount, user_id)
            SELECT $1, $2, array_agg(id ORDER BY cartid), array_agg(name ORDER BY cartid), array_agg(rate ORDER BY cartid), array_agg(quantity ORDER BY cartid), $3, $4
            FROM cart WHERE user_id=$4 GROUP BY user_id
            returning *`;

            const values = [
                req.body.expectedBy,
                req.body.status,
                req.body.totalAmount,
                req.body.user_id
            ];
            try {
                const { rows } = await db.query(text, values);
                return res.status(201).send(rows[0]);
            } catch(error) {
                return res.status(400).send(error);
            }
        }
    },

    async getAllPending(req, res) {
        const findAllQuery = `SELECT * FROM orders WHERE status='pending' ORDER BY orderNumber DESC`;
        try {
            const { rows, rowCount } = await db.query(findAllQuery);
            return res.status(200).send({ rows, rowCount });
        } catch(error) {
            return res.status(400).send(error);
        }
    },

    async getAll(req, res) {
        let data = auth.authuser(req);
        if(data !== null && data.name === "admin")
        {
            const findAllQuery = 'SELECT * FROM orders ORDER BY orderNumber DESC';
            try {
                const { rows, rowCount } = await db.query(findAllQuery);
                return res.status(200).send({ rows, rowCount });
            } catch(error) {
                return res.status(400).send(error);
            }
        }
        else
        {
            res.status(400).send({'message' : 'Product cannot be created.'});
        }
    },

    async getOneUser(req, res) {
        const findAllQuery = 'SELECT * FROM orders WHERE user_id = $1 ORDER BY orderNumber DESC';
        try {
            const { rows, rowCount } = await db.query(findAllQuery, [req.params.user_id]);
            return res.status(200).send({ rows, rowCount });
        } catch(error) {
            return res.status(400).send(error);
        }
    },
    
    async getOne(req, res) {
        let data = auth.authuser(req);
        if(data !== null && data.name === "admin")
        {
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
        }
        else
        {
            res.status(400).send({'message' : 'Product cannot be created.'});
        }
    },
    
    async update(req, res) {
        let data = auth.authuser(req);
        if(data !== null && data.name === "admin")
        {
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
        }
        else
        {
            res.status(400).send({'message' : 'Product cannot be created.'});
        }
    },
}

export default Order;