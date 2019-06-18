import React, { Component } from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import './OrderListItem.css';

class OrderListItem extends Component {
    render() {
        return (
            <a className='list-item' href="https://www.google.com">
                <ListItem alignItems='flex-start'>
                    <ListItemAvatar>
                        <span className="orderNumber">&#35;{this.props.orderNumber}</span>
                    </ListItemAvatar>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <ListItemText primary={this.props.status} secondary={'Expected By: ' + this.props.expectedDate} className='order-info' />
                    <ListItemAvatar>
                        <i className='material-icons arrow'>arrow_forward_ios</i>
                    </ListItemAvatar>
                </ListItem>
            </a>
        );
    }
}

export default OrderListItem;