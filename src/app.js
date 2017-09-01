import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {removeExpense, addExpense, fetchExpenses} from './actions/index';
import moment from 'moment';
const css = require('./stylesheets/style.scss');
import { Link } from 'react-router-dom';
import firebase from 'firebase';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      expenses: []
    }
    this.fetchExpenses = this.fetchExpenses.bind(this);
    this.categoryIcon = this.categoryIcon.bind(this);
  }
  componentDidMount(){
    this.fetchExpenses();
  }
  componentWillUnmount(){
    var ref = firebase.database().ref('expenses');
    ref.off();
  }
  removeExpense(key){
    this.props.removeExpense(key);
  }
  // Load Initial Data
  fetchExpenses(){
    var ref = firebase.database().ref('expenses');
    var self = this;
    ref.on('value', snapshot => {
      var expenseData = [];
      snapshot.forEach(function(childSnapshot) {
        var childData = childSnapshot.val();
        expenseData.push(childData);
      });
      self.setState({expenses: expenseData});
    })
  }
  categoryIcon(icon){
    console.log(icon);
    switch(icon) {
      case 'books':
        return "book";
      case 'cloths':
        return "restaurant_menu";
      case 'electricity':
        return "restaurant_menu";
      case 'food':
        return "restaurant_menu";
      case 'fruits':
        return "restaurant_menu";
      case 'grocery':
        return "local_grocery_store";
      case 'internet':
        return "wifi_tethering";
      case 'mobile':
        return "stay_current_portrait";
      case 'travelling':
        return "directions_bus";
      case 'uncategorized':
        return "local_offer";
      case 'vegetables':
        return "local_mall";
      default:
        return "local_offer";
     }
  }

  render(){
    let expenseArr = this.state.expenses;
    let renderExpenseItems;
    if(expenseArr.length > 0){
      renderExpenseItems = expenseArr.map((item, key = item.id) => (
        <tr key={item.id}>
          {/* <Link 
            to = {`/expense-details/${ item.id }`}
          > */}
            <td>
              <i className="material-icons">{this.categoryIcon(item.category)}</i>
            </td>
            <td>{item.payee}</td>
            <td>{moment(item.date).format("hh.mm A, DD/MM/YYYY")}</td>
            <td>{item.comment}</td>
            <td className="text-ar">{item.amount}</td>
          {/* </Link> */}
          {/* <button className="button-inline" onClick={this.removeExpense.bind(this, item.id)}>Remove</button> */}
        </tr>
      ))
    }else{
      renderExpenseItems = "Loading data, please wait..!"
    }
    return(
      <div className="container">
        <table>
        <thead>
          <tr>
            <th></th>
            <th>Payee</th>
            <th>Date</th>
            <th>Comment</th>
            <th className="text-ar">Amount</th>
          </tr>
        </thead>
        <tbody>
          {renderExpenseItems}
        </tbody>
      </table>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    expense: state
  };
}

function mapDispatchToProps(dispatch) {
  return (
    bindActionCreators({
      removeExpense : removeExpense
    }, dispatch)
  )
}
export default connect(mapStateToProps,mapDispatchToProps)(App);