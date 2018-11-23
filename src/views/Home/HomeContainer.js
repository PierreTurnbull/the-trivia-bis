import React, { Component } from 'react';
import Home from './Home';
import api from '../../helpers/api';

class HomeContainer extends Component {
  state = {
    categoriesFinished: [],
    categoriesUnfinished: []
  }
  async componentDidMount() {
    const categories = await api.getCategories();
    let categoriesFinished = [];
    let categoriesUnfinished = [];

    // split categories between the ones that have already been finished (win or lose) and the others
    categories.forEach(category => {
      const hasLost = localStorage[`${category.id}-lives`] === '0';
      const hasWon = localStorage[`${category.id}-currentQuestionIndex`] >= category.clues_count;

      hasLost || hasWon
        ? categoriesFinished.push(category)
        : categoriesUnfinished.push(category);
    })
    this.setState({
      categoriesFinished,
      categoriesUnfinished
    });
  }
  render() {
    return (
      <Home categoriesFinished={this.state.categoriesFinished} categoriesUnfinished={this.state.categoriesUnfinished} />
    );
  }
}

export default HomeContainer;