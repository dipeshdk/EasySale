import React, { Component } from 'react';
import './OrderList.css';
import List from '@material-ui/core/List';
// import ListSubheader from '@material-ui/core/ListSubheader';
import OrderListItem from '../OrderListItem/OrderListItem';

class OrderList extends Component {


    orderListItems = this.props.orders.map((order) => {
        return (
            <OrderListItem key={toString(order.orderNumber)} {...order} />
        )
    });

    render() {
        return (
            <div className="col-md-12 order-list">
                <List>
                    {this.orderListItems}
                </List>
            </div>
        )
    }
}

export default OrderList;